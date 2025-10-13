"use client";

import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset, resetPassword } from "@/services/passwordReset";
import {
  PasswordResetRequestPayload,
  PasswordResetConfirmPayload,
  ApiResponse,
} from "@/types/auth";

export function useRequestPasswordReset() {
  return useMutation<ApiResponse, Error, PasswordResetRequestPayload>({
    mutationFn: requestPasswordReset,
  });
}

export function useResetPassword() {
  return useMutation<ApiResponse, Error, PasswordResetConfirmPayload>({
    mutationFn: resetPassword,
  });
}
