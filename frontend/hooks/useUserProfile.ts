"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createsVerificationSession,
  fetchUserVerified,
  getProfile,
  getProfileStat,
  updateProfile,
  uploadProfileImage,
  Verify,
} from "@/services/userProfile";
import {
  ProfileStat,
  UpdateProfileRequest,
  UserProfile,
} from "@/types/userProfile";

export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: getProfile,
  });
};

export const useUserProfileStat = () => {
  return useQuery<ProfileStat>({
    queryKey: ["userProfileStat"],
    queryFn: getProfileStat,
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

export const useCreateVerificationSession = () => {
  return useMutation({
    mutationFn: createsVerificationSession,
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("Verification session URL missing from response:", data);
      }
    },
    onError: (error) => {
      console.error("Failed to create verification session:", error);
    },
  });
};

export const useVerified = () => {
  return useQuery<Verify>({
    queryKey: ["userVerified"],
    queryFn: fetchUserVerified,
  });
};
