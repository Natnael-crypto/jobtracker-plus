export interface Portfolio {
  id: string;
  user_id: string;
  image_url: string;
  created_at: string;
}

export interface UploadPortfolioResponse {
  id: string;
  user_id: string;
  image_url: string;
  created_at: string;
}

export interface DeletePortfolioResponse {
  message: string;
}

export interface GetUserPortfolioResponse {
  images: Portfolio[];
}
