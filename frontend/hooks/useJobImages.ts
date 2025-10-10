"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  uploadJobImage,
  getJobImages,
  deleteJobImage,
} from "@/services/jobImage";
import { JobImage } from "@/types/jobImage";

export function useGetJobImages(jobId: string) {
  return useQuery<JobImage[], Error>({
    queryKey: ["job-images", jobId],
    queryFn: () => getJobImages(jobId),
    enabled: !!jobId,
    retry: 3,
  });
}

export function useUploadJobImage(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadJobImage(jobId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-images", jobId] });
    },
  });
}

export function useDeleteJobImage(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) => deleteJobImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-images", jobId] });
    },
  });
}
