import {
  ACCENT_COLOR,
  Card,
  FormStepProps,
  LIGHT_BORDER,
} from "@/app/client/post-job/page";
import { RadioOption } from "./Step2Form";
import { PhotoUpload } from "../business/PhotoUpload";
import { useMemo } from "react";

export const Step3Form: React.FC<FormStepProps> = ({
  data,
  updateData,
  nextStep,
}) => {
  const descriptionLength = data.description?.trim().length || 0;
  const headlineLength = data.headline?.trim().length || 0;

  const descriptionError =
    descriptionLength > 0 &&
    (descriptionLength < 20 || descriptionLength > 1000)
      ? "Description must be between 20 and 1000 characters."
      : "";

  const headlineError =
    headlineLength > 0 && (headlineLength < 5 || headlineLength > 50)
      ? "Headline must be between 5 and 50 characters."
      : "";

  const isSubmitDisabled = useMemo(() => {
    return (
      !data.description ||
      !data.headline ||
      data.hasPhotos === "Not Set" ||
      descriptionLength < 20 ||
      descriptionLength > 1000 ||
      headlineLength < 5 ||
      headlineLength > 50
    );
  }, [data, descriptionLength, headlineLength]);

  return (
    <Card title="Other details" className="h-full">
      {/* Description Section */}
      <h3 className="font-medium text-gray-800 mb-4">
        Please provide a description of the job.
      </h3>
      <textarea
        value={data.description}
        onChange={(e) => updateData({ description: e.target.value })}
        rows={6}
        placeholder="Describe the work in detail..."
        className="w-full p-4 border rounded-xl resize-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
        style={{ borderColor: LIGHT_BORDER }}
      />
      {descriptionError && (
        <p className="text-red-500 text-sm mt-1">{descriptionError}</p>
      )}
      {!descriptionError && descriptionLength > 0 && (
        <p className="text-gray-500 text-xs mt-1">
          {descriptionLength}/1000 characters
        </p>
      )}

      {/* Photos Section */}
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

      {/* Headline Section */}
      <h3 className="font-medium text-gray-800 mt-8 mb-4">Name the job</h3>
      <input
        type="text"
        placeholder="A concise title for your job"
        value={data.headline}
        onChange={(e) => updateData({ headline: e.target.value })}
        className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
        style={{ borderColor: LIGHT_BORDER }}
      />
      {headlineError && (
        <p className="text-red-500 text-sm mt-1">{headlineError}</p>
      )}
      {!headlineError && headlineLength > 0 && (
        <p className="text-gray-500 text-xs mt-1">
          {headlineLength}/50 characters
        </p>
      )}

      {/* Next Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={nextStep}
          disabled={isSubmitDisabled}
          style={{
            backgroundColor: isSubmitDisabled ? "#BEE3C4" : ACCENT_COLOR,
          }}
          className={`w-1/3 py-3 rounded-xl text-white font-bold transition-colors ${
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
