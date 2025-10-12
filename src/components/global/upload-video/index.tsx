"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Video, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VideoUploadProps {
  videos: string[];
  setVideos: React.Dispatch<React.SetStateAction<string[]>>;
  sourceFolderName?: string;
  maxSizeMB?: number;
  maxVideos?: number;
}

export default function VideoUpload({
  videos,
  setVideos,
  sourceFolderName = "Product_Videos",
  maxSizeMB = 50,
  maxVideos = 5,
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState<string>("");

  const uploadToAzure = async (file: File): Promise<string> => {
    try {
      // Get SAS URL
      const response = await fetch("/api/generate-sas-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          folder: sourceFolderName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get SAS URL");
      }

      const { sasUrl, blobUrl } = await response.json();

      // Upload with progress using fetch
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 201) {
            resolve(blobUrl);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.open("PUT", sasUrl);
        xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error: any) {
      console.error("Azure Upload Error:", error);
      throw new Error(error.message || "Upload failed");
    }
  };

  const validateVideo = (file: File): string | null => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return `File size exceeds ${maxSizeMB}MB limit. Current size: ${fileSizeMB.toFixed(2)}MB`;
    }

    // Check video format
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo",
    ];
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file format. Allowed formats: MP4, WebM, OGG, MOV, AVI`;
    }

    // Check total videos limit
    if (videos.length >= maxVideos) {
      return `Maximum ${maxVideos} videos allowed`;
    }

    return null;
  };

  const handleUpload = async (file: File) => {
    try {
      setCurrentFileName(file.name);
      const blobUrl = await uploadToAzure(file);
      setVideos((prev) => [...prev, blobUrl]);
      toast.success(`✅ ${file.name} uploaded successfully!`);
    } catch (error: any) {
      console.error(error);
      toast.error(`⚠️ Upload failed: ${error.message || "Unknown error"}`);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach((rejection) => {
          toast.error(`${rejection.file.name} was rejected`);
        });
      }

      // Validate and filter accepted files
      const validFiles: File[] = [];
      for (const file of acceptedFiles) {
        const error = validateVideo(file);
        if (error) {
          toast.error(error);
        } else {
          validFiles.push(file);
        }
      }

      if (validFiles.length === 0) return;

      setUploading(true);
      setUploadProgress(0);

      // Upload files sequentially to avoid overwhelming the server
      for (const file of validFiles) {
        await handleUpload(file);
      }

      setUploading(false);
      setUploadProgress(0);
      setCurrentFileName("");
    },
    [videos, maxVideos, maxSizeMB]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/ogg": [".ogg"],
      "video/quicktime": [".mov"],
      "video/x-msvideo": [".avi"],
    },
    multiple: true,
    disabled: uploading || videos.length >= maxVideos,
  });

  const removeVideo = (videoUrl: string) => {
    setVideos((prev) => prev.filter((vid) => vid !== videoUrl));
    toast.success("Video removed");
  };

  return (
    <div className="space-y-4">
      {/* Dropzone UI */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : uploading || videos.length >= maxVideos
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Video className="mx-auto mb-2 text-gray-400" size={32} />
        {isDragActive ? (
          <p className="text-blue-500 font-semibold">Drop the videos here...</p>
        ) : uploading ? (
          <div className="space-y-2">
            <p className="text-gray-600 font-medium">Uploading...</p>
            <p className="text-sm text-gray-500">{currentFileName}</p>
          </div>
        ) : videos.length >= maxVideos ? (
          <p className="text-gray-500">Maximum {maxVideos} videos reached</p>
        ) : (
          <div className="space-y-1">
            <p className="text-gray-600 font-medium">
              Drag & drop videos here or click to upload
            </p>
            <p className="text-xs text-gray-500">
              MP4, WebM, OGG, MOV, AVI (max {maxSizeMB}MB) • {videos.length}/{maxVideos} uploaded
            </p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && uploadProgress > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Video Previews */}
      {videos.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded Videos ({videos.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videos.map((videoUrl, index) => (
              <div
                key={videoUrl}
                className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
              >
                <video
                  src={videoUrl}
                  className="w-full h-40 object-cover"
                  controls
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
                <button
                  onClick={() => removeVideo(videoUrl)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                  title="Remove video"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Video {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}