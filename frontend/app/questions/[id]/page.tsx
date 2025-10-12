"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ThumbsUp, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TopNav from "@/components/langing/top";
import Footer from "@/components/langing/Footer";
import { useAnswers, useLikeAnswer, useQuestion } from "@/hooks/qa";
import { Answer } from "@/types/qa";
import { formatDateToReadable } from "@/lib/date_converter";
import AnswerForm from "@/components/common/AnswerForm";

// --- Upvote Button Component ---
const UpvoteButton: React.FC<{ answerId: string; count: number }> = ({
  answerId,
  count,
}) => {
  const { mutate: likeAnswer, isPending: isUpvoting } = useLikeAnswer();

  const handleLike = async () => {
    try {
      likeAnswer(answerId);
    } catch (err: any) {}
  };

  return (
    <Button
      variant="outline"
      className="flex items-center space-x-2 px-3 py-1 rounded-xl text-gray-700 hover:bg-gray-100"
      onClick={handleLike}
      disabled={isUpvoting}
    >
      <ThumbsUp className="w-4 h-4 text-gray-500" />
      <span className="text-sm font-medium">{count}</span>
    </Button>
  );
};

// --- Answer Card ---
const AnswerCard: React.FC<{ answer: Answer; isBestAnswer?: boolean }> = ({
  answer,
  isBestAnswer,
}) => {
  const initials = (answer?.full_name ?? "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="py-6 sm:py-7">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 mt-1">
          {initials}
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
              <span className="text-base font-semibold text-black">
                {answer.full_name}
              </span>
            </div>
            {isBestAnswer && (
              <div className="flex items-center text-green-500 font-semibold text-sm py-1 px-2 rounded-full">
                <Star className="w-4 h-4 fill-green-500 mr-1" />
                Best Answer
              </div>
            )}
          </div>

          <p className="text-gray-700 mb-4 italic leading-relaxed text-sm">
            {answer.content}
          </p>

          <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
            <span className="whitespace-nowrap">
              Answered on {formatDateToReadable(answer.created_at)}
            </span>
            <UpvoteButton answerId={answer.id} count={answer.like_count} />
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionBlock: React.FC<{ questionId: string }> = ({ questionId }) => {
  const { data: question, isLoading, error } = useQuestion(questionId);

  if (isLoading) return <p>Loading question...</p>;
  if (error || !question)
    return <p className="text-red-500">Failed to load question.</p>;

  return (
    <Card className="bg-white border-0 mb-8 shadow-none rounded-sm p-0">
      <CardContent className="p-0">
        <div className="text-gray-600 text-sm font-semibold mb-1">
          {question.category}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-3">
          {question.title}
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">{question.content}</p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-200 pt-4">
          <span className="text-sm text-gray-500 mb-3 sm:mb-0">
            Asked by{" "}
            <span className="font-semibold text-black">
              {question.first_name}
            </span>{" "}
            on {formatDateToReadable(question.created_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const TradesmanQnA: React.FC = () => {
  const params = useParams();
  const questionId = params.id as string;
  const [page, setPage] = useState(1);
  const limit = 10;
  const [sort, setSort] = useState("Most liked");
  const [open, setOpen] = useState(false);

  const {
    data: answers,
    isLoading,
    error,
  } = useAnswers(questionId, page, limit, sort);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <TopNav />
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <QuestionBlock questionId={questionId} />

        <Button
          onClick={() => setOpen(true)}
          className="bg-green-500 px-4 py-1 rounded-sm text-white hover:bg-green-600"
        >
          Answer
        </Button>

        <br />
        {open && <AnswerForm questionId={questionId} />}
        <br />

        <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">
          Expert Trade Answers
        </h2>

        {isLoading && <p>Loading answers...</p>}
        {error && <p className="text-red-500">Failed to load answers.</p>}

        <div className="divide-y divide-gray-100">
          {answers?.data?.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}
        </div>

        {answers?.pagination.total === limit && (
          <div className="flex justify-center mt-6 space-x-4">
            <Button onClick={() => setPage((p) => Math.max(p - 1, 1))}>
              Previous
            </Button>
            <span className="text-gray-600">
              Page {page} of {answers!.pagination.total_pages}
            </span>
            <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TradesmanQnA;
