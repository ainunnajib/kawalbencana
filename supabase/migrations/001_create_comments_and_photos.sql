-- Migration: Create comments and photo_updates tables
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. Create comments table
-- ============================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recovery_point_id VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_recovery_point_id ON public.comments(recovery_point_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
-- Anyone can read comments
CREATE POLICY "Anyone can read comments"
  ON public.comments
  FOR SELECT
  USING (true);

-- Authenticated users can insert their own comments
CREATE POLICY "Authenticated users can insert comments"
  ON public.comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON public.comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON public.comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 2. Create photo_updates table
-- ============================================
CREATE TABLE IF NOT EXISTS public.photo_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recovery_point_id VARCHAR(50) NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  geolocation_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_photo_updates_recovery_point_id ON public.photo_updates(recovery_point_id);
CREATE INDEX IF NOT EXISTS idx_photo_updates_uploaded_by ON public.photo_updates(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_photo_updates_upload_date ON public.photo_updates(upload_date DESC);

-- Enable Row Level Security
ALTER TABLE public.photo_updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for photo_updates
-- Anyone can read photos
CREATE POLICY "Anyone can read photos"
  ON public.photo_updates
  FOR SELECT
  USING (true);

-- Authenticated users can upload photos
CREATE POLICY "Authenticated users can upload photos"
  ON public.photo_updates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Users can update their own photos
CREATE POLICY "Users can update own photos"
  ON public.photo_updates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

-- Users can delete their own photos
CREATE POLICY "Users can delete own photos"
  ON public.photo_updates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- ============================================
-- 3. Create storage bucket for photos
-- ============================================
-- Note: Run this in the Supabase Dashboard > Storage > New Bucket
-- Or use the following SQL:

INSERT INTO storage.buckets (id, name, public)
VALUES ('recovery-photos', 'recovery-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Anyone can view photos
CREATE POLICY "Anyone can view photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'recovery-photos');

-- Authenticated users can upload photos
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'recovery-photos');

-- Users can update their own photos
CREATE POLICY "Users can update own photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'recovery-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own photos
CREATE POLICY "Users can delete own photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'recovery-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- 4. Enable Realtime for tables
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.photo_updates;
