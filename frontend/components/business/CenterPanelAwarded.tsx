import { useState } from "react";
import Description from "./description";
import ChatInterface, { ChatInterfaceInner } from "../common/Message";
import QuotationBusiness from "./Quotation";
import { JobDetailItem } from "@/types/jobs";
import { useClientDetailJob } from "@/hooks/useJob";
import { CenterPanelSkeleton } from "./CenterPanelSkeleton";
import InvoiceBusiness from "./Invoice";

type Tab = "Job Description" | "Message" | "Quotation" | "Invoice";

export const CenterPanelAwarded = (job: JobDetailItem) => {
  const [activeTab, setActiveTab] = useState<Tab>("Job Description");
  const tabs: Tab[] = ["Job Description", "Message", "Quotation", "Invoice"];

  const { data, isLoading, isError } = useClientDetailJob(job.id);

  if (isLoading || !job?.id) {
    return <CenterPanelSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 text-center text-red-600">
        Failed to load job details.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-xl font-bold text-gray-900">{job.headline}</h1>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center rounded px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 border">
              Hired
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">{job.street}</p>

        <div className="flex justify-between items-center mb-4 border-1 py-4 rounded-lg px-2 border-gray-200">
          <div className="flex">
            <img src="/phone.svg" alt="" className="mr-2" />
            <p className="text-gray-600">{data?.phone || "N/A"}</p>
          </div>
          <div className="flex">
            <img src="/mail.svg" alt="" className="mr-2" />
            <p className="text-gray-600">{data?.email || "N/A"}</p>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-3 text-center font-medium transition-colors
                ${
                  activeTab === tab
                    ? "text-green-700 border-b-2 border-green-700"
                    : "text-gray-600 hover:text-gray-800"
                }
              `}
            >
              {tab}
            </button>
          ))}
          <div className="flex-grow border-b border-gray-200 -ml-0.5" />
        </div>

        <div className="pt-4">
          {activeTab === "Job Description" && <Description {...job} />}
          {activeTab === "Message" && <ChatInterfaceInner jobId={job.id} />}
          {activeTab === "Quotation" && <QuotationBusiness id={job.id} />}
          {activeTab === "Invoice" && <InvoiceBusiness id={job.id} />}
        </div>
      </div>
    </div>
  );
};
