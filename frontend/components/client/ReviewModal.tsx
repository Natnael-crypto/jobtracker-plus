"use client";

import { useCreateReview } from "@/hooks/useUserReviews";
import { X } from "lucide-react";
import React, { useState } from "react";

interface ReviewModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
  user_id: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  jobId,
  isOpen,
  onClose,
  user_id,
}) => {
  const [rate, setRate] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { mutate, error: reviewError } = useCreateReview(jobId);

  const handleSubmit = () => {
    mutate(
      { rate, comment, user_id },
      {
        onSuccess: () => {
          setRate(0);
          setComment("");
          onClose();
        },
      }
    );
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/50 bg-opacity-10/50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black font-bold text-lg hover:text-gray-600"
          aria-label="Close modal"
        >
          <X />
        </button>

        <h2 className="text-2xl font-semibold text-black mb-4">
          Submit Your Review
        </h2>

        <div className="mb-4">
          <label className="block text-black font-medium mb-1">Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRate(star)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-colors
                  ${
                    rate >= star
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-black border-black hover:bg-yellow-100"
                  }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-black font-medium mb-1"
          >
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border border-black rounded-md p-2  resize-none"
            placeholder="Write your review..."
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
