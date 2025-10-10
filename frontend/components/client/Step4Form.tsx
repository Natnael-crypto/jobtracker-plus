"use client";

import { BookingData } from "@/app/client/post-job/page";
import { useCreateJob } from "@/hooks/useJob";
import { JobRequest } from "@/types/jobs";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";

interface Step4ReviewProps {
  data: BookingData;
}

const INITIAL_DATA: BookingData = {
  id: "",
  step: 1,
  service: "",
  serviceDetails: "",
  timeline: "Not Set",
  budget: "Not Set",
  location: "",
  description: "",
  hasPhotos: "Not Set",
  headline: "",
  imageUrls: [],
  address: {
    label: "",
    countryCode: "",
    countryName: "",
    state: "",
    countyCode: "",
    county: "",
    city: "",
    postalCode: "",
  },
};

const STORAGE_KEY = "bookingData";

const Step4Review: React.FC<Step4ReviewProps> = ({ data }) => {
  const { mutate, loading, error, job } = useCreateJob();
  const [successOpen, setSuccessOpen] = useState(false);
  const router = useRouter();

  const clearForm = useCallback(() => {
    const freshData = { ...INITIAL_DATA, id: uuidv4() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
  }, []);

  const onSubmitJob = async () => {
    try {
      const payload: JobRequest = {
        id: data.id,
        service_category: data.service,
        service_specific: data.serviceDetails,
        time: data.timeline,
        budget: data.budget,
        description: data.description,
        headline: data.headline,
        location: data.location,
        address: data.address,
        imageUrls: data.imageUrls,
      };

      await mutate(payload);

      // open success modal
      setSuccessOpen(true);
      clearForm();
      router.push("/client/my-jobs");
    } catch (err) {
      console.error(err);
    }
  };

  // auto redirect after 3 seconds if modal is open
  useEffect(() => {
    if (successOpen) {
      const timer = setTimeout(() => {
        clearForm();
        router.push("/client/my-jobs");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successOpen, router]);

  return (
    <div className="flex flex-col items-center justify-center p-10 h-full space-y-10">
      <div className="flex flex-col items-center">
        <CheckCircle size={64} className="text-gray-800 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Job
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          Please review the details of your job before submitting. Make sure all
          the information is correct.
        </p>
      </div>

      <div className="rounded-lg  divide-y divide-gray-100">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
              Headline
            </h3>
            <p className="text-gray-900 font-semibold">
              {data.headline
                ? data.headline.charAt(0).toUpperCase() + data.headline.slice(1)
                : ""}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
              Service
            </h3>
            <p className="text-gray-900 font-semibold">{data.service}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
              Service Details
            </h3>
            <p className="text-gray-900">{data.serviceDetails}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
              Timeline
            </h3>
            <p className="text-gray-900">{data.timeline}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
              Budget
            </h3>
            <p className="text-gray-900">{data.budget}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
              Location
            </h3>
            <p className="text-gray-900">{data.location}</p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
            Description
          </h3>
          <p className="text-gray-900 whitespace-pre-line break-words break-normal word-break-normal">
            {data.description}
          </p>
        </div>

        {data.imageUrls && data.imageUrls.length > 0 && (
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
              Images
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {data.imageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-32 rounded-md overflow-hidden border border-gray-200"
                >
                  <img
                    src={url}
                    alt={`Job image ${idx + 1}`}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={onSubmitJob}
        disabled={loading}
        className={`w-1/3 py-3 rounded-xl text-white font-bold transition-colors shadow-sm ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-800"
        }`}
      >
        {loading ? "Submitting..." : "Submit Job"}
      </button>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mb-2" />
              <DialogTitle className="text-xl font-semibold text-green-700">
                Job Created Successfully
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="text-center text-gray-600 py-4">
            Redirecting you to <span className="font-medium">My Jobs</span> in 3
            seconds...
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Step4Review;
