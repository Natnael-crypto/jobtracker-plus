// types/job.ts
export interface AddressRequest {
  label: string;
  city: string;
  state: string;
  countryCode: string;
  countryName: string;
  county: string;
  postalCode: string;
}

export interface JobRequest {
  id?: string;
  service_category: string;
  service_specific?: string;
  time?: string;
  budget?: string;
  description?: string;
  headline?: string;
  location?: string;
  address: AddressRequest;
  imageUrls?: string[];
}

export interface JobResponse {
  id: string;
  user_id: string;
  service_category: string;
  service_specific?: string;
  time?: string;
  budget?: string;
  description?: string;
  headline?: string;
  location?: string;
  status: "open" | "closed" | "awarded";
  created_at: string;
  address?: AddressRequest;
}

export interface Job {
  id: string;
  user_id: string;
  service_category: string;
  service_specific?: string;
  time?: string;
  budget?: string;
  description?: string;
  headline?: string;
  status: "open" | "closed" | "awarded" | "completed";
  created_at: string;
}

export interface JobsResponse {
  data: Job[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface JobsStatResponse {
  total_jobs: string;
  hired: string;
}

export interface JobDetail {
  id: string;
  service_category: string;
  service_specific: string;
  time: string;
  budget: string;
  description: string;
  headline: string;
  status: string;
  created_at: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  images: string[];
  bids: number;
}

export interface JobDetailItem {
  id: string;
  service_category: string;
  service_specific: string;
  time: string;
  budget: string;
  description: string;
  headline: string;
  status: "open" | "closed" | "in_progress"; // refine if needed
  created_at: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  images: string[];
}

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  data: T[];
}

export interface ClientDetail {
  email: string;
  phone: string;
}
