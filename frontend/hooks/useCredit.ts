import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AdminCreditHistoryResponse,
  CreditRefundRequestResponse,
  CreditResponse,
  CreditUsageResponse,
  JobDetailResponse,
} from "@/types/credit";
import { buyCredits } from "@/services/credit";
import {
  getAdminCreditHistory,
  getAdminCreditRefunds,
  getAdminCreditUsage,
  getAdminJobDetail,
  getUserCreditHistory,
  getUserCreditRefundRequests,
  getUserCreditUsage,
  requestRefund,
  RespondRefund,
} from "@/services/credite_usage";

export const useUserCreditHistory = (page: number, limit = 10) => {
  return useQuery<CreditResponse>({
    queryKey: ["userCreditHistory"],
    queryFn: () => getUserCreditHistory(page, limit),
    staleTime: 60_000,
  });
};

export const useUserCreditUsage = (page: number, limit = 10, refunded = "") => {
  return useQuery<CreditUsageResponse>({
    queryKey: ["userCreditUsage"],
    queryFn: () => getUserCreditUsage(page, limit, refunded),
    staleTime: 60_000,
  });
};

export const useUserCreditRefundRequests = (page: number, limit = 10) => {
  return useQuery<CreditRefundRequestResponse>({
    queryKey: ["userCreditRefundRequests"],
    queryFn: () => getUserCreditRefundRequests(page, limit),
    staleTime: 60_000,
  });
};

export function useBuyCredits() {
  return useMutation({
    mutationFn: buyCredits,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });
}

export function useRefundRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestRefund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCreditRefundRequests"] });
    },
  });
}

// ----------------------------------------------------------Admin-------------------------------------------------------

export const useAdminCreditUsage = (
  page: number,
  limit = 10,
  refunded = "",
  search = "",
  userID = "",
  reason = ""
) => {
  return useQuery<CreditUsageResponse>({
    queryKey: ["userCreditUsageAdmin"],
    queryFn: () =>
      getAdminCreditUsage(page, limit, refunded, search, userID, reason),
    staleTime: 60_000,
  });
};

export const useAdminCreditHistory = (page: number, limit = 10) => {
  return useQuery<AdminCreditHistoryResponse>({
    queryKey: ["userCreditHistoryAdmin"],
    queryFn: () => getAdminCreditHistory(page, limit),
    staleTime: 60_000,
  });
};

export const useAdminCreditRefunds = (
  page: number,
  limit = 10,
  status = "",
  search = "",
  userID = ""
) => {
  return useQuery<CreditRefundRequestResponse>({
    queryKey: ["userCreditRefundRequestsAdmin"],
    queryFn: () => getAdminCreditRefunds(page, limit, status, search, userID),
    staleTime: 60_000,
  });
};

export const useAdminJobDetail = (id: string) => {
  return useQuery<JobDetailResponse>({
    queryKey: ["userGetJobDetail"],
    queryFn: () => getAdminJobDetail(id),
    staleTime: 60_000,
  });
};

export function useRefundResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RespondRefund,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userCreditRefundRequestsAdmin"],
      });
    },
  });
}
