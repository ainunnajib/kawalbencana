import type { PhotoUpdate } from "@/types/recovery";

// Mock photo updates for recovery points
// Using placeholder images from unsplash for demo
export const mockPhotoUpdates: PhotoUpdate[] = [
  // Jembatan Krueng Aceh (id: 1)
  {
    id: "photo-1",
    recovery_point_id: "1",
    image_url: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=400",
    uploaded_by: "user-1",
    upload_date: "2024-12-15T10:00:00Z",
    description: "Kondisi awal jembatan: Struktur utama retak parah, pilar tengah miring",
    verification_status: "verified",
    geolocation_verified: true,
  },
  {
    id: "photo-2",
    recovery_point_id: "1",
    image_url: "https://images.unsplash.com/photo-1590418866976-4e4c6a9e0dfe?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1590418866976-4e4c6a9e0dfe?w=400",
    uploaded_by: "user-2",
    upload_date: "2025-01-05T10:00:00Z",
    description: "Progress pembersihan debris dan persiapan pondasi",
    verification_status: "verified",
    geolocation_verified: true,
  },
  {
    id: "photo-3",
    recovery_point_id: "1",
    image_url: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400",
    uploaded_by: "user-1",
    upload_date: "2025-01-20T10:00:00Z",
    description: "Pembangunan pilar baru dimulai, estimasi selesai Maret 2025",
    verification_status: "verified",
    geolocation_verified: true,
  },

  // Sawah Desa Lampuuk (id: 2)
  {
    id: "photo-4",
    recovery_point_id: "2",
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
    uploaded_by: "user-3",
    upload_date: "2024-12-18T10:00:00Z",
    description: "Sawah tertimbun lumpur setinggi 2 meter, tidak ada tanaman yang tersisa",
    verification_status: "verified",
    geolocation_verified: true,
  },
  {
    id: "photo-5",
    recovery_point_id: "2",
    image_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    uploaded_by: "user-3",
    upload_date: "2025-01-10T10:00:00Z",
    description: "Tim sedang mengevaluasi kedalaman lumpur untuk rencana pembersihan",
    verification_status: "verified",
    geolocation_verified: true,
  },

  // SDN 1 Lhoknga (id: 4)
  {
    id: "photo-6",
    recovery_point_id: "4",
    image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400",
    uploaded_by: "user-4",
    upload_date: "2024-12-16T10:00:00Z",
    description: "Gedung sekolah rusak parah, atap ambruk, dinding retak",
    verification_status: "verified",
    geolocation_verified: true,
  },
  {
    id: "photo-7",
    recovery_point_id: "4",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
    uploaded_by: "user-4",
    upload_date: "2024-12-28T10:00:00Z",
    description: "Proses pembongkaran bagian yang rusak selesai",
    verification_status: "verified",
    geolocation_verified: true,
  },
  {
    id: "photo-8",
    recovery_point_id: "4",
    image_url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=400",
    uploaded_by: "user-5",
    upload_date: "2025-01-15T10:00:00Z",
    description: "Pembangunan ulang struktur dimulai, target selesai Juni 2025",
    verification_status: "verified",
    geolocation_verified: true,
  },

  // RS Kabanjahe (id: 7)
  {
    id: "photo-9",
    recovery_point_id: "7",
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400",
    uploaded_by: "user-6",
    upload_date: "2024-12-17T10:00:00Z",
    description: "Bagian IGD dan rawat inap mengalami kerusakan struktural",
    verification_status: "verified",
    geolocation_verified: true,
  },
  {
    id: "photo-10",
    recovery_point_id: "7",
    image_url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400",
    uploaded_by: "user-6",
    upload_date: "2025-01-08T10:00:00Z",
    description: "Perbaikan sistem listrik dan air selesai, renovasi struktur ongoing",
    verification_status: "verified",
    geolocation_verified: true,
  },

  // Pemukiman Lubuk Basung (id: 12)
  {
    id: "photo-11",
    recovery_point_id: "12",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    uploaded_by: "user-7",
    upload_date: "2024-12-15T10:00:00Z",
    description: "45 rumah warga hancur total, ratusan keluarga kehilangan tempat tinggal",
    verification_status: "verified",
    geolocation_verified: true,
  },
  {
    id: "photo-12",
    recovery_point_id: "12",
    image_url: "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=400",
    uploaded_by: "user-7",
    upload_date: "2024-12-30T10:00:00Z",
    description: "Pembersihan lokasi selesai, persiapan pembangunan hunian sementara",
    verification_status: "verified",
    geolocation_verified: true,
  },
  {
    id: "photo-13",
    recovery_point_id: "12",
    image_url: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
    thumbnail_url: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400",
    uploaded_by: "user-8",
    upload_date: "2025-01-18T10:00:00Z",
    description: "Pembangunan 20 unit rumah tahap pertama sudah 60%",
    verification_status: "verified",
    geolocation_verified: true,
  },
];

// Helper function to get photos for a specific recovery point
export function getPhotosForRecoveryPoint(
  recoveryPointId: string
): PhotoUpdate[] {
  return mockPhotoUpdates
    .filter((photo) => photo.recovery_point_id === recoveryPointId)
    .sort(
      (a, b) =>
        new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime()
    );
}
