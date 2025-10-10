import { Upload, X } from "lucide-react";
import {
  useUploadJobImage,
  useGetJobImages,
  useDeleteJobImage,
} from "@/hooks/useJobImages";
import { LIGHT_BORDER } from "@/app/client/post-job/page";

interface PhotoUploadProps {
  jobId: string;
  imageUrls: string[];
  updateData: (partial: { imageUrls: string[] }) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  jobId,
  imageUrls,
  updateData,
}) => {
  const { data: images } = useGetJobImages(jobId);
  const uploadMutation = useUploadJobImage(jobId);
  const deleteMutation = useDeleteJobImage(jobId);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const uploaded = await uploadMutation.mutateAsync(file);

    updateData({ imageUrls: [...imageUrls, uploaded.image_url] });
  };

  const handleDelete = async (id: string, url: string) => {
    await deleteMutation.mutateAsync(id);
    updateData({ imageUrls: imageUrls.filter((u) => u !== url) });
  };

  return (
    <div
      className="mt-4 p-6 border-2 border-dashed rounded flex flex-col items-center justify-center text-gray-500"
      style={{ borderColor: LIGHT_BORDER }}
    >
      <label className="cursor-pointer flex flex-col items-center">
        <Upload size={24} className="mb-2" />
        <p className="text-sm">Click to upload photos</p>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <div className="flex mt-4 space-x-3 flex-wrap">
        {imageUrls.map((url) => (
          <div key={url} className="relative w-16 h-16">
            <img src={url} className="w-16 h-16 rounded-lg object-cover" />
            <button
              onClick={() => handleDelete(url.split("/").pop()!, url)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1"
            >
              <X />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
