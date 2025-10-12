import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, getUserReviews } from "@/services/reviewService";
import type {
  CreateReviewRequest,
  CreateReviewResponse,
  ReviewResponse,
} from "@/types/review";

export const useUserReviews = (userId: string) => {
  return useQuery<ReviewResponse>({
    queryKey: ["userReviews", userId],
    queryFn: () => getUserReviews(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useCreateReview = (jobID: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => createReview(jobID, data),
    onSuccess: (review: CreateReviewResponse) => {
      queryClient.invalidateQueries({ queryKey: ["userReviews", jobID] });
    },
  });
};
