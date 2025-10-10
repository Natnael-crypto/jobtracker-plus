import api from "@/lib/axios";
import {
  DeleteUserRequest,
  DeleteUserResponse,
  LoginRequest,
  SignUpRequest,
  SignUpResponse,
} from "@/types/auth";
import { ChangePasswordRequest, UserDetailResponse } from "@/types/user";
import { StandardResponse } from "@/types/userProfile";

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await api.post<SignUpResponse>("/register", data);
  const resData = response.data;
  return resData;
};

export const login = async (data: LoginRequest): Promise<SignUpResponse> => {
  const response = await api.post<SignUpResponse>(
    "/login?redirect=" + data.redirect,
    data
  );
  const resData = response.data;
  return resData;
};

export const logout = async (): Promise<void> => {
  await api.post("/logout");
};

export const getUser = async (): Promise<UserDetailResponse> => {
  const response = await api.get<UserDetailResponse>("/user");
  const resData = response.data;
  return resData;
};

export const changePassword = async (
  payload: ChangePasswordRequest
): Promise<StandardResponse> => {
  const response = await api.put<StandardResponse>(
    "/user/change-password",
    payload
  );
  return response.data;
};

export async function deleteUser(
  req: DeleteUserRequest
): Promise<DeleteUserResponse> {
  const response = await api.delete<DeleteUserResponse>("/user", {
    data: req,
  });
  return response.data;
}
