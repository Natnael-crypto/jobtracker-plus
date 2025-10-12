import api from "@/lib/axios";
import type {
  CreateReviewRequest,
  CreateReviewResponse,
  ReviewResponse,
} from "@/types/review";

export const getUserReviews = async (
  userId: string
): Promise<ReviewResponse> => {
  try {
    const { data } = await api.get<ReviewResponse>(
      `/reviews/user/all/${userId}`
    );
    return data;
  } catch (error: any) {
    console.error("Error fetching user reviews:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch user reviews"
    );
  }
};

export const createReview = async (
  jobID: string,
  data: CreateReviewRequest
): Promise<CreateReviewResponse> => {
  const response = await api.post(`/reviews/job/${jobID}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
