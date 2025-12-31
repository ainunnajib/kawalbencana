export type NeedCategory =
  | "capital"
  | "equipment"
  | "training"
  | "materials"
  | "labor"
  | "relocation"
  | "other";

export type AssistanceType = "loan" | "grant" | "goods" | "service";

export type NeedStatus = "open" | "matched" | "fulfilled" | "closed";

export type AssistanceStatus = "active" | "matched" | "fulfilled" | "expired";

export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export interface Need {
  id: string;
  posted_by: string;
  recovery_point_id?: string;
  category: NeedCategory;
  description: string;
  amount_needed?: number;
  status: NeedStatus;
  urgency_level: UrgencyLevel;
  created_at: string;
  updated_at: string;
}

export interface AssistanceOffer {
  id: string;
  offered_by: string;
  type: AssistanceType;
  description: string;
  amount_available?: number;
  conditions?: string;
  duration?: string;
  status: AssistanceStatus;
  created_at: string;
  updated_at: string;
}

export type MatchStatus =
  | "pending"
  | "approved"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Match {
  id: string;
  need_id: string;
  offer_id: string;
  matched_by: string;
  status: MatchStatus;
  impact_report?: string;
  created_at: string;
  completed_at?: string;
}

export type TransactionStatus =
  | "pledged"
  | "transferred"
  | "received"
  | "utilized";

export interface Transaction {
  id: string;
  match_id: string;
  donor_id: string;
  recipient_id: string;
  amount?: number;
  description: string;
  status: TransactionStatus;
  proof_url?: string;
  created_at: string;
  updated_at: string;
}
