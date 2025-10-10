// hooks/useJobInvitations.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateInvitationParams,
  GetInvitationsByJobUserIDParams,
  JobInvitation,
  JobInvitationStats,
} from "@/types/jobInvitation";
import {
  fetchBusinessJobInvited,
  getJobInvitationForBusiness,
  getMyInviteStats,
  jobInvitationApi,
  updateInvitation,
  updateInvitationBusiness,
} from "@/services/jobInvitationApi";
import { JobDetailItem, PaginatedResponse } from "@/types/jobs";

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation<JobInvitation, Error, CreateInvitationParams>({
    mutationFn: jobInvitationApi.createInvitation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["job-invitations"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to create invitation");
    },
  });
};

export const useGetInvitationsByJobUserID = (
  params: GetInvitationsByJobUserIDParams
) => {
  return useQuery<JobInvitation, Error>({
    queryKey: ["job-invitations", params.job_id, params.user_id],
    queryFn: () => jobInvitationApi.getInvitationsByJobUserID(params),
    enabled: !!params.job_id && !!params.user_id && params.user_id.length > 0,
    retry: 1,
  });
};

export const useUpdateInviteStatus = () => {
  return useMutation({
    mutationFn: ({
      invite_id,
      status,
    }: {
      invite_id: string;
      status: string;
    }) => updateInvitation(invite_id, status),
  });
};

export const useUpdateInviteStatusBusiness = () => {
  return useMutation({
    mutationFn: ({
      invite_id,
      status,
    }: {
      invite_id: string;
      status: string;
    }) => updateInvitationBusiness(invite_id, status),
  });
};

export function useBusinessJobInvited(page: number, limit: number) {
  return useQuery<PaginatedResponse<JobDetailItem>, Error>({
    queryKey: ["businessJobInvited", page, limit],
    queryFn: () => fetchBusinessJobInvited(page, limit),
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}

export function useGetJobInviteForBusiness(id: string) {
  return useQuery<JobInvitation, Error>({
    queryKey: ["getBusinessJobInvited", id],
    queryFn: () => getJobInvitationForBusiness(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
}

export const useInviteStats = () => {
  return useQuery<JobInvitationStats, Error>({
    queryKey: ["inviteStats"],
    queryFn: getMyInviteStats,
    staleTime: 1000 * 60 * 2,
    retry: 3,
  });
};
