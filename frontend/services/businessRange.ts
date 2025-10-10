import api from "@/lib/axios";
import {
  BusinessRange,
  UpdateBusinessRangePayload,
} from "@/types/businessRange";

export async function getBusinessRange(): Promise<BusinessRange> {
  const { data } = await api.get<BusinessRange>("/business/range");

  return data;
}

export async function updateBusinessRange(
  payload: UpdateBusinessRangePayload
): Promise<BusinessRange> {
  const { data } = await api.put("/business/range", payload);
  return data;
}
