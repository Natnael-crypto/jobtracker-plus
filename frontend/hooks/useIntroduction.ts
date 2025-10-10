"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIntroduction,
  updateIntroduction,
  getMyIntroduction,
} from "@/services/introduction";
import {
  IntroductionResponse,
  UpdateIntroductionRequest,
} from "@/types/introduction";

export function useGetIntroduction(userId: string) {
  return useQuery<IntroductionResponse, Error>({
    queryKey: ["introduction", userId],
    queryFn: () => getIntroduction(userId),
    enabled: !!userId,
    retry: 3,
  });
}

export function useGetMyIntroduction() {
  return useQuery<IntroductionResponse, Error>({
    queryKey: ["introduction"],
    queryFn: () => getMyIntroduction(),
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateIntroduction() {
  const queryClient = useQueryClient();

  return useMutation<IntroductionResponse, Error, UpdateIntroductionRequest>({
    mutationFn: updateIntroduction,
    onSuccess: (updatedIntro) => {
      queryClient.setQueryData(["introduction"], updatedIntro);
    },
  });
}
