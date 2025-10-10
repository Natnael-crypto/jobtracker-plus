import api from "@/lib/axios";
import {
  JobInvitation,
  CreateInvitationParams,
  GetInvitationsByJobUserIDParams,
  ApiResponse,
  JobInvitationStats,
} from "@/types/jobInvitation";
import { response } from "./jobBid";
import { JobDetailItem, PaginatedResponse } from "@/types/jobs";

export const jobInvitationApi = {
  async createInvitation({
    job_id,
    business_id,
  }: CreateInvitationParams): Promise<JobInvitation> {
    const response = await api.post<ApiResponse<JobInvitation>>(
      `/client/jobs/${job_id}/invitations/${business_id}`
    );
    return response.data.data || response.data;
  },

  async getInvitationsByJobUserID({
    job_id,
    user_id,
  }: GetInvitationsByJobUserIDParams): Promise<JobInvitation> {
    const response = await api.get<ApiResponse<JobInvitation>>(
      `/client/jobs/${job_id}/user/${user_id}/invitation`
    );
    return response.data.data || response.data;
  },
};

export const updateInvitation = async (
  invite_id: string,
  status: string
): Promise<response> => {
  const res = await api.put<response>(
    `/client/invitations/${invite_id}/status`,
    {
      status,
    }
  );
  return res.data;
};

export const updateInvitationBusiness = async (
  invite_id: string,
  status: string
): Promise<response> => {
  const res = await api.put<response>(
    `/business/invitations/${invite_id}/status`,
    {
      status,
    }
  );
  return res.data;
};

export async function fetchBusinessJobInvited(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<JobDetailItem>> {
  const res = await api.get<PaginatedResponse<JobDetailItem>>(
    `/business/jobs/invites`,
    {
      params: { page, limit },
    }
  );
  return res.data;
}

export const getMyInviteStats = async (): Promise<JobInvitationStats> => {
  const res = await api.get<JobInvitationStats>("/business/jobs/stat");
  return res.data;
};

export const getJobInvitationForBusiness = async (
  job_id: string
): Promise<JobInvitation> => {
  const res = await api.get<JobInvitation>(`/business/jobs/invite/${job_id}`);
  return res.data;
};
