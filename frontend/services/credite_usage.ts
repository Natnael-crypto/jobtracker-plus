import api from "@/lib/axios";
import {
  AdminCreditHistoryResponse,
  CreateRefundRequest,
  CreateRefundRequestResponse,
  CreditRefundRequestResponse,
  CreditResponse,
  CreditUsageResponse,
  JobDetailResponse,
  UpdateRefundStatusRequest,
  UpdateRefundStatusResponse,
} from "@/types/credit";

//get credit purchase history of user
export const getUserCreditHistory = async (
  page = 1,
  limit = 10
): Promise<CreditResponse> => {
  const res = await api.get(`/business/credit`, {
    params: { page, limit },
  });
  return res.data;
};

// Get credit usage history of user
export const getUserCreditUsage = async (
  page = 1,
  limit = 10,
  refunded = ""
): Promise<CreditUsageResponse> => {
  const res = await api.get(`/business/credit/used`, {
    params: { page, limit, refunded },
  });
  return res.data;
};

// Get credit refund requests of user
export const getUserCreditRefundRequests = async (
  page = 1,
  limit = 10
): Promise<CreditRefundRequestResponse> => {
  const res = await api.get(`/business/credit/refund`, {
    params: { page, limit },
  });
  return res.data;
};

// make refund request
export async function requestRefund(
  payload: CreateRefundRequest
): Promise<CreateRefundRequestResponse> {
  const { data } = await api.post<CreateRefundRequestResponse>(
    "/business/credit/refund",
    payload
  );
  return data;
}

// ------------------------------------------------------------Admin------------------------------------------------

export const getAdminCreditUsage = async (
  page = 1,
  limit = 10,
  refunded = "",
  search = "",
  userID = "",
  reason = ""
): Promise<CreditUsageResponse> => {
  const res = await api.get(`/admin/credit/used/all`, {
    params: { page, limit, refunded, search, userID, reason },
  });
  return res.data;
};

export const getAdminCreditHistory = async (
  page = 1,
  limit = 10
): Promise<AdminCreditHistoryResponse> => {
  const res = await api.get(`/admin/credit/transactions/all`, {
    params: { page, limit },
  });
  return res.data;
};

export const getAdminCreditRefunds = async (
  page = 1,
  limit = 10,
  search = "",
  userID = "",
  status = ""
): Promise<CreditRefundRequestResponse> => {
  const res = await api.get(`/admin/credit/refunds/all`, {
    params: { page, limit, search, userID, status },
  });
  return res.data;
};

export const getAdminJobDetail = async (
  id: string
): Promise<JobDetailResponse> => {
  const res = await api.get(`/admin/credit/job/${id}`);
  return res.data;
};

export async function RespondRefund(
  payload: UpdateRefundStatusRequest
): Promise<UpdateRefundStatusResponse> {
  const { data } = await api.put<UpdateRefundStatusResponse>(
    "/admin/credit/refunds/" + payload.id,
    payload
  );
  return data;
}
