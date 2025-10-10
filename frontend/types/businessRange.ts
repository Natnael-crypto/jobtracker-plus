export interface BusinessRange {
  id: string;
  user_id: string;
  range_km: number;
  deleted_at?: string | null;
}

export interface UpdateBusinessRangePayload {
  range_km: number;
}
