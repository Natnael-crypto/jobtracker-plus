export type Provider = {
  user_id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
  rating: number;
  review_count: number;
  about?: string | null;
  services: string[];
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

export type ListProvidersOpts = {
  services?: string[];
  search?: string;
  city?: string;
  state?: string;
  country?: string;
  min_rating?: number;
  limit?: number;
  offset?: number;
};

export type ListProvidersResponse = {
  data: Provider[];
  total_count: number;
  limit: number;
  offset: number;
};

// types/provider.ts

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
}

export interface UserAddress {
  id: string;
  user_id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  longitude: number;
  latitude: number;
  created_at: string;
}

export interface Review {
  reviewer: string;
  reviewer_image: string;
  rate: number;
  comment?: string;
  created_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  image_url: string;
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
  title?: string;
  start_year?: number;
  end_year?: number;
  institute?: string;
  description?: string;
  created_at: string;
}

export interface BusinessIntroduction {
  id: string;
  user_id: string;
  description: string;
  created_at: string;
}

export interface ProviderDetail {
  Profile: UserProfile;
  Address?: UserAddress;
  Review: Review[];
  Rate: number;
  ReviewCount: number;
  Portfolio: Portfolio[];
  Service: Service[];
  Qualification: Qualification[];
  BusinessIntroduction?: BusinessIntroduction;
}
