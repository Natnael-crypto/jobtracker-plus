export interface ProfileViewDTO {
  user_id: string;
  created_at: string;
}

export interface BusinessDashboardDTO {
  Id: string;
  CompletedJobs: number;
  OpenJobs: number;
  Rating: number;
  ReviewCount: number;
  TotalBids: number;
  TotalShortlisted: number;
  TotalHired: number;
  TotalBidCompleted: number;
  TotalPending: number;
}

export interface ClientDashboard {
  Id: string;
  CompletedJobs: number;
  OpenJobs: number;
  AwardedJobs: number;
  TotalResponse: number;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}
