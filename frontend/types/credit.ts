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

export interface CreditResponse {
  credit: Credit;
  creditHistory: CreditHistory[];
  total: number;
}
export interface BuyCreditRequest {
  amount: number;
}

export interface BuyCreditResponse {
  url: string;
}
