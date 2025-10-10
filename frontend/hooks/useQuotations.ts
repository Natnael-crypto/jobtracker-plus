// hooks/quotations.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQuotation,
  deleteQuotation,
  getQuotationsByUser,
  getQuotationByID,
  updateQuotationStatus,
  getQuotationByJobIDBusiness,
  getQuotationByJobIDClient,
} from "../services/quotations";
import {
  CreateQuotationRequest,
  CreateQuotationResponse,
  GetQuotationResponse,
  Quotation,
  UpdateQuotationRequest,
} from "../types/quotations";

export function useUserQuotations(enabled = true) {
  return useQuery({
    queryKey: ["quotations"],
    queryFn: () => getQuotationsByUser(),
    enabled,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useGetQuotationClient(
  jobId: string,
  user_id: string,
  enabled = true
) {
  return useQuery<GetQuotationResponse[]>({
    queryKey: ["quotationsJob", jobId],
    queryFn: () => getQuotationByJobIDClient({ job_id: jobId, user_id }),
    enabled: !!jobId && !!user_id && enabled,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useGetQuotationBusiness(jobId: string, enabled = true) {
  return useQuery<Quotation[]>({
    queryKey: ["quotationsJob", jobId],
    queryFn: () => getQuotationByJobIDBusiness(jobId),
    enabled: !!jobId && enabled,
    staleTime: 60_000, // 1 min
    retry: 1,
  });
}

export function useGetQuotationByID(id: string, enabled = true) {
  return useQuery<GetQuotationResponse>({
    queryKey: ["quotationsJobById", id],
    queryFn: () => getQuotationByID(id),
    enabled: !!id && enabled,
    staleTime: 60_000, // 1 min
    retry: 1,
  });
}

export function useCreateQuotation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuotationRequest) => createQuotation(payload),
    onSuccess: (data: CreateQuotationResponse) => {
      qc.invalidateQueries({ queryKey: ["quotations"] });
      qc.invalidateQueries({
        queryKey: ["quotationsJob", data.quotation.job_id],
      });
    },
  });
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateQuotationRequest;
    }) => updateQuotationStatus(id, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["quotationsJobById", variables.id],
      });
    },
    onError: (error: any) => {
      console.error(" Failed to update quotation:", error);
    },
  });
}

export const useDeleteQuotation = () => {
  return useMutation({
    mutationFn: (id: string) => deleteQuotation(id),
  });
};
