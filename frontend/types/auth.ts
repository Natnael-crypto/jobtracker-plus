export interface SignUpRequest {
  email: string;
  password: string;
  role: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface SignUpResponse {
  success: boolean;
  error?: string;
  message?: string;
  data: {
    redirect: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  redirect?: string;
}

export interface DeleteUserRequest {
  password: string;
}

export interface DeleteUserResponse {
  message: string;
}


export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  email: string;
  code: string;
  new_password: string;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
}
