import {
  UpdateIntroductionRequest,
  IntroductionResponse,
} from "@/types/introduction";
import api from "@/lib/axios";

export const getIntroduction = async (
  userId: string
): Promise<IntroductionResponse> => {
  const { data } = await api.get<IntroductionResponse>(
    `/business/introduction/${userId}`
  );
  return data;
};

export const getMyIntroduction = async (): Promise<IntroductionResponse> => {
  const { data } = await api.get<IntroductionResponse>(
    `/business/my-introduction`
  );
  return data;
};

export const updateIntroduction = async (
  payload: UpdateIntroductionRequest
): Promise<IntroductionResponse> => {
  const { data } = await api.put<IntroductionResponse>(
    "/business/introduction",
    payload
  );
  return data;
};
