"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Comment } from "@/types/comment";

// Type for photo from Supabase
export interface PhotoUpdate {
  id: string;
  recovery_point_id: string;
  image_url: string;
  thumbnail_url: string;
  uploaded_by: string;
  upload_date: string;
  description: string | null;
  verification_status: "pending" | "verified" | "rejected";
  geolocation_verified: boolean;
  created_at: string;
  // Joined user data
  uploader_name?: string;
  uploader_avatar?: string;
}

// Type for comment from Supabase (with user data)
export interface CommentWithUser extends Comment {
  users?: {
    name: string;
    avatar_url?: string;
    role?: string;
  };
}

// Hook to fetch comments for a recovery point
export function useComments(recoveryPointId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!recoveryPointId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("comments")
        .select(`
          id,
          user_id,
          recovery_point_id,
          content,
          created_at
        `)
        .eq("recovery_point_id", recoveryPointId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Transform data to match Comment type
      const transformedComments: Comment[] = (data || []).map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        user_name: "Pengguna", // User data from auth, not separate table
        user_avatar: undefined,
        recovery_point_id: item.recovery_point_id,
        content: item.content,
        created_at: item.created_at,
      }));

      setComments(transformedComments);
    } catch (err) {
      // Silently fail - fallback to mock data will be used
      setError(err instanceof Error ? err.message : "Gagal memuat komentar");
    } finally {
      setLoading(false);
    }
  }, [recoveryPointId]);

  // Subscribe to real-time updates
  useEffect(() => {
    fetchComments();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`comments:${recoveryPointId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `recovery_point_id=eq.${recoveryPointId}`,
        },
        () => {
          // Refresh comments when changes occur
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [recoveryPointId, fetchComments]);

  return { comments, loading, error, refetch: fetchComments };
}

// Hook to fetch photos for a recovery point
export function usePhotos(recoveryPointId: string) {
  const [photos, setPhotos] = useState<PhotoUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    if (!recoveryPointId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("photo_updates")
        .select(`
          id,
          recovery_point_id,
          image_url,
          thumbnail_url,
          uploaded_by,
          upload_date,
          description,
          verification_status,
          geolocation_verified,
          created_at
        `)
        .eq("recovery_point_id", recoveryPointId)
        .order("upload_date", { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Transform data to match PhotoUpdate type
      const transformedPhotos: PhotoUpdate[] = (data || []).map((item: any) => ({
        id: item.id,
        recovery_point_id: item.recovery_point_id,
        image_url: item.image_url,
        thumbnail_url: item.thumbnail_url,
        uploaded_by: item.uploaded_by,
        upload_date: item.upload_date,
        description: item.description,
        verification_status: item.verification_status,
        geolocation_verified: item.geolocation_verified,
        created_at: item.created_at,
        uploader_name: item.users?.name,
        uploader_avatar: item.users?.avatar_url,
      }));

      setPhotos(transformedPhotos);
    } catch (err) {
      // Silently fail - fallback to mock data will be used
      setError(err instanceof Error ? err.message : "Gagal memuat foto");
    } finally {
      setLoading(false);
    }
  }, [recoveryPointId]);

  // Subscribe to real-time updates
  useEffect(() => {
    fetchPhotos();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`photos:${recoveryPointId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "photo_updates",
          filter: `recovery_point_id=eq.${recoveryPointId}`,
        },
        () => {
          // Refresh photos when changes occur
          fetchPhotos();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [recoveryPointId, fetchPhotos]);

  return { photos, loading, error, refetch: fetchPhotos };
}
