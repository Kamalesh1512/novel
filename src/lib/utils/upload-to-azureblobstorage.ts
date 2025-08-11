import axios from "axios";

type UploadToAzureOptions = {
  file: File;
  folder?: string; // e.g., "user_avatars", "reviews", "products"
  onProgress?: (progress: number) => void;
};

export const uploadToAzure = async ({
  file,
  folder = "general",
  onProgress,
}: UploadToAzureOptions): Promise<string> => {
  try {
    // 1️⃣ Get SAS URL
    const response = await fetch("/api/generate-sas-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        folder,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get SAS URL");
    }

    const { sasUrl, blobUrl } = await response.json();

    // 2️⃣ Upload with progress
    await axios.put(sasUrl, file, {
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress(percent);
        }
      },
    });

    return blobUrl; // Return final uploaded image URL
  } catch (error: any) {
    console.error("Azure Upload Error:", error);
    throw new Error(error.message || "Upload failed");
  }
};
