// services/jobImage.ts
import api from "@/lib/axios";
import {
  JobImage,
  UploadJobImageResponse,
  GetJobImagesResponse,
} from "@/types/jobImage";

export async function uploadJobImage(
  jobId: string,
  file: File
): Promise<UploadJobImageResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post(`/client/jobs/${jobId}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function getJobImages(
  jobId: string
): Promise<GetJobImagesResponse> {
  const { data } = await api.get(`/jobs/${jobId}/images`);

  return data;
}

export async function deleteJobImage(imageId: string): Promise<void> {
  const { data } = await api.delete(`/client/jobs/images/${imageId}`);

  return data;
}
