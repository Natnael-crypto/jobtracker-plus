export interface Service {
  id: string;
  user_id: string;
  service_name: string;
  deleted_at?: string | null;
}

export interface CreateServiceRequest {
  service_name: string;
}

export interface ServiceResponse {
  id: string;
  user_id: string;
  service_name: string;
  deleted_at?: string | null;
}
