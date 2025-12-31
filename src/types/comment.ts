export interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  recovery_point_id: string;
  content: string;
  created_at: string;
}
