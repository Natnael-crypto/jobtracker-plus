import { JobDetailItem } from "@/types/jobs";
import { useEffect, useState } from "react";
import Description from "./description";
import { useGetJobBid, useMakeBid } from "@/hooks/useBidStats";

type Tab = "Job Description";

export const CenterPanel = (job: JobDetailItem) => {
  const [activeTab, setActiveTab] = useState<Tab>("Job Description");
  const tabs: Tab[] = ["Job Description"];
  const { mutate: makeBid } = useMakeBid();

  const { data: bidData, refetch } = useGetJobBid(job.id);

  useEffect(() => {
    setActiveTab("Job Description");
    refetch();
  }, [job]);

  const handleMakeBid = async (job_id: string) => {
    makeBid(job_id);
  };
  return (
    <div className="space-y-6">
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-xl font-bold text-gray-900">{job.headline}</h1>
          <div className="flex items-center space-x-3">
            {bidData ? (
              <button
                onClick={() => handleMakeBid(job.id)}
                className="inline-flex items-center rounded px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 border"
              >
                Withdrawal
              </button>
            ) : (
              <button
                onClick={() => handleMakeBid(job.id)}
                className="inline-flex items-center rounded px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 border"
              >
                Bid Now
              </button>
            )}
            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-600">
              3 Credits
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          {job.city}, {job.state}, {job.country}{" "}
        </p>

        <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800 mb-8 border border-yellow-200">
          Bid Request is Free. You only incur charges once shortlisted
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
          <div className="flex-grow border-b border-gray-200 -ml-0.5"></div>
        </div>
        <div className="pt-4">
          {activeTab === "Job Description" && <Description {...job} />}
        </div>
      </div>
    </div>
  );
};
