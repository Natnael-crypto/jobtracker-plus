import api from "@/lib/axios";
import {
  BuyCreditRequest,
  BuyCreditResponse,
  CreditResponse,
} from "@/types/credit";

export const getUserCredit = async (
  page = 1,
  limit = 10
): Promise<CreditResponse> => {
  const res = await api.get(`/business/credit`, {
    params: { page, limit },
  });
  return res.data;
};

export async function buyCredits(
  payload: BuyCreditRequest
): Promise<BuyCreditResponse> {
  const { data } = await api.post<BuyCreditResponse>(
    "/business/credit/buy",
    payload
  );
  return data;
}
