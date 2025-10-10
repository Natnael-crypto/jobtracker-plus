import api from "@/lib/axios";
import {
  UserProfile,
  UpdateProfileRequest,
  UserProfileResponse,
} from "@/types/userProfile";

export const getProfile = async (): Promise<UserProfile> => {
  const res = await api.get<UserProfile>("/user/profile");
  return res.data;
};

export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<UserProfile> => {
  const res = await api.put<UserProfile>("/user/profile", data);
  return res.data;
};

export const uploadProfileImage = async (file: File): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post<UserProfile>("/user/profile/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const fetchUserProfile = async (
  userId: string
): Promise<UserProfileResponse> => {
  const res = await api.get(`/client/jobs/user/${userId}`);
  return res.data;
};
