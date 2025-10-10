"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "@/services/userProfile";
import { UpdateProfileRequest, UserProfile } from "@/types/userProfile";

export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateProfileRequest>({
    mutationFn: (data) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, File>({
    mutationFn: (file) => uploadProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
