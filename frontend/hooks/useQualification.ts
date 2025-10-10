"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyQualifications,
  getUserQualifications,
  createQualification,
  updateQualification,
  deleteQualification,
} from "@/services/qualification";
import {
  Qualification,
  CreateQualificationRequest,
  UpdateQualificationRequest,
} from "@/types/qualification";

export function useGetMyQualifications() {
  return useQuery<Qualification[], Error>({
    queryKey: ["qualifications", "me"],
    queryFn: getMyQualifications,
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

export function useGetUserQualifications(userId: string) {
  return useQuery<Qualification[], Error>({
    queryKey: ["qualifications", userId],
    queryFn: () => getUserQualifications(userId),
    enabled: !!userId,
  });
}

export function useCreateQualification() {
  const queryClient = useQueryClient();
  return useMutation<Qualification, Error, CreateQualificationRequest>({
    mutationFn: createQualification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qualifications", "me"] });
    },
  });
}

export function useUpdateQualification() {
  const queryClient = useQueryClient();
  return useMutation<Qualification, Error, UpdateQualificationRequest>({
    mutationFn: updateQualification,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["qualifications", "me"] });
    },
  });
}

export function useDeleteQualification() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteQualification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qualifications", "me"] });
    },
  });
}
