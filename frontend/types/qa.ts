// types.ts
export interface Question {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  category: string;
  created_at: string;
  first_name?: string;
  answer_count: number;
}

export interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  full_name?: string;
  image_url?: string;
}

export interface CreateAnswerRequest {
  content: string;
}

export interface UpdateAnswerRequest {
  content: string;
}

export interface CreateQuestionRequest {
  title: string;
  content?: string;
  category: string;
}

export interface UpdateQuestionRequest {
  title: string;
  content?: string;
  category: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
