import { useState, useCallback, useEffect } from "react";
import {
  createJob,
  deleteJob,
  getJob,
  getMyJobs,
  getMyJobsStat,
  fetchBusinessJobs,
  getClientDetailJob,
  fetchBusinessJobShortlisted,
  fetchBusinessJobAwarded,
} from "@/services/job";
import {
  JobDetail,
  Job,
  JobRequest,
  JobResponse,
  JobsStatResponse,
  PaginatedResponse,
  JobDetailItem,
  ClientDetail,
  JobsResponse,
} from "@/types/jobs";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<JobResponse | null>(null);

  const mutate = useCallback(async (payload: JobRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createJob(payload);
      setJob(result);
      return result;
    } catch (err: any) {
      setError(err.message || "Unexpected error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error, job };
}

export function useJobs(initialPage = 1, limit = 10) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res: JobsResponse = await getMyJobs(page, limit);
        setJobs(res.data);
        setMeta(res.meta);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchJobs(initialPage);
  }, [initialPage, fetchJobs]);

  return { jobs, meta, loading, error, refetch: fetchJobs };
}

export function useMyJobsStat() {
  return useQuery<JobsStatResponse>({
    queryKey: ["myJobsStat"],
    queryFn: getMyJobsStat,
    staleTime: 1000 * 60 * 2, // cache valid for 5 minutes
    retry: 3, // retry failed requests twice
  });
}

export const useGetJob = (id: string) => {
  return useQuery<JobDetail, Error>({
    queryKey: ["job", id],
    queryFn: () => getJob(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
    retry: 3,
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobsStat"] });
    },
  });
};

export function useBusinessJobs(page: number, limit: number) {
  return useQuery<PaginatedResponse<JobDetailItem>, Error>({
    queryKey: ["businessJobs", page, limit],
    queryFn: () => fetchBusinessJobs(page, limit),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}

export function useBusinessJobShortlisted(page: number, limit: number) {
  return useQuery<PaginatedResponse<JobDetailItem>, Error>({
    queryKey: ["businessJobShortlisted", page, limit],
    queryFn: () => fetchBusinessJobShortlisted(page, limit),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}

export function useBusinessJobAwarded(page: number, limit: number) {
  return useQuery<PaginatedResponse<JobDetailItem>, Error>({
    queryKey: ["businessJobAwarded", page, limit],
    queryFn: () => fetchBusinessJobAwarded(page, limit),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}

export const useClientDetailJob = (jobId: string) => {
  return useQuery<ClientDetail, Error>({
    queryKey: ["client-detail-job", jobId],
    queryFn: () => getClientDetailJob(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};
