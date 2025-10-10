export interface User {
  id: string;
  role: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface UserDetailResponse {
  success: boolean;
  error?: string;
  message?: string;
  data: User;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export interface UpdateUserAddressRequest {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
