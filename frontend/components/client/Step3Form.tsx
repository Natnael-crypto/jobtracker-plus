import {
  ACCENT_COLOR,
  Card,
  FormStepProps,
  LIGHT_BORDER,
} from "@/app/client/post-job/page";
import { Upload } from "lucide-react";
import { RadioOption } from "./Step2Form";
import { PhotoUpload } from "../business/PhotoUpload";

export const Step3Form: React.FC<FormStepProps> = ({
  data,
  updateData,
  nextStep,
}) => {
  const isSubmitDisabled =
    !data.description || data.hasPhotos === "Not Set" || !data.headline;

  return (
    <Card title="Other details" className="h-full">
      <h3 className="font-medium text-gray-800 mb-4">
        Please provide description of the job.
      </h3>
      <textarea
        value={data.description}
        onChange={(e) => updateData({ description: e.target.value })}
        rows={6}
        placeholder="Describe the work in detail..."
        className="w-full p-4 border rounded-xl resize-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
        style={{ borderColor: LIGHT_BORDER }}
      />

      <h3 className="font-medium text-gray-800 mt-8 mb-4">
        Would you like to upload any photos?
      </h3>
      <div className="flex space-x-4">
        <RadioOption
          label="Yes"
          checked={data.hasPhotos === "Yes"}
          onClick={() => updateData({ hasPhotos: "Yes" })}
        />
        <RadioOption
          label="No, maybe later"
          checked={data.hasPhotos === "No, maybe later"}
          onClick={() => updateData({ hasPhotos: "No, maybe later" })}
        />
      </div>
      

      {data.hasPhotos === "Yes" && (
        <PhotoUpload
          jobId={data.id}
          imageUrls={data.imageUrls}
          updateData={updateData}
        />
      )}

      <h3 className="font-medium text-gray-800 mt-8 mb-4">Name the job</h3>
      <input
        type="text"
        placeholder="A concise title for your job"
        value={data.headline}
        onChange={(e) => updateData({ headline: e.target.value })}
        className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
        style={{ borderColor: LIGHT_BORDER }}
      />

      <div className="mt-8 flex justify-center">
        <button
          onClick={nextStep}
          disabled={isSubmitDisabled}
          style={{
            backgroundColor: isSubmitDisabled ? "#BEE3C4" : ACCENT_COLOR,
          }}
          className={`w-1/3  py-3 rounded-xl text-white font-bold transition-colors ${
            isSubmitDisabled
              ? "cursor-not-allowed"
              : "hover:bg-green-700 shadow-md"
          }`}
        >
          Next
        </button>
      </div>
    </Card>
  );
};
