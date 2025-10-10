import {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  GetInvoiceResponse,
  Invoice,
  PaginatedInvoicesResponse,
  UpdateInvoicesRequest,
} from "@/types/invoice";
import api from "../lib/axios";

export async function createInvoice(
  payload: CreateInvoiceRequest
): Promise<CreateInvoiceResponse> {
  const { data } = await api.post<CreateInvoiceResponse>("/invoices", payload);
  return data;
}

export async function updateInvoiceStatus(
  id: string,
  payload: UpdateInvoicesRequest
) {
  const { data } = await api.put("/invoices/" + id, payload);
  return data;
}

export async function getInvoiceByJobIDClient({
  job_id,
  user_id,
}: {
  job_id: string;
  user_id: string;
}): Promise<Invoice[]> {
  const { data } = await api.get<Invoice[]>(
    `/invoices/client/${encodeURIComponent(job_id)}/${encodeURIComponent(
      user_id
    )}`
  );
  return data;
}



export async function getInvoiceByJobIDBusiness(
  job_id: string
): Promise<Invoice[]> {
  const { data } = await api.get<Invoice[]>(
    `/invoices/business/${encodeURIComponent(job_id)}`
  );
  return data;
}

export async function getInvoiceByID(id: string): Promise<GetInvoiceResponse> {
  const { data } = await api.get<GetInvoiceResponse>(
    `/invoices/${encodeURIComponent(id)}`
  );
  return data;
}

export async function deleteInvoice(id: string): Promise<void> {
  await api.delete(`/invoices/${encodeURIComponent(id)}`);
}

export async function getInvoiceByUser(): Promise<Invoice[]> {
  const { data } = await api.get<Invoice[]>("/invoices");
  return data;
}

export async function getInvoices(
  page = 1,
  limit = 10
): Promise<PaginatedInvoicesResponse> {
  const response = await api.get(`/invoices/all`, {
    params: { page, limit },
  });
  return response.data;
}
