"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadPortfolioImage,
  deletePortfolioImage,
  getUserPortfolio,
  getMyPortfolio,
} from "@/services/portfolio";
import { Portfolio } from "@/types/portfolio";
import { UserProfileResponse } from "@/types/userProfile";
import { fetchUserProfile } from "@/services/userProfile";

export function useGetMyPortfolio() {
  return useQuery<Portfolio[], Error>({
    queryKey: ["portfolio", "me"],
    queryFn: getMyPortfolio,
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

export function useGetUserPortfolio(userId: string) {
  return useQuery<Portfolio[], Error>({
    queryKey: ["portfolio", userId],
    queryFn: () => getUserPortfolio(userId),
    enabled: !!userId,
    retry: 3,
  });
}

export function useUploadPortfolioImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadPortfolioImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "me"] });
    },
  });
}

export function useDeletePortfolioImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePortfolioImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", "me"] });
    },
  });
}

export const useUserProfileDetail = (userId: string) => {
  return useQuery<UserProfileResponse>({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};
