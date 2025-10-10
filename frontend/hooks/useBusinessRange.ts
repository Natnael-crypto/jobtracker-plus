// hooks/useBusinessRange.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateBusinessRangePayload,
  BusinessRange,
} from "@/types/businessRange";
import {
  getBusinessRange,
  updateBusinessRange,
} from "@/services/businessRange";

export function useBusinessRange() {
  const queryClient = useQueryClient();

  const query = useQuery<BusinessRange>({
    queryKey: ["businessRange"],
    queryFn: getBusinessRange,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: (payload: UpdateBusinessRangePayload) =>
      updateBusinessRange(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["businessRange"], data);
    },
  });

  return {
    ...query,
    update: mutation.mutateAsync,
    updateStatus: mutation.status,
  };
}
