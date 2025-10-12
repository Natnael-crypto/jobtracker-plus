// hooks/questions.ts
import {
  createAnswer,
  createQuestion,
  deleteAnswer,
  deleteQuestion,
  getAnswerByID,
  getAnswers,
  getQuestionByID,
  getQuestions,
  likeAnswer,
  updateAnswer,
  updateQuestion,
} from "@/services/qa";
import {
  CreateAnswerRequest,
  CreateQuestionRequest,
  UpdateAnswerRequest,
  UpdateQuestionRequest,
} from "@/types/qa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useQuestions = (
  page: number,
  limit: number,
  search?: string,
  category?: string,
  sort?: string,
  my?: boolean
) => {
  return useQuery({
    queryKey: ["questions", page, limit, search, category, sort, my],
    queryFn: () => getQuestions(page, limit, search, category, sort, my),
  });
};

export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestionByID(id),
    enabled: !!id,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuestionRequest) => createQuestion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateQuestionRequest;
    }) => updateQuestion(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", id] });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

export const useAnswers = (
  questionId: string,
  page: number,
  limit: number,
  sort?: string
) => {
  return useQuery({
    queryKey: ["answers", questionId, page, limit, sort],
    queryFn: () => getAnswers(questionId, page, limit, sort),
  });
};

// Single answer
export const useAnswer = (id: string) => {
  return useQuery({
    queryKey: ["answer", id],
    queryFn: () => getAnswerByID(id),
    enabled: !!id,
  });
};

// Create answer
export const useCreateAnswer = (questionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAnswerRequest) =>
      createAnswer(questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answers", questionId] });
    },
  });
};

// Update answer
export const useUpdateAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAnswerRequest;
    }) => updateAnswer(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["answer", id] });
    },
  });
};

// Delete answer
export const useDeleteAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAnswer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answers"] });
    },
  });
};

export const useLikeAnswer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => likeAnswer(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["answers"] });
      queryClient.invalidateQueries({ queryKey: ["answer", id] });
    },
  });
};
