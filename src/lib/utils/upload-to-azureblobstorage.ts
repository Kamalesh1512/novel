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



type UploadVideoToAzureOptions = {
  file: File;
  folder?: string; // e.g., "product_videos", "banner_videos", "promotional_videos"
  onProgress?: (progress: number) => void;
};

/**
 * Upload video to Azure Blob Storage
 * @param file - Video file to upload
 * @param folder - Destination folder in Azure (default: "videos")
 * @param onProgress - Callback for upload progress (0-100)
 * @returns Promise<string> - Returns the blob URL of uploaded video
 */
export const uploadVideoToAzure = async ({
  file,
  folder = "videos",
  onProgress,
}: UploadVideoToAzureOptions): Promise<string> => {
  try {
    // Validate file type
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid video format. Allowed: MP4, WebM, OGG, MOV, AVI");
    }

    // 1️⃣ Get SAS URL from backend
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

    // 2️⃣ Upload video to Azure with progress tracking
    await axios.put(sasUrl, file, {
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return blobUrl; // Return final uploaded video URL
  } catch (error: any) {
    console.error("Azure Video Upload Error:", error);
    throw new Error(error.message || "Video upload failed");
  }
};

/**
 * Generate video thumbnail (optional utility)
 * Extracts first frame from video as thumbnail
 */
export const generateVideoThumbnail = (
  videoFile: File
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.currentTime = 1; // Seek to 1 second
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error("Failed to generate thumbnail"));
        }
      }, "image/jpeg");
    };

    video.onerror = () => {
      reject(new Error("Error loading video"));
    };

    video.src = URL.createObjectURL(videoFile);
  });
};

/**
 * Validate video file
 */
export const validateVideoFile = (
  file: File,
  maxSizeMB: number = 50
): { valid: boolean; error?: string } => {
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit (current: ${fileSizeMB.toFixed(2)}MB)`,
    };
  }

  // Check file type
  const allowedTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo",
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid format. Allowed: MP4, WebM, OGG, MOV, AVI",
    };
  }

  return { valid: true };
};

/**
 * Get video duration (in seconds)
 */
export const getVideoDuration = (videoFile: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      reject(new Error("Error loading video metadata"));
    };

    video.src = URL.createObjectURL(videoFile);
  });
};