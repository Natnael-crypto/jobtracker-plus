"use client";

import {
  fetchJobBidStats,
  getAllBidsForJobByState,
  getMyBidJob,
  getMyBidStats,
  getUserBidByJobId,
  makeBid,
  updateBid,
  withdrawalBid,
} from "@/services/jobBid";
import { Bid, BidInviteResponse, BidStats, JobBidStats } from "@/types/jobBid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBidStats = () => {
  return useQuery<BidStats, Error>({
    queryKey: ["bidStats"],
    queryFn: getMyBidStats,
    staleTime: 1000 * 60 * 2,
    retry: 3,
  });
};

export const useGetJobBid = (job_id: string) => {
  return useQuery<Bid, Error>({
    queryKey: ["myJobBid", job_id],
    queryFn: () => getMyBidJob(job_id),
    staleTime: 1000 * 60 * 2,
    retry: 3,
  });
};

export const useMakeBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (job_id: string) => makeBid(job_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobBid"] });
    },
  });
};

export const useWithdrawalBid = () => {
  return useMutation({
    mutationFn: (bid_id: string) => withdrawalBid(bid_id),
  });
};

export const useBidsByState = (jobId: string) => {
  return useQuery<BidInviteResponse, Error>({
    queryKey: ["bids-by-state", jobId],
    queryFn: () => getAllBidsForJobByState(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};

export const useUpdateBidStatus = () => {
  return useMutation({
    mutationFn: ({ bid_id, status }: { bid_id: string; status: string }) =>
      updateBid(bid_id, status),
  });
};

export const useGetUserBid = (job_id: string, user_id: string) => {
  return useQuery<Bid, Error>({
    queryKey: ["userBidByJobId", job_id, user_id],
    queryFn: () => getUserBidByJobId(job_id, user_id),
    enabled: !!job_id && !!user_id,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

export const useJobBidStats = (jobID?: string) => {
  return useQuery<JobBidStats>({
    queryKey: ["jobBidStats", jobID],
    queryFn: () => fetchJobBidStats(jobID!),
    enabled: Boolean(jobID),
    staleTime: 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
