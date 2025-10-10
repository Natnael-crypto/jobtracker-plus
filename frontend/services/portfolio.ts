import api from "@/lib/axios";
import {
  Portfolio,
  UploadPortfolioResponse,
  DeletePortfolioResponse,
  GetUserPortfolioResponse,
} from "@/types/portfolio";

export async function uploadPortfolioImage(
  file: File
): Promise<UploadPortfolioResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post("/business/portfolio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function deletePortfolioImage(
  portfolioId: string
): Promise<DeletePortfolioResponse> {
  const { data } = await api.delete(`/business/portfolio/${portfolioId}`);
  return data;
}

export async function getUserPortfolio(userId: string): Promise<Portfolio[]> {
  const { data } = await api.get<GetUserPortfolioResponse>(
    `/business/portfolio/${userId}`
  );
  return data.images;
}

export async function getMyPortfolio(): Promise<Portfolio[]> {
  const { data } = await api.get<GetUserPortfolioResponse>(
    `/business/portfolio`
  );
  return data.images;
}
