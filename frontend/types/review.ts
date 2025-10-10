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
