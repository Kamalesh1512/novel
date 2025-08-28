import { NextResponse } from "next/server";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { fileName, fileType, folder = "general" } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "Missing file name or type" },
        { status: 400 }
      );
    }

    const accountName = process.env.NEXT_AZURE_STORAGE_ACCOUNT_NAME!;
    const accountKey = process.env.NEXT_AZURE_STORAGE_ACCOUNT_KEY!;
    const containerName = process.env.NEXT_AZURE_STORAGE_CONTAINER_NAME!;

    // Generate a unique file path: folder/uuid-filename
    const uniqueFileName = `${folder}/${uuidv4()}-${fileName}`;

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const expiresOn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const sasOptions = {
      containerName: containerClient.containerName,
      blobName: uniqueFileName,
      permissions: BlobSASPermissions.parse("cw"), // create + write
      expiresOn,
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

    const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${uniqueFileName}?${sasToken}`;
    const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${uniqueFileName}`;

    return NextResponse.json({ sasUrl, blobUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Error generating SAS URL:", error);
    return NextResponse.json({ error: "Failed to generate SAS URL" }, { status: 500 });
  }
}


