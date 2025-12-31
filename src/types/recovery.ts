export type DamageLevel = "light" | "moderate" | "severe" | "total";
export type RecoveryStatus = "not_started" | "in_progress" | "completed";
export type InfrastructureCategory =
  | "bridge"
  | "road"
  | "farm"
  | "market"
  | "school"
  | "hospital"
  | "house"
  | "worship_place"
  | "government_building"
  | "water_system"
  | "power_grid"
  | "other";

export interface RecoveryPoint {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  category: InfrastructureCategory;
  damage_level: DamageLevel;
  status: RecoveryStatus;
  estimated_cost?: number;
  actual_cost?: number;
  target_completion_date?: string;
  created_by: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PhotoUpdate {
  id: string;
  recovery_point_id: string;
  image_url: string;
  thumbnail_url: string;
  uploaded_by: string;
  upload_date: string;
  description?: string;
  verification_status: "pending" | "verified" | "rejected";
  geolocation_verified: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}
