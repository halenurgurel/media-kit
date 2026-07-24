"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  currentImageUrl?: string;
  label?: string;
  shape?: "circle" | "square";
  onUploaded: (url: string) => void;
}

export function ImageUploader({
  currentImageUrl,
  label = "Upload image",
  shape = "circle",
  onUploaded,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setError(null);
      setIsUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        onUploaded(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload image.");
      } finally {
        setIsUploading(false);
      }
    },
    [onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-cream-200 p-6 text-center text-sm text-charcoal-600 transition-colors",
          isDragActive && "border-mauve-400 bg-mauve-50"
        )}
      >
        <input {...getInputProps()} />
        {currentImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentImageUrl}
            alt={label}
            className={cn(
              "h-20 w-20 object-cover",
              shape === "circle" ? "rounded-full" : "rounded-md"
            )}
          />
        ) : null}
        {isUploading ? (
          <span className="flex items-center gap-2 text-charcoal-400">
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-cream-200 border-t-mauve-400"
            />
            Uploading...
          </span>
        ) : (
          <span>{label}</span>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
