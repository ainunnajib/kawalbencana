export type UserRole = "masyarakat" | "donor" | "government" | "ngo" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  location?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile extends User {
  avatar_url?: string;
  bio?: string;
  organization?: string;
}
