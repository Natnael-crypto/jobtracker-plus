import api from "@/lib/axios";
import {
  JobDetail,
  JobRequest,
  JobResponse,
  JobsResponse,
  JobsStatResponse,
  JobDetailItem,
  PaginatedResponse,
  ClientDetail,
} from "@/types/jobs";

export async function createJob(payload: JobRequest): Promise<JobResponse> {
  const { data } = await api.post(`/client/jobs`, payload);

  return data;
}

export async function getMyJobs(page = 1, limit = 10): Promise<JobsResponse> {
  const { data } = await api.get(`/client/my-jobs`, {
    params: { page, limit },
  });
  return data;
}
export async function getMyJobsStat(): Promise<JobsStatResponse> {
  const { data } = await api.get(`/client/my-jobs/stat`);

  return data;
}

export const getJob = async (id: string): Promise<JobDetail> => {
  const res = await api.get<JobDetail>(`/jobs/${id}`);
  return res.data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await api.delete(`/client/jobs/${id}`);
};

export async function fetchBusinessJobs(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<JobDetailItem>> {
  const res = await api.get<PaginatedResponse<JobDetailItem>>(
    `/business/jobs`,
    {
      params: { page, limit },
    }
  );
  return res.data;
}

export async function fetchBusinessJobShortlisted(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<JobDetailItem>> {
  const res = await api.get<PaginatedResponse<JobDetailItem>>(
    `/business/jobs/shortlisted`,
    {
      params: { page, limit },
    }
  );
  return res.data;
}

export async function fetchBusinessJobAwarded(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<JobDetailItem>> {
  const res = await api.get<PaginatedResponse<JobDetailItem>>(
    `/business/jobs/awarded`,
    {
      params: { page, limit },
    }
  );
  return res.data;
}

export const getClientDetailJob = async (
  jobId: string
): Promise<ClientDetail> => {
  if (!jobId) throw new Error("Job ID is required");

  const response = await api.get(`/business/jobs/${jobId}/client`);
  return response.data;
};
