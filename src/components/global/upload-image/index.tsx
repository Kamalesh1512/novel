"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react"; // Icon for remove button
import Image from "next/image";
import { toast } from "sonner";
import axios from "axios";
import { useProductStore } from "@/store/productStore";
import { uploadToAzure } from "@/lib/utils/upload-to-azureblobstorage";

interface ImageUploadProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  sourceFolderName?: string;
}

export default function ImageUpload({
  images,
  setImages,
  sourceFolderName,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { updateProduct, setProducts, products } = useProductStore();

  const handleUpload = async (file: File) => {
    try {
      const blobUrl = await uploadToAzure({
        file,
        folder: sourceFolderName || "Product_Images",
        onProgress: setUploadProgress,
      });

      // Update images list
      setImages((prev) => [...prev, blobUrl]);

      toast.success("✅ Image uploaded successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(`⚠️ Upload failed: ${error.message || "Unknown error"}`);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      await Promise.all(acceptedFiles.map(handleUpload));
      setUploading(false);
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div className="space-y-4">
      {/* Dropzone UI */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} disabled={uploading} />
        {isDragActive ? (
          <p className="text-blue-500 font-semibold">Drop the images here...</p>
        ) : (
          <p className="text-gray-600">
            Drag & drop images here or click to upload
          </p>
        )}
      </div>
      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* Preview Images */}

      <div className="flex flex-wrap gap-3">
        {images.map((image: string) => (
          <div key={image} className="relative">
            <Image
              src={image}
              alt="Uploaded"
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
            <button
              onClick={() =>
                setImages((prev) => prev.filter((img) => img !== image))
              }
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
