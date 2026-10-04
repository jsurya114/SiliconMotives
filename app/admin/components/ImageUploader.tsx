"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, Check } from "lucide-react";
import { uploadImage } from "../lib/data";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

interface ImageUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  recommendedSize?: string;
  disableCrop?: boolean;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Upload Image",
  recommendedSize,
  disableCrop = false,
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP, AVIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setError("");

    if (disableCrop) {
      // Direct upload
      await uploadFile(file);
    } else {
      // Show cropper
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File | Blob) => {
    setLoading(true);
    setError("");

    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setIsCropping(false);
      setImageSrc(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setLoading(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedBlob) {
        await uploadFile(croppedBlob);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to crop image");
      setLoading(false);
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-navy mb-1.5">
        {label}
        {recommendedSize && (
          <span className="text-gray-400 font-normal ml-2">({recommendedSize})</span>
        )}
      </label>

      {error && <p className="text-sm text-red-600 mb-2 font-medium">{error}</p>}

      {/* CROP MODAL */}
      {isCropping && imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white rounded-xl overflow-hidden w-full max-w-2xl flex flex-col h-[80vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-navy text-lg">Crop Image</h3>
              <button onClick={handleCancelCrop} className="text-gray-500 hover:text-navy">
                <X size={20} />
              </button>
            </div>
            
            <div className="relative flex-1 bg-gray-900 w-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-4 border-t border-gray-100 bg-white space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-coral"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelCrop}
                  disabled={loading}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  disabled={loading}
                  className="px-6 py-2 bg-coral hover:bg-coral-hover text-white font-medium rounded-lg flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                  {loading ? "Uploading..." : "Apply & Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NORMAL VIEW */}
      {!isCropping && (
        <>
          {value ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-200 group bg-gray-50 h-48">
              <Image
                src={value}
                alt="Uploaded image preview"
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  title="Remove Image"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-coral transition-colors bg-white h-48 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp, image/avif"
                className="hidden"
              />
              {loading ? (
                <div className="flex flex-col items-center text-coral">
                  <Loader2 className="animate-spin mb-2" size={32} />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-coral/10 text-coral flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-medium text-navy mb-1">Click to upload image</p>
                  <p className="text-xs text-gray-500">PNG, JPG, WebP, or AVIF (Max 5MB)</p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
