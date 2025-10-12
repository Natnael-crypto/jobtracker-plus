"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCreateQuestion } from "@/hooks/qa";
import { useUser } from "@/hooks/useLogin";
import { AllServices } from "@/data/services";

const CreateQuestionForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const { mutate: createQuestionMutation, isPending: isSubmitting } =
    useCreateQuestion();

  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      window.location.href = "/login";
      return;
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      createQuestionMutation(
        {
          title: title.trim(),
          content: content.trim(),
          category,
        },
        {
          onSuccess: () => {
            setTitle("");
            setContent("");
            setCategory("");
            window.location.href = "/questions";
          },
        }
      );
    } catch (err: any) {}
  };

  return (
    <div>
      {user?.data?.role == "client" ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-sm  mx-auto mb-8"
        >
          <div className="mb-4">
            <label className="block text-gray-600 mb-2 font-medium">
              Title
            </label>
            <Input
              placeholder="Enter your question"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2 font-medium">
              Details
            </label>
            <textarea
              placeholder="Add more details to help trades answer"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-md p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-2 font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {AllServices.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm hover:shadow-lg focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Question"}
          </Button>
        </form>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-red-500 mb-6">
            Clients only can ask questions
          </h2>
        </div>
      )}
    </div>
  );
};

export default CreateQuestionForm;
