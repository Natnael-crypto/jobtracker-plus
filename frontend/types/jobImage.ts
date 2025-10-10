export interface JobImage {
  id: string;
  job_id: string;
  image_url: string;
  created_at: string;
}

export interface UploadJobImageResponse extends JobImage {}

export interface GetJobImagesResponse extends Array<JobImage> {}

export interface DeleteJobImageResponse {
  success: boolean;
}
