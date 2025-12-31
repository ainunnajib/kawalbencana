import type { Comment } from "@/types/comment";

export const mockComments: Comment[] = [
  // Jembatan Krueng Aceh (id: 1)
  {
    id: "comment-1",
    user_id: "user-1",
    user_name: "Budi Santoso",
    recovery_point_id: "1",
    content:
      "Alhamdulillah progresnya mulai kelihatan. Semoga cepat selesai karena jembatan ini sangat penting untuk akses ke pasar.",
    created_at: "2025-01-21T08:30:00Z",
  },
  {
    id: "comment-2",
    user_id: "user-2",
    user_name: "Siti Aminah",
    recovery_point_id: "1",
    content:
      "Apakah ada estimasi kapan jembatan bisa digunakan lagi? Kami harus memutar jauh sekarang.",
    created_at: "2025-01-22T14:15:00Z",
  },
  {
    id: "comment-3",
    user_id: "admin",
    user_name: "Tim Pemulihan Aceh",
    recovery_point_id: "1",
    content:
      "Target completion adalah akhir Maret 2025. Tim sedang bekerja keras untuk mempercepat proses. Terima kasih atas kesabarannya.",
    created_at: "2025-01-22T16:00:00Z",
  },

  // Sawah Desa Lampuuk (id: 2)
  {
    id: "comment-4",
    user_id: "user-3",
    user_name: "Pak Usman",
    recovery_point_id: "2",
    content:
      "Sebagai petani yang terdampak, kami sangat berharap ada bantuan bibit dan pupuk setelah pembersihan selesai.",
    created_at: "2025-01-15T10:00:00Z",
  },
  {
    id: "comment-5",
    user_id: "user-4",
    user_name: "NGO Tani Maju",
    recovery_point_id: "2",
    content:
      "Kami siap membantu dengan program pendampingan dan penyediaan bibit padi unggul untuk para petani.",
    created_at: "2025-01-16T09:30:00Z",
  },

  // SDN 1 Lhoknga (id: 4)
  {
    id: "comment-6",
    user_id: "user-5",
    user_name: "Ibu Fatimah",
    recovery_point_id: "4",
    content:
      "Anak-anak sudah kangen belajar di sekolah yang layak. Saat ini mereka belajar di tenda darurat.",
    created_at: "2025-01-18T11:00:00Z",
  },
  {
    id: "comment-7",
    user_id: "user-6",
    user_name: "Pak Guru Ahmad",
    recovery_point_id: "4",
    content:
      "Terima kasih untuk progress yang cepat. Semoga bisa selesai sebelum tahun ajaran baru dimulai.",
    created_at: "2025-01-20T15:45:00Z",
  },

  // RS Kabanjahe (id: 7)
  {
    id: "comment-8",
    user_id: "user-7",
    user_name: "Dr. Rahman",
    recovery_point_id: "7",
    content:
      "Perbaikan sistem listrik dan air sangat membantu. Sekarang kami bisa melayani pasien dengan lebih baik.",
    created_at: "2025-01-10T08:00:00Z",
  },
  {
    id: "comment-9",
    user_id: "user-8",
    user_name: "Warga Kabanjahe",
    recovery_point_id: "7",
    content:
      "Syukur RS sudah mulai normal lagi. Kemarin ibu saya bisa dirawat dengan baik di sini.",
    created_at: "2025-01-12T13:20:00Z",
  },

  // Pemukiman Lubuk Basung (id: 12)
  {
    id: "comment-10",
    user_id: "user-9",
    user_name: "Kepala Desa Lubuk Basung",
    recovery_point_id: "12",
    content:
      "Pembangunan 20 rumah tahap pertama sangat cepat. Terima kasih kepada semua pihak yang membantu.",
    created_at: "2025-01-19T09:00:00Z",
  },
  {
    id: "comment-11",
    user_id: "user-10",
    user_name: "Ibu Rosmini",
    recovery_point_id: "12",
    content:
      "Kami yang kehilangan rumah sangat bersyukur. Tidak sabar menunggu rumah selesai dibangun.",
    created_at: "2025-01-20T10:30:00Z",
  },
  {
    id: "comment-12",
    user_id: "user-11",
    user_name: "Kontraktor PT Maju Bersama",
    recovery_point_id: "12",
    content:
      "Target kami adalah menyelesaikan 20 unit pertama dalam 2 bulan. Saat ini sudah 60% dan on track.",
    created_at: "2025-01-21T14:00:00Z",
  },
];

// Helper function to get comments for a specific recovery point
export function getCommentsForRecoveryPoint(
  recoveryPointId: string
): Comment[] {
  return mockComments
    .filter((comment) => comment.recovery_point_id === recoveryPointId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ); // Most recent first
}
