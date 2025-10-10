"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteUser, getUser, login, logout, signUp } from "@/services/auth";
import {
  DeleteUserRequest,
  DeleteUserResponse,
  LoginRequest,
  SignUpRequest,
  SignUpResponse,
} from "@/types/auth";
import { useRouter } from "next/navigation";

export const useSignUp = () => {
  const router = useRouter();

  return useMutation<SignUpResponse, Error, SignUpRequest>({
    mutationFn: (data) => signUp(data),
    onSuccess: (data) => {
      if (data.data.redirect) {
        router.push(data.data.redirect);
      }
    },
    onError: (error) => {
      console.error("SignUp failed:", error.message);
    },
  });
};

export const useLogin = () => {
  const router = useRouter();

  return useMutation<SignUpResponse, Error, LoginRequest>({
    mutationFn: (data) => login(data),
    // onSuccess: (data) => {
    //   if (data.data.redirect) {
    //     router.push(data.data.redirect);
    //   }
    // },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["userDetail"],
    queryFn: () => getUser(),
  });
};

export const useLogout = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
    },
  });
};

export function useDeleteAccount() {
  return useMutation<DeleteUserResponse, Error, DeleteUserRequest>({
    mutationFn: deleteUser,
  });
}
