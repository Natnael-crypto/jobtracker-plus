import api from "@/lib/axios";
import {
  PasswordResetRequestPayload,
  PasswordResetConfirmPayload,
  ApiResponse,
} from "@/types/auth";

export async function requestPasswordReset(
  payload: PasswordResetRequestPayload
): Promise<ApiResponse> {
  const res = await api.post("/request-password-reset", payload);
  return res.data;
}

export async function resetPassword(
  payload: PasswordResetConfirmPayload
): Promise<ApiResponse> {
  const res = await api.post("/reset-password", payload);
  return res.data;
}
