import api from "../lib/axios";
import {
  CreateQuotationRequest,
  CreateQuotationResponse,
  GetQuotationResponse,
  Quotation,
  UpdateQuotationRequest,
} from "../types/quotations";

export async function createQuotation(
  payload: CreateQuotationRequest
): Promise<CreateQuotationResponse> {
  const { data } = await api.post<CreateQuotationResponse>(
    "/quotations",
    payload
  );
  return data;
}

export async function updateQuotationStatus(
  id: string,
  payload: UpdateQuotationRequest
) {
  const { data } = await api.put("/quotations/" + id, payload);
  return data;
}

export async function getQuotationByJobIDClient({
  job_id,
  user_id,
}: {
  job_id: string;
  user_id: string;
}): Promise<GetQuotationResponse[]> {
  const { data } = await api.get<GetQuotationResponse[]>(
    `/quotations/client/${encodeURIComponent(job_id)}/${encodeURIComponent(
      user_id
    )}`
  );
  return data;
}

export async function getQuotationByJobIDBusiness(
  job_id: string
): Promise<Quotation[]> {
  const { data } = await api.get<Quotation[]>(
    `/quotations/business/${encodeURIComponent(job_id)}`
  );
  return data;
}

export async function getQuotationByID(
  id: string
): Promise<GetQuotationResponse> {
  const { data } = await api.get<GetQuotationResponse>(
    `/quotations/one/${encodeURIComponent(id)}`
  );
  return data;
}

export async function deleteQuotation(id: string): Promise<void> {
  await api.delete(`/quotations/${encodeURIComponent(id)}`);
}

export async function getQuotationsByUser(): Promise<Quotation[]> {
  const { data } = await api.get<Quotation[]>("/quotations");
  return data;
}
