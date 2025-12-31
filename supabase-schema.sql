-- KawalBencana Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('masyarakat', 'donor', 'government', 'ngo', 'admin');
CREATE TYPE damage_level AS ENUM ('light', 'moderate', 'severe', 'total');
CREATE TYPE recovery_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE infrastructure_category AS ENUM (
  'bridge', 'road', 'farm', 'market', 'school', 'hospital',
  'house', 'worship_place', 'government_building', 'water_system',
  'power_grid', 'other'
);
CREATE TYPE need_category AS ENUM ('capital', 'equipment', 'training', 'materials', 'labor', 'relocation', 'other');
CREATE TYPE assistance_type AS ENUM ('loan', 'grant', 'goods', 'service');
CREATE TYPE need_status AS ENUM ('open', 'matched', 'fulfilled', 'closed');
CREATE TYPE assistance_status AS ENUM ('active', 'matched', 'fulfilled', 'expired');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE match_status AS ENUM ('pending', 'approved', 'in_progress', 'completed', 'cancelled');
CREATE TYPE transaction_status AS ENUM ('pledged', 'transferred', 'received', 'utilized');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'masyarakat',
  location TEXT,
  avatar_url TEXT,
  bio TEXT,
  organization TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recovery Points table
CREATE TABLE recovery_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  geom GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
  address TEXT,
  category infrastructure_category NOT NULL,
  damage_level damage_level NOT NULL,
  status recovery_status NOT NULL DEFAULT 'not_started',
  estimated_cost BIGINT,
  actual_cost BIGINT,
  target_completion_date DATE,
  created_by UUID NOT NULL REFERENCES users(id),
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photo Updates table
CREATE TABLE photo_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recovery_point_id UUID NOT NULL REFERENCES recovery_points(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  verification_status verification_status DEFAULT 'pending',
  geolocation_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Needs table
CREATE TABLE needs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  posted_by UUID NOT NULL REFERENCES users(id),
  recovery_point_id UUID REFERENCES recovery_points(id),
  category need_category NOT NULL,
  description TEXT NOT NULL,
  amount_needed BIGINT,
  status need_status NOT NULL DEFAULT 'open',
  urgency_level urgency_level NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assistance Offers table
CREATE TABLE assistance_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offered_by UUID NOT NULL REFERENCES users(id),
  type assistance_type NOT NULL,
  description TEXT NOT NULL,
  amount_available BIGINT,
  conditions TEXT,
  duration TEXT,
  status assistance_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  need_id UUID NOT NULL REFERENCES needs(id),
  offer_id UUID NOT NULL REFERENCES assistance_offers(id),
  matched_by UUID NOT NULL REFERENCES users(id),
  status match_status NOT NULL DEFAULT 'pending',
  impact_report TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id),
  donor_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  amount BIGINT,
  description TEXT NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pledged',
  proof_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  recovery_point_id UUID REFERENCES recovery_points(id) ON DELETE CASCADE,
  need_id UUID REFERENCES needs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Recovery Points indexes
CREATE INDEX idx_recovery_points_geom ON recovery_points USING GIST (geom);
CREATE INDEX idx_recovery_points_status ON recovery_points(status);
CREATE INDEX idx_recovery_points_category ON recovery_points(category);
CREATE INDEX idx_recovery_points_created_by ON recovery_points(created_by);

-- Photo Updates indexes
CREATE INDEX idx_photo_updates_recovery_point ON photo_updates(recovery_point_id);
CREATE INDEX idx_photo_updates_upload_date ON photo_updates(upload_date DESC);

-- Needs indexes
CREATE INDEX idx_needs_status ON needs(status);
CREATE INDEX idx_needs_posted_by ON needs(posted_by);
CREATE INDEX idx_needs_urgency ON needs(urgency_level);

-- Assistance Offers indexes
CREATE INDEX idx_assistance_offers_status ON assistance_offers(status);
CREATE INDEX idx_assistance_offers_offered_by ON assistance_offers(offered_by);

-- Matches indexes
CREATE INDEX idx_matches_need_id ON matches(need_id);
CREATE INDEX idx_matches_offer_id ON matches(offer_id);
CREATE INDEX idx_matches_status ON matches(status);

-- Transactions indexes
CREATE INDEX idx_transactions_match_id ON transactions(match_id);
CREATE INDEX idx_transactions_donor_id ON transactions(donor_id);
CREATE INDEX idx_transactions_recipient_id ON transactions(recipient_id);

-- Comments indexes
CREATE INDEX idx_comments_recovery_point ON comments(recovery_point_id);
CREATE INDEX idx_comments_need ON comments(need_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recovery_points_updated_at BEFORE UPDATE ON recovery_points
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_needs_updated_at BEFORE UPDATE ON needs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assistance_offers_updated_at BEFORE UPDATE ON assistance_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistance_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Recovery Points policies
CREATE POLICY "Anyone can view recovery points" ON recovery_points FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create recovery points" ON recovery_points FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own recovery points" ON recovery_points FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Admins can update any recovery point" ON recovery_points FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Photo Updates policies
CREATE POLICY "Anyone can view photos" ON photo_updates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload photos" ON photo_updates FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Needs policies
CREATE POLICY "Anyone can view needs" ON needs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post needs" ON needs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own needs" ON needs FOR UPDATE USING (posted_by = auth.uid());

-- Assistance Offers policies
CREATE POLICY "Anyone can view offers" ON assistance_offers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create offers" ON assistance_offers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own offers" ON assistance_offers FOR UPDATE USING (offered_by = auth.uid());

-- Matches policies
CREATE POLICY "Anyone can view matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create matches" ON matches FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (
  donor_id = auth.uid() OR recipient_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'government'))
);
CREATE POLICY "Authenticated users can create transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post comments" ON comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to get nearby recovery points
CREATE OR REPLACE FUNCTION get_nearby_recovery_points(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_meters INTEGER DEFAULT 10000
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  distance_meters DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    rp.id,
    rp.name,
    ST_Distance(rp.geom, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) as distance_meters
  FROM recovery_points rp
  WHERE ST_DWithin(
    rp.geom,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meters
  )
  ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA (Optional - for development)
-- ============================================================================

-- Insert a default admin user (you'll need to create this user in Supabase Auth first)
-- REPLACE 'your-admin-user-id' with actual UUID from auth.users
/*
INSERT INTO users (id, email, name, role) VALUES
  ('your-admin-user-id', 'admin@kawalbencana.com', 'Admin', 'admin');
*/

-- Example recovery point (Banda Aceh area)
/*
INSERT INTO recovery_points (name, description, latitude, longitude, address, category, damage_level, created_by) VALUES
  (
    'Jembatan Krueng Aceh',
    'Jembatan utama yang menghubungkan Banda Aceh dengan kabupaten lain',
    5.5483,
    95.3238,
    'Krueng Aceh, Banda Aceh',
    'bridge',
    'severe',
    'your-admin-user-id'
  );
*/
