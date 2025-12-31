"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { PhotoUpdate } from "@/types/recovery";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, User, CheckCircle } from "lucide-react";

interface PhotoTimelineProps {
  photos: PhotoUpdate[];
}

export function PhotoTimeline({ photos }: PhotoTimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">
          Belum ada foto update untuk titik pemulihan ini
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Jadilah yang pertama mengupload foto progress!
        </p>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];
  const progress = ((currentIndex + 1) / photos.length) * 100;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      {/* Main Photo Display */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video w-full bg-muted">
          {currentPhoto && (
            <Image
              src={currentPhoto.image_url}
              alt={currentPhoto.description || "Photo update"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority={currentIndex === 0}
            />
          )}

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100"
                onClick={goToNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Photo Counter Badge */}
          <div className="absolute right-4 top-4">
            <Badge variant="secondary" className="opacity-90">
              {currentIndex + 1} / {photos.length}
            </Badge>
          </div>
        </div>

        {/* Photo Info */}
        <div className="p-4">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-foreground">
                {currentPhoto?.description}
              </p>
            </div>
            {currentPhoto?.verification_status === "verified" && (
              <Badge variant="secondary" className="shrink-0">
                <CheckCircle className="mr-1 h-3 w-3" />
                Terverifikasi
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {currentPhoto &&
                format(new Date(currentPhoto.upload_date), "d MMMM yyyy", {
                  locale: localeId,
                })}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Upload oleh warga
            </div>
          </div>
        </div>
      </Card>

      {/* Timeline Progress Bar */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress Dokumentasi</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timeline Thumbnails */}
      {photos.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Timeline Foto</h4>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                  index === currentIndex
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground"
                }`}
              >
                <Image
                  src={photo.thumbnail_url}
                  alt={`Update ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-center text-[10px] text-white">
                  {format(new Date(photo.upload_date), "d MMM", {
                    locale: localeId,
                  })}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Before/After Comparison (if exactly 2 photos) */}
      {photos.length === 2 && (
        <Card className="p-4">
          <h4 className="mb-3 text-sm font-semibold">Perbandingan Sebelum & Sesudah</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="relative mb-2 aspect-video overflow-hidden rounded-md">
                <Image
                  src={photos[0]!.image_url}
                  alt="Sebelum"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
              <p className="text-xs font-medium">Sebelum</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(photos[0]!.upload_date), "d MMM yyyy", {
                  locale: localeId,
                })}
              </p>
            </div>
            <div>
              <div className="relative mb-2 aspect-video overflow-hidden rounded-md">
                <Image
                  src={photos[1]!.image_url}
                  alt="Sesudah"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
              <p className="text-xs font-medium">Sesudah</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(photos[1]!.upload_date), "d MMM yyyy", {
                  locale: localeId,
                })}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
