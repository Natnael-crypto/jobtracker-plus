import {
  createInvoice,
  deleteInvoice,
  getInvoiceByID,
  getInvoiceByJobIDBusiness,
  getInvoiceByJobIDClient,
  getInvoiceByUser,
  getInvoices,
  updateInvoiceStatus,
} from "@/services/invoice";
import {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  GetInvoiceResponse,
  Invoice,
  PaginatedInvoicesResponse,
  UpdateInvoicesRequest,
} from "@/types/invoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUserInvoice(enabled = true) {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: () => getInvoiceByUser(),
    enabled,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useGetInvoiceClient(
  jobId: string,
  user_id: string,
  enabled = true
) {
  return useQuery<Invoice[]>({
    queryKey: ["invoicesJob", jobId],
    queryFn: () => getInvoiceByJobIDClient({ job_id: jobId, user_id }),
    enabled: !!jobId && !!user_id && enabled,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useGetInvoiceBusiness(jobId: string, enabled = true) {
  return useQuery<Invoice[]>({
    queryKey: ["invoicesJob", jobId],
    queryFn: () => getInvoiceByJobIDBusiness(jobId),
    enabled: !!jobId && enabled,
    staleTime: 60_000, // 1 min
    retry: 1,
  });
}

export function useGetInvoiceByID(id: string, enabled = true) {
  return useQuery<GetInvoiceResponse>({
    queryKey: ["invoicesJobById", id],
    queryFn: () => getInvoiceByID(id),
    enabled: !!id && enabled,
    staleTime: 60_000, // 1 min
    retry: 1,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInvoiceRequest) => createInvoice(payload),
    onSuccess: (data: CreateInvoiceResponse) => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({
        queryKey: ["invoicesJob", data.invoice.job_id],
      });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateInvoicesRequest;
    }) => updateInvoiceStatus(id, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invoicesJobById", variables.id],
      });
    },
    onError: (error: any) => {
      console.error(" Failed to update quotation:", error);
    },
  });
}

export const useDeleteInvoice = () => {
  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
  });
};

export function useInvoices(page: number, limit: number = 10) {
  return useQuery<PaginatedInvoicesResponse>({
    queryKey: ["invoices", page, limit],
    queryFn: () => getInvoices(page, limit),
    staleTime: 1000 * 60 * 2,
  });
}
