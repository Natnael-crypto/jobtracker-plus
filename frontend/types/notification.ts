export interface Notification1 {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: string;
  read_at?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
