import api from "@/lib/axios";
import {
  Answer,
  CreateAnswerRequest,
  CreateQuestionRequest,
  PaginatedResponse,
  Question,
  UpdateAnswerRequest,
  UpdateQuestionRequest,
} from "@/types/qa";

export const getQuestions = async (
  page: number,
  limit: number,
  search?: string,
  category?: string,
  sort?: string,
  my?: boolean
): Promise<PaginatedResponse<Question>> => {
  const params: Record<string, any> = { page, limit };
  if (search) params.search = search;
  if (category) params.category = category;
  if (sort) params.sort = sort;
  if (my) params.my = my;
  if (category == "All") {
    delete params.category;
  }
  const { data } = await api.get<PaginatedResponse<Question>>("/questions", {
    params,
  });
  return data;
};

export const getQuestionByID = async (id: string): Promise<Question> => {
  const { data } = await api.get<Question>(`/questions/${id}`);
  return data;
};

export const createQuestion = async (
  payload: CreateQuestionRequest
): Promise<Question> => {
  const { data } = await api.post<Question>("/questions", payload);
  return data;
};

export const updateQuestion = async (
  id: string,
  payload: UpdateQuestionRequest
): Promise<Question> => {
  const { data } = await api.put<Question>(`/questions/${id}`, payload);
  return data;
};

export const deleteQuestion = async (id: string): Promise<void> => {
  await api.delete(`/questions/${id}`);
};

export const getAnswers = async (
  questionId: string,
  page: number,
  limit: number,
  sort?: string
): Promise<PaginatedResponse<Answer>> => {
  const params: Record<string, any> = { page, limit };
  if (sort) params.sort = sort;
  if (sort == "All") {
    delete params.sort;
  }

  const { data } = await api.get<PaginatedResponse<Answer>>(
    `/answers/question/${questionId}`,
    { params }
  );
  return data;
};

export const getAnswerByID = async (id: string): Promise<Answer> => {
  const { data } = await api.get<Answer>(`/answers/${id}`);
  return data;
};

export const createAnswer = async (
  questionId: string,
  payload: CreateAnswerRequest
): Promise<Answer> => {
  const { data } = await api.post<Answer>(`/answers/${questionId}`, payload);
  return data;
};

export const updateAnswer = async (
  id: string,
  payload: UpdateAnswerRequest
): Promise<Answer> => {
  const { data } = await api.put<Answer>(`/answers/${id}`, payload);
  return data;
};

export const deleteAnswer = async (id: string): Promise<void> => {
  await api.delete(`/answers/${id}`);
};

export const likeAnswer = async (id: string): Promise<void> => {
  await api.put(`/answers/${id}`);
};
