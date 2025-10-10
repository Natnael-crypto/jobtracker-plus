"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Step1Form } from "@/components/client/Step1Form";
import { Step2Form } from "@/components/client/Step2Form";
import { Step3Form } from "@/components/client/Step3Form";
import { SidebarJob } from "@/components/client/SidebarJob";
import { v4 as uuidv4 } from "uuid";
import Step4Review from "@/components/client/Step4Form";
import TopNav from "@/components/langing/top";
import Footer from "@/components/langing/Footer";

type Step = 1 | 2 | 3 | 4;

export interface BookingData {
  id: string;
  step: Step;
  service: string;
  serviceDetails: string;
  timeline:
    | "As soon as possible"
    | "Specific date"
    | "Flexible"
    | "Not Set"
    | string;
  budget:
    | "£50 - £1,000"
    | "£1,000 - £5,000"
    | "£5,000 +"
    | "Prefer not to say"
    | "Not Set";
  location: string;
  description: string;
  hasPhotos: "Yes" | "No, maybe later" | "Not Set";
  headline: string;
  imageUrls: string[];
  address: {
    label: string;
    countryCode: string;
    countryName: string;
    state: string;
    countyCode: string;
    county: string;
    city: string;
    postalCode: string;
  };
}

export const ACCENT_COLOR = "#69B87F";
export const BG_COLOR = "#F7F7F7";
export const LIGHT_BORDER = "#DDEEED";

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

export interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = "",
}) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>
    <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
    {children}
  </div>
);

export interface FormStepProps {
  data: BookingData;
  updateData: (fields: Partial<BookingData>) => void;
  nextStep: () => void;
}

const STORAGE_KEY = "bookingData";

const JobCreateForm: React.FC = () => {
  const [data, setData] = useState<BookingData>(INITIAL_DATA);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: BookingData = JSON.parse(saved);
        setData(parsed);
        return;
      } catch {
        console.warn("Invalid booking data in localStorage, resetting.");
      }
    }

    const freshData = { ...INITIAL_DATA, id: uuidv4() };
    setData(freshData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
  }, []);

  // ✅ Centralized update function (persists to localStorage)
  const updateData = useCallback((fields: Partial<BookingData>) => {
    setData((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ✅ Save step progress in localStorage
  const nextStep = useCallback(() => {
    setData((prev) => {
      const next = (prev.step + 1) as Step;
      const updated = { ...prev, step: next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const prevStep = useCallback(() => {
    setData((prev) => {
      if (prev.step > 1) {
        const prevStep = (prev.step - 1) as Step;
        const updated = { ...prev, step: prevStep };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, []);

  const clearForm = useCallback(() => {
    const freshData = { ...INITIAL_DATA, id: uuidv4() };
    setData(freshData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
  }, []);

  const stepTitle = useMemo(() => {
    switch (data.step) {
      case 1:
        return "Service Details";
      case 2:
        return "Other details";
      case 3:
        return "Other details";
      case 4:
        return "Review & Submit";
      default:
        return "Submission Complete";
    }
  }, [data.step]);

  return (
    <div className="min-h-screen p-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            {data.step <= 4 && (
              <button
                onClick={prevStep}
                className="p-2 mr-4 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft size={24} className="text-gray-800" />
              </button>
            )}
            <h1 className="text-xl font-medium text-gray-800">
              {data.step < 4 ? `Step ${data.step} of 3` : stepTitle}
            </h1>
          </div>
          <button
            onClick={clearForm}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Clear Form
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              {data.step === 1 && (
                <Step1Form
                  data={data}
                  updateData={updateData}
                  nextStep={nextStep}
                />
              )}
              {data.step === 2 && (
                <Step2Form
                  data={data}
                  updateData={updateData}
                  nextStep={nextStep}
                />
              )}
              {data.step === 3 && (
                <Step3Form
                  data={data}
                  updateData={updateData}
                  nextStep={nextStep}
                />
              )}
              {data.step === 4 && <Step4Review data={data} />}
            </div>
          </div>

          <div className="lg:col-span-1">
            <SidebarJob data={data} />
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default JobCreateForm;
