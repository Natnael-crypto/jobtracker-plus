// types/jobInvitation.ts
export interface JobInvitation {
  id: string;
  job_id: string;
  business_id: string;
  status: "pending" | "accepted" | "hired" | "rejected" | "withdrawn";
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface CreateInvitationParams {
  job_id: string;
  business_id: string;
}

export interface GetInvitationsByJobUserIDParams {
  job_id: string;
  user_id: string;
}

export interface JobInvitationStats {
  total: number;
  pending: number;
  accepted: number;
  hired: number;
  rejected: number;
  withdrawn: number;
}
