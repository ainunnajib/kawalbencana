"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PhotoUploadFormProps {
  recoveryPointId: string;
  recoveryPointName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PhotoUploadForm({
  recoveryPointId,
  recoveryPointName,
  onSuccess,
  onCancel,
}: PhotoUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyLocation, setVerifyLocation] = useState(false);

  // File validation
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "File harus berupa gambar";
    }

    // Check file size (max 10MB before compression)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "Ukuran file maksimal 10MB";
    }

    return null;
  };

  // Compress image
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1, // Max 1MB after compression
      maxWidthOrHeight: 1920, // Max dimension
      useWebWorker: true,
      fileType: "image/jpeg",
    };

    try {
      const compressed = await imageCompression(file, options);
      return compressed;
    } catch (err) {
      console.error("Compression error:", err);
      throw new Error("Gagal mengkompresi gambar");
    }
  };

  // Handle file drop/select
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setUploadSuccess(false);

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file) return;

    // Validate
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Set original file and preview
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Compress image
    setIsCompressing(true);
    try {
      const compressed = await compressImage(file);
      setCompressedFile(compressed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses gambar");
    } finally {
      setIsCompressing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  });

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setCompressedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setDescription("");
    setError(null);
    setUploadSuccess(false);
  };

  // Upload to Supabase Storage and save metadata
  const handleUpload = async () => {
    if (!compressedFile || !description.trim()) {
      setError("Mohon lengkapi semua field");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("Anda harus login untuk mengupload foto. Fitur login akan segera hadir!");
        setIsUploading(false);
        return;
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = compressedFile.name.split('.').pop() || 'jpg';
      const fileName = `${recoveryPointId}/${timestamp}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('recovery-photos')
        .upload(fileName, compressedFile, {
          contentType: compressedFile.type,
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Gagal upload: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recovery-photos')
        .getPublicUrl(fileName);

      // For now, use same URL for thumbnail (can add thumbnail generation later)
      const thumbnailUrl = publicUrl;

      // Insert metadata into photo_updates table
      const { error: dbError } = await supabase
        .from('photo_updates')
        .insert({
          recovery_point_id: recoveryPointId,
          image_url: publicUrl,
          thumbnail_url: thumbnailUrl,
          uploaded_by: user.id,
          description: description.trim(),
          geolocation_verified: verifyLocation,
          verification_status: 'pending'
        });

      if (dbError) {
        // If DB insert fails, try to delete the uploaded file
        await supabase.storage.from('recovery-photos').remove([fileName]);
        throw new Error(`Gagal menyimpan data: ${dbError.message}`);
      }

      setUploadSuccess(true);

      // Reset after success
      setTimeout(() => {
        handleRemoveFile();
        setUploadSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengupload foto");
    } finally {
      setIsUploading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Upload Foto Progress</h3>
        <p className="text-sm text-muted-foreground">
          Dokumentasikan pemulihan <strong>{recoveryPointName}</strong>
        </p>
      </div>

      {/* File Upload Area */}
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {isDragActive ? "Drop foto di sini..." : "Klik atau drag foto ke sini"}
              </p>
              <p className="text-sm text-muted-foreground">
                JPG, PNG, atau WebP (Max 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Preview Area */
        <Card className="overflow-hidden">
          {/* Image Preview */}
          <div className="relative aspect-video w-full bg-muted">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain"
                sizes="800px"
              />
            )}
            {isCompressing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  <p className="mt-2 text-sm">Memproses gambar...</p>
                </div>
              </div>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleRemoveFile}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* File Info */}
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {selectedFile && (
                <Badge variant="outline">
                  Original: {formatFileSize(selectedFile.size)}
                </Badge>
              )}
              {compressedFile && (
                <Badge variant="secondary">
                  Compressed: {formatFileSize(compressedFile.size)}
                  {selectedFile && (
                    <span className="ml-1 text-green-600">
                      (-
                      {Math.round(
                        ((selectedFile.size - compressedFile.size) /
                          selectedFile.size) *
                          100
                      )}
                      %)
                    </span>
                  )}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Description Field */}
      {selectedFile && !isCompressing && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Deskripsi <span className="text-destructive">*</span>
          </label>
          <Textarea
            placeholder="Jelaskan kondisi atau progress yang terlihat di foto ini..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isUploading}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Tips: Jelaskan apa yang berubah, progress apa yang terjadi, atau kondisi
            terkini
          </p>
        </div>
      )}

      {/* Location Verification */}
      {selectedFile && !isCompressing && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="verify-location"
            checked={verifyLocation}
            onChange={(e) => setVerifyLocation(e.target.checked)}
            disabled={isUploading}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="verify-location" className="text-sm">
            <MapPin className="mr-1 inline h-3 w-3" />
            Foto diambil di lokasi yang benar
          </label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-destructive bg-destructive/10 p-3">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        </Card>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <Card className="border-green-500 bg-green-500/10 p-3">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            Foto berhasil diupload! 🎉
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleUpload}
          disabled={
            !selectedFile ||
            !compressedFile ||
            !description.trim() ||
            isCompressing ||
            isUploading ||
            uploadSuccess
          }
          className="flex-1"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Foto
            </>
          )}
        </Button>
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isUploading}
          >
            Batal
          </Button>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-muted/50 p-3">
        <p className="text-xs text-muted-foreground">
          <strong>💡 Catatan:</strong> Foto akan dikompresi otomatis untuk menghemat
          bandwidth. Upload regular (setiap bulan) membantu dokumentasi pemulihan jangka
          panjang.
        </p>
      </Card>
    </div>
  );
}
