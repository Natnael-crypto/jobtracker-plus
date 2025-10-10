import api from "@/lib/axios";
import { Bid, BidInviteResponse, BidStats, JobBidStats } from "@/types/jobBid";

export const getMyBidStats = async (): Promise<BidStats> => {
  const res = await api.get<BidStats>("/business/bids/stat");
  return res.data;
};

export const getBidStatForJob = async (): Promise<BidStats> => {
  const res = await api.get<BidStats>("/business/bids/stat");
  return res.data;
};

export const makeBid = async (job_id: string): Promise<Bid> => {
  const res = await api.post<Bid>(`/business/bids/${job_id}`);
  return res.data;
};

export const withdrawalBid = async (job_id: string): Promise<Bid> => {
  const res = await api.put<Bid>(`/business/bids/${job_id}/withdraw`);
  return res.data;
};

export const getMyBidJob = async (job_id: string): Promise<Bid> => {
  const res = await api.get<Bid>(`/business/bids/${job_id}`);
  return res.data;
};

export const getAllBidsForJobByState = async (
  jobId: string
): Promise<BidInviteResponse> => {
  const res = await api.get(`/client/jobs/${jobId}/bid-invite`);
  return res.data;
};

export type response = {
  message: string;
};

export const updateBid = async (
  bid_id: string,
  status: string
): Promise<response> => {
  const res = await api.put<response>(`/client/bids/${bid_id}/status`, {
    status,
  });
  return res.data;
};

export const getUserBidByJobId = async (
  job_id: string,
  user_id: string
): Promise<Bid> => {
  const res = await api.get<Bid>(`/client/jobs/${job_id}/${user_id}/bid`);
  return res.data;
};

export const fetchJobBidStats = async (jobID: string): Promise<JobBidStats> => {
  const { data } = await api.get<{ data: JobBidStats }>(
    `/client/jobs/${jobID}/bid/stats`
  );
  return data.data;
};
