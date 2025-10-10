import { useState } from "react";
import Description from "./description";
import ChatInterface, { ChatInterfaceInner } from "../common/Message";
import QuotationBusiness from "./Quotation";
import { JobDetailItem } from "@/types/jobs";
import { useClientDetailJob } from "@/hooks/useJob";
import { CenterPanelSkeleton } from "./CenterPanelSkeleton";
import {
  useGetJobInviteForBusiness,
  useUpdateInviteStatus,
  useUpdateInviteStatusBusiness,
} from "@/hooks/useJobInvitations";

type Tab = "Job Description" | "Message" | "Quotation";

export const CenterPanelInvited = (job: JobDetailItem) => {
  const [activeTab, setActiveTab] = useState<Tab>("Job Description");
  const tabs: Tab[] = ["Job Description"];

  const { data, isLoading, isError } = useClientDetailJob(job.id);
  const { mutate: updateInviteStatus, isPending: isPendingInvite } =
    useUpdateInviteStatusBusiness();
  const { data: jobInvite } = useGetJobInviteForBusiness(job.id);

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

  const handleInvitationStatusChange = (status: string) => {
    console.log("jobInvite", jobInvite);
    if (!jobInvite?.id) return;
    updateInviteStatus({ invite_id: jobInvite?.id, status });
    if (!isPendingInvite) window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-xl font-bold text-gray-900">{job.headline}</h1>
          <div className="flex items-center space-x-3">
            {jobInvite?.status === "pending" ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleInvitationStatusChange("accepted")}
                  disabled={isPendingInvite}
                  className="inline-flex items-center rounded px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 border"
                >
                  Accept Invite
                </button>
                <button
                  onClick={() => handleInvitationStatusChange("rejected")}
                  disabled={isPendingInvite}
                  className="inline-flex items-center rounded px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 border"
                >
                  Reject Invite
                </button>
              </div>
            ) : jobInvite?.status === "accepted" ? (
              <button
                onClick={() => handleInvitationStatusChange("withdrawn")}
                disabled={true}
                className="inline-flex items-center rounded px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 border"
              >
                Withdraw
              </button>
            ) : null}
            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-600">
              3 Credits
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {job.city}, {job.state}, {job.country}
        </p>

        {jobInvite?.status === "accepted" ? (
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-800 mb-8 border border-gray-200">
            You have been charged 3 credits for accepting this invite.
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-800 mb-8 border border-gray-200">
            You will be charged 3 credits if you choose to accept this invite.
          </div>
        )}

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
          {activeTab === "Message" && jobInvite?.status != "pending" && (
            <ChatInterfaceInner jobId={job.id} />
          )}
          {activeTab === "Quotation" && jobInvite?.status != "pending" && (
            <QuotationBusiness id={job.id} />
          )}
        </div>
      </div>
    </div>
  );
};
