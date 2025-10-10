export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  image_url?: string;
  address_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface StandardResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: any;
}

export interface UserProfile2 {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  image_url?: string;
}

export interface Review {
  id: string;
  job_id: string;
  reviewer_id: string;
  rate: number;
  comment: string;
  created_at: string;
}

export interface Service {
  id: string;
  user_id: string;
  service_name: string;
}

export interface Qualification {
  id: string;
  user_id: string;
  type: "Education" | "Award";
  title: string;
  start_year?: number;
  end_year?: number;
  institute?: string;
  description?: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  image_url: string;
}

export interface BusinessIntroduction {
  id: string;
  user_id: string;
  description: string;
}

export interface UserProfileResponse {
  user_profile: UserProfile2;
  reviews: Review[];
  average_rate: number;
  services: Service[];
  qualifications: Qualification[];
  education: Qualification[];
  awards: Qualification[];
  portfolio: Portfolio[];
  business_introduction: BusinessIntroduction;
}
