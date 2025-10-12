export interface UserReview {
  reviewer: string;
  reviewer_image: string;
  rate: number;
  comment: string;
  created_at: string;
}

export interface ReviewResponse {
  reviews: UserReview[];
}

export interface Review {
  id: string;
  job_id: string;
  reviewer_id: string;
  rate: number;
  comment: string;
  created_at: string; // ISO string from backend
}

export interface CreateReviewRequest {
  rate: number;
  comment: string;
  user_id: string;
}

export interface CreateReviewResponse extends Review {}
