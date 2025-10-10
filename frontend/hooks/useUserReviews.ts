import { useQuery } from "@tanstack/react-query";
import { getUserReviews } from "@/services/reviewService";
import type { ReviewResponse } from "@/types/review";

export const useUserReviews = (userId: string) => {
  return useQuery<ReviewResponse>({
    queryKey: ["userReviews", userId],
    queryFn: () => getUserReviews(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
