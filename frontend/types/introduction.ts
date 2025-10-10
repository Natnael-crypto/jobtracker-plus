export interface Introduction {
  id: string;
  user_id: string;
  description: string;
  created_at: string;
}

export interface CreateIntroductionRequest {
  description: string;
}

export interface UpdateIntroductionRequest {
  description: string;
}

export interface IntroductionResponse {
  id: string;
  user_id: string;
  description: string;
  created_at: string;
}
