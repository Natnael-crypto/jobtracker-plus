import { useMutation, useQuery } from "@tanstack/react-query";
import { CreditResponse } from "@/types/credit";
import { buyCredits, getUserCredit } from "@/services/credit";

export const useUserCredit = (page: number, limit = 10) => {
  return useQuery<CreditResponse>({
    queryKey: ["userCredit", page, limit],
    queryFn: () => getUserCredit(page, limit),
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
