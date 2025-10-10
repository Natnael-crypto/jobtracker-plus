import { JobDetail } from "@/types/jobs";
import { ChatInterfaceInner } from "../common/Message";
import { ProfileDetails } from "./profileDetaile";
import { Reviews } from "./Reviews";
import { UserProfile } from "@/types/jobBid";
import { formatDateToReadable } from "@/lib/date_converter";
import { useState } from "react";
import { Calendar, MapPin, MessageCircle, Trash2 } from "lucide-react";
import { useDeleteJob } from "@/hooks/useJob";
import { ContractorCard } from "./ContractorCard";
import JobDetailsSection from "./JobDetail";
import { Quotation } from "./Quotation";
import { Invoice } from "./Invoice";

export const JobDetailSection: React.FC<{
  job: JobDetail;
  activeUser: string;
}> = ({ job, activeUser }) => {
  const [activeTab, setActiveTab] = useState("Job Summary");
  const tabs = [
    "Job Summary",
    "Profile",
    "Reviews",
    "Message",
    "Quotation",
    "Invoice",
  ];

  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  const createdDate = formatDateToReadable(job.created_at);

  const handleDeleteJob = () => {
    deleteJob(job.id);
    if (!isDeleting) {
      window.location.href = "/client/my-jobs";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{job.headline}</h1>
        <div className="flex space-x-3 text-sm flex-wrap">
          <button
            onClick={handleDeleteJob}
            className="text-gray-600 hover:text-red-600 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </button>
          <span className="inline-block px-3 py-1 font-medium text-gray-500 bg-gray-100 rounded-full">
            Bid Request
          </span>
        </div>
      </div>

      {/* Job meta */}
      <div className="flex items-center text-sm text-gray-600 space-x-4 border-b border-gray-200 pb-4 flex-wrap">
        <div className="flex items-center mb-2 md:mb-0">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
          <span>{createdDate}</span>
        </div>
        <div className="flex items-center mb-2 md:mb-0">
          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
          <span>{job.city}</span>
        </div>
        <div className="flex items-center">
          <MessageCircle className="w-4 h-4 mr-2 text-gray-500" />
          <span>{job.bids} Responses</span>
        </div>
      </div>

      {/* Contractor details only if selected */}
      {activeUser != "" && <ContractorCard id={activeUser} jobId={job.id} />}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) =>
          tab != "Job Summary" ? (
            activeUser != "" && (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-center font-medium transition-colors ${
                  activeTab === tab
                    ? "text-green-700 border-b-2 border-green-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            )
          ) : (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-center font-medium transition-colors ${
                activeTab === tab
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          )
        )}
        <div className="flex-grow border-b border-gray-200 -ml-0.5"></div>
      </div>

      {/* Tab content */}
      <div className="pt-4">
        {activeTab === "Job Summary" && <JobDetailsSection data={job} />}
        {activeTab === "Profile" && activeUser != "" && (
          <ProfileDetails id={activeUser} />
        )}
        {activeTab === "Reviews" && activeUser != "" && (
          <Reviews user_id={activeUser} />
        )}
        {activeTab === "Message" && activeUser != "" && (
          <ChatInterfaceInner jobId={job.id} />
        )}
        {activeTab === "Quotation" && activeUser != "" && (
          <Quotation jobId={job.id} userId={activeUser} />
        )}
        {activeTab === "Invoice" && activeUser != "" && (
          <Invoice jobId={job.id} userId={activeUser} />
        )}
      </div>
    </div>
  );
};
