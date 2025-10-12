"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useCreateAnswer } from "@/hooks/qa";

interface AnswerFormProps {
  questionId: string;
}

const AnswerForm: React.FC<AnswerFormProps> = ({ questionId }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const {
    mutate: createAnswer,
    isPending,
    error: createAnswerError,
  } = useCreateAnswer(questionId);

  useEffect(() => {
    if (createAnswerError) {
      const message = createAnswerError.message || "";

      if (message.includes("403")) {
        setError(
          "Unable to create answer — you must be a Tradesperson or you have already answered this question."
        );
      } else {
        setError(
          message || "An unexpected error occurred while creating your answer."
        );
      }
    } else {
      setError("");
    }
  }, [createAnswerError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    createAnswer(
      { content: content.trim() },
      {
        onSuccess: () => {
          setContent("");
          window.location.reload();
        },
        onError: (err: any) => {},
      }
    );
  };

  return (
    <Card className="p-6 mt-10 border-gray-200 rounded-sm shadow-none bg-white">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Post Your Answer
      </h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write your answer here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px] text-gray-800 focus-visible:ring-green-600"
          required
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isPending ? "Submitting..." : "Submit Answer"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AnswerForm;
