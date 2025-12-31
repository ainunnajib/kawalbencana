"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { RecoveryPoint } from "@/types/recovery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PhotoTimeline } from "./PhotoTimeline";
import { PhotoUploadForm } from "./PhotoUploadForm";
import { CommentForm } from "./CommentForm";
import { CommentsList } from "./CommentsList";
import { getPhotosForRecoveryPoint } from "@/utils/data/mockPhotoUpdates";
import { getCommentsForRecoveryPoint } from "@/utils/data/mockComments";
import { useComments, usePhotos } from "@/hooks/useSupabaseData";
import {
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  Camera,
  FileText,
  MessageSquare,
  Upload,
  TrendingUp,
  Loader2,
} from "lucide-react";

interface RecoveryPointDetailProps {
  point: RecoveryPoint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryLabels: Record<string, string> = {
  bridge: "Jembatan",
  road: "Jalan",
  farm: "Sawah/Ladang",
  market: "Pasar",
  school: "Sekolah",
  hospital: "Rumah Sakit",
  house: "Perumahan",
  worship_place: "Tempat Ibadah",
  government_building: "Gedung Pemerintah",
  water_system: "Sistem Air",
  power_grid: "Jaringan Listrik",
  other: "Lainnya",
};

const damageLabels: Record<string, string> = {
  light: "Ringan",
  moderate: "Sedang",
  severe: "Parah",
  total: "Hancur Total",
};

const statusLabels: Record<string, string> = {
  not_started: "Belum Dimulai",
  in_progress: "Dalam Proses",
  completed: "Selesai",
};

const statusColors: Record<string, string> = {
  not_started: "destructive",
  in_progress: "default",
  completed: "secondary",
};

function calculateProgress(point: RecoveryPoint): number {
  if (point.status === "completed") return 100;
  if (point.status === "not_started") return 0;

  // For in_progress, calculate based on actual cost vs estimated cost
  if (point.actual_cost && point.estimated_cost) {
    return Math.min((point.actual_cost / point.estimated_cost) * 100, 95);
  }

  // Default progress for in_progress
  return 45;
}

export function RecoveryPointDetail({
  point,
  open,
  onOpenChange,
}: RecoveryPointDetailProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Fetch from Supabase (with real-time updates)
  const {
    comments: supabaseComments,
    loading: commentsLoading,
    refetch: refetchComments,
  } = useComments(point?.id || "");

  const {
    photos: supabasePhotos,
    loading: photosLoading,
    refetch: refetchPhotos,
  } = usePhotos(point?.id || "");

  // Get mock data as fallback
  const mockPhotos = useMemo(
    () => (point ? getPhotosForRecoveryPoint(point.id) : []),
    [point]
  );
  const mockComments = useMemo(
    () => (point ? getCommentsForRecoveryPoint(point.id) : []),
    [point]
  );

  // Use Supabase data if available, otherwise fall back to mock data
  // For now, combine both (Supabase first, then mock) for demo purposes
  const photos = useMemo(() => {
    if (supabasePhotos.length > 0) {
      // Transform Supabase photos to match PhotoUpdate type expected by PhotoTimeline
      return supabasePhotos.map((p) => ({
        id: p.id,
        recovery_point_id: p.recovery_point_id,
        image_url: p.image_url,
        thumbnail_url: p.thumbnail_url,
        uploaded_by: p.uploader_name || "Pengguna",
        upload_date: p.upload_date,
        description: p.description || "",
        verification_status: p.verification_status,
        geolocation_verified: p.geolocation_verified,
      }));
    }
    return mockPhotos;
  }, [supabasePhotos, mockPhotos]);

  const comments = useMemo(() => {
    if (supabaseComments.length > 0) {
      return supabaseComments;
    }
    return mockComments;
  }, [supabaseComments, mockComments]);

  if (!point) return null;

  const progress = calculateProgress(point);

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    refetchPhotos(); // Refresh photos from Supabase
  };

  const handleCommentPosted = () => {
    refetchComments(); // Refresh comments from Supabase
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{point.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Detail informasi pemulihan untuk {point.name}
          </DialogDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant={statusColors[point.status] as never}>
              {statusLabels[point.status]}
            </Badge>
            <Badge variant="outline">{damageLabels[point.damage_level]}</Badge>
            <Badge variant="secondary">{categoryLabels[point.category]}</Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <FileText className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="photos">
              <Camera className="mr-2 h-4 w-4" />
              Foto ({photos.length})
            </TabsTrigger>
            <TabsTrigger value="comments">
              <MessageSquare className="mr-2 h-4 w-4" />
              Komentar
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Progress Pemulihan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Status: {statusLabels[point.status]}</span>
                    <span className="text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                {point.target_completion_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Target selesai:</span>
                    <span className="font-medium">
                      {format(new Date(point.target_completion_date), "d MMMM yyyy", {
                        locale: localeId,
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail Informasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <AlertCircle className="h-4 w-4" />
                    Deskripsi Kerusakan
                  </h4>
                  <p className="text-sm text-muted-foreground">{point.description}</p>
                </div>

                <Separator />

                {/* Location */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="h-4 w-4" />
                    Lokasi
                  </h4>
                  <p className="text-sm text-muted-foreground">{point.address}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Koordinat: {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                  </p>
                </div>

                <Separator />

                {/* Budget */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <DollarSign className="h-4 w-4" />
                    Anggaran
                  </h4>
                  <div className="space-y-1 text-sm">
                    {point.estimated_cost && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimasi biaya:</span>
                        <span className="font-medium">
                          Rp {(point.estimated_cost / 1000000000).toFixed(1)} Miliar
                        </span>
                      </div>
                    )}
                    {point.actual_cost && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Biaya terealisasi:</span>
                        <span className="font-medium">
                          Rp {(point.actual_cost / 1000000000).toFixed(1)} Miliar
                        </span>
                      </div>
                    )}
                    {point.estimated_cost && point.actual_cost && (
                      <div className="flex justify-between border-t pt-1">
                        <span className="text-muted-foreground">Sisa kebutuhan:</span>
                        <span className="font-medium">
                          Rp{" "}
                          {((point.estimated_cost - point.actual_cost) / 1000000000).toFixed(1)}{" "}
                          Miliar
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <p className="font-medium">Dibuat:</p>
                    <p>
                      {format(new Date(point.created_at), "d MMM yyyy, HH:mm", {
                        locale: localeId,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Update terakhir:</p>
                    <p>
                      {format(new Date(point.updated_at), "d MMM yyyy, HH:mm", {
                        locale: localeId,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="flex gap-2">
              <Button className="flex-1" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Beri Komentar
              </Button>
              <Button className="flex-1" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Lihat Kebutuhan
              </Button>
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-4">
            {!showUploadForm ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Timeline Foto Pemulihan</h3>
                    <p className="text-sm text-muted-foreground">
                      {photosLoading ? "Memuat..." : `${photos.length} foto update tersedia`}
                    </p>
                  </div>
                  <Button onClick={() => setShowUploadForm(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Foto
                  </Button>
                </div>

                {photosLoading ? (
                  <Card className="p-8">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Memuat foto...</p>
                    </div>
                  </Card>
                ) : (
                  <PhotoTimeline photos={photos} />
                )}

                {photos.length > 0 && !photosLoading && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Tips:</strong> Upload foto progress setiap bulan untuk
                        membantu monitoring pemulihan. Foto yang jelas dan berkualitas sangat
                        membantu!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <PhotoUploadForm
                recoveryPointId={point.id}
                recoveryPointName={point.name}
                onSuccess={handleUploadSuccess}
                onCancel={() => setShowUploadForm(false)}
              />
            )}
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Komentar & Diskusi</h3>
              <p className="text-sm text-muted-foreground">
                Diskusi tentang pemulihan {point.name}
              </p>
            </div>

            {/* Comment Form */}
            <Card className="p-4">
              <h4 className="mb-3 text-sm font-semibold">Tulis Komentar</h4>
              <CommentForm
                recoveryPointId={point.id}
                onCommentPosted={handleCommentPosted}
              />
            </Card>

            {/* Comments List */}
            {commentsLoading ? (
              <Card className="p-8">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Memuat komentar...</p>
                </div>
              </Card>
            ) : (
              <CommentsList comments={comments} />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
