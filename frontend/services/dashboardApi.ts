// src/api/dashboardApi.ts
import api from "@/lib/axios";
import { BusinessDashboardDTO, ProfileViewDTO } from "../types/dashboard";
import { ApiError } from "../types/dashboard";

export const getBusinessDashboard = async (): Promise<BusinessDashboardDTO> => {
  try {
    const { data } = await api.get<BusinessDashboardDTO>("/dashboard/business");
    return data;
  } catch (err) {
    throw err as ApiError;
  }
};

export const getProfileViews = async (
  lastDay?: number
): Promise<ProfileViewDTO[]> => {
  try {
    const params = lastDay ? { day: String(lastDay) } : undefined;
    const { data } = await api.get<ProfileViewDTO[]>("/dashboard/profile", {
      params,
    });
    return data;
  } catch (err) {
    throw err as ApiError;
  }
};

export const addProfileView = async (
  userId: string
): Promise<{ message: string }> => {
  try {
    const { data } = await api.post<{ message: string }>(
      `/profile/${encodeURIComponent(userId)}`
    );
    return data;
  } catch (err) {
    throw err as ApiError;
  }
};
