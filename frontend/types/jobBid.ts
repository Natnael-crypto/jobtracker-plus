export interface BidStats {
  shortlisted: number;
  hired: number;
  rejected: number;
  withdrawn: number;
  pending: number;
  completed: number;
  total: number;
}

export interface Bid {
  id: string;
  job_id: string;
  user_id: string;
  status: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  image_url?: string;
  address_id?: string;
  average_rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface BidInviteResponse {
  pending: UserProfile[];
  shortlisted: UserProfile[];
  rejected: UserProfile[];
  invites: UserProfile[];
  hired: UserProfile[];
  completed: UserProfile[];
}

export interface JobBidStats {
  total: number;
  pending: number;
  shortlisted: number;
  hired: number;
  rejected: number;
  withdrawn: number;
  invites: number;
  accepted: number;
  completed: number;
}
