import { useUserReviews } from "@/hooks/useUserReviews";
import { ReviewCard } from "./ReviewCard";

export interface ReviewCardProps {
  name: string;
  initials: string;
  rating: number;
  publishedDate: string;
  reviewText: string;
}

interface ReviewsProps {
  user_id: string;
}

export const Reviews: React.FC<ReviewsProps> = ({ user_id }) => {
  const { data, isLoading } = useUserReviews(user_id);

  if (isLoading && !data) {
    return null;
  }

  return (
    <div>
      {data && data.reviews.map((review) => <ReviewCard review={review} />)}
      {data && data.reviews.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No reviews found.</p>
      )}
    </div>
  );
};
