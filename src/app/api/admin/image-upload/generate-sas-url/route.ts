// app/api/admin/generate-sas-url/route.ts
import { NextResponse } from "next/server";
import { 
  BlobServiceClient, 
  StorageSharedKeyCredential, 
  BlobSASPermissions, 
  generateBlobSASQueryParameters 
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    // Parse JSON body
    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "⚠️ Missing file name or type" },
        { status: 400 }
      );
    }

    const accountName = process.env.NEXT_AZURE_STORAGE_ACCOUNT_NAME!;
    const accountKey = process.env.NEXT_AZURE_STORAGE_ACCOUNT_KEY!;
    const containerName = process.env.NEXT_AZURE_STORAGE_CONTAINER_NAME!;

    // Generate a unique file name
    const uniqueFileName = `Product_Images/${uuidv4()}-${fileName}`;

    // Blob Service Client
    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey
    );

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Set expiry to 10 mins from now
    const expiresOn = new Date(Date.now() + 10 * 60 * 1000);

    // Permissions
    const sasOptions = {
      containerName: containerClient.containerName,
      blobName: uniqueFileName,
      permissions: BlobSASPermissions.parse("rw"),
      expiresOn,
    };
    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    ).toString();

    const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${uniqueFileName}?${sasToken}`;
    const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${uniqueFileName}`;

    return NextResponse.json(
      { status: 200, sasUrl, blobUrl }
    );

  } catch (error: any) {
    console.error("⚠️ Error generating SAS URL:", error);
    return NextResponse.json(
      { error: "⚠️ Failed to generate SAS URL" },
      { status: 500 }
    );
  }
}
