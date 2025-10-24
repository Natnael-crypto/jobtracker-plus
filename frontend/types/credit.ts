import { UserProfile } from "./userProfile";

export interface Credit {
  id: string;
  user_id: string;
  total_credits: number;
  available_credits: number;
  updated_at: string;
}

export interface CreditHistory {
  id: string;
  job_id?: string | null;
  user_id: string;
  credit_change: number;
  created_at: string;
}

export interface CreditHistoryAdmin {
  id: string;
  user_profile: UserProfile;
  credit_change: number;
  created_at: string;
}

export interface CreditResponse {
  credit: Credit;
  creditHistory: CreditHistory[];
  total: number;
}

export interface AdminCreditHistoryResponse {
  data: CreditHistoryAdmin[];
  total: number;
  totalPurchased: number;
}

export interface BuyCreditRequest {
  amount: number;
}

export interface BuyCreditResponse {
  url: string;
}

export interface CreditUsage {
  id: string;
  job_id: string;
  job_title: string;
  reason: string;
  user_id: string;
  credit: number;
  refunded: boolean;
  created_at: string;
}

export interface CreditUsageResponse {
  data: CreditUsage[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CreditRefund {
  id: string;
  user_id: string;
  job_title: string;
  credit_usage_id: string;
  user_reason: string;
  admin_reason: string;
  status: string;
  created_at: string;
}

export interface CreditRefundRequestResponse {
  data: CreditRefund[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CreateRefundRequest {
  credit_usage_id: string;
  user_reason: string;
}

export interface CreateRefundRequestResponse {
  message: string;
  error?: string;
}

export interface UpdateRefundStatusRequest {
  id: string;
  status: string;
  admin_reason: string;
}

export interface UpdateRefundStatusResponse {
  message: string;
}

export interface CreditHistoryResponse {
  credit: CreditHistory[];
  total: number;
}

// type JobDetailResponse struct {
// 	JobID          string `json:"job_id"`
// 	JobTitle       string `json:"job_title"`
// 	JobDescription string `json:"job_description"`
// 	JobCategory    string `json:"job_category"`
// 	JobSpecific    string `json:"job_specific"`
// 	UserID         string `json:"user_id"`
// 	UserName       string `json:"user_name"`
// 	UserEmail      string `json:"user_email"`
// 	Phone          string `json:"phone"`
// 	Type           string `json:"type"`
// }

export interface JobDetailResponse {
  job_id: string;
  job_title: string;
  job_description: string;
  job_category: string;
  job_specific: string;
  user_id: string;
  user_name: string;
  user_email: string;
  phone: string;
  type: string;
}
