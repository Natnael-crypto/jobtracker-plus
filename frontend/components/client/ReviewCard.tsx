import React from "react";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { UserReview } from "@/types/review";
import { Review } from "@/types/trade";

interface ReviewCardProps {
  review: UserReview;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const AVATAR_SIZE = 56;

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length === 0) return "";
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0).toUpperCase() +
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  // Format created_at to "02-01-2006" (day-month-year)
  const formattedDate = review.created_at
    ? format(new Date(review.created_at), "dd-MM-yyyy")
    : "";

  return (
    <div className="w-full max-w-2xl p-4 border-b border-gray-200">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        {review.reviewer_image ? (
          <img
            src={review.reviewer_image}
            alt={review.reviewer}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#2E5E40] flex items-center justify-center text-white font-semibold text-lg">
            {getInitials(review.reviewer)}
          </div>
        )}

        {/* Reviewer info */}
        <div className="flex-grow pt-1">
          <div className="font-medium text-lg text-gray-900">
            {review.reviewer}
          </div>

          <div className="flex items-center justify-between mt-1">
            {/* Stars */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= review.rate
                      ? "text-amber-500 fill-amber-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Date */}
            <div className="text-sm text-gray-500">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <p className="mt-4 text-gray-800 text-base leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
};

interface ReviewCardProps2 {
  review: Review;
}

export const ReviewCard2: React.FC<ReviewCardProps2> = ({ review }) => {
  const AVATAR_SIZE = 56;

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length === 0) return "";
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0).toUpperCase() +
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  // Format created_at to "02-01-2006" (day-month-year)
  const formattedDate = review.created_at
    ? format(new Date(review.created_at), "dd-MM-yyyy")
    : "";

  return (
    <div className="w-full max-w-2xl p-4 border-b border-gray-200">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        {review.reviewer_image ? (
          <img
            src={review.reviewer_image}
            alt={review.reviewer}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#2E5E40] flex items-center justify-center text-white font-semibold text-lg">
            {getInitials(review.reviewer)}
          </div>
        )}

        {/* Reviewer info */}
        <div className="flex-grow pt-1">
          <div className="font-medium text-lg text-gray-900">
            {review.reviewer}
          </div>

          <div className="flex items-center justify-between mt-1">
            {/* Stars */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= review.rate
                      ? "text-amber-500 fill-amber-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Date */}
            <div className="text-sm text-gray-500">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <p className="mt-4 text-gray-800 text-base leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
};
