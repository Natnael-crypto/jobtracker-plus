"use client";

import { CenterPanel } from "@/components/business/CenterPanel";
import { JobItem } from "@/components/business/JobItemListing";
import { RightPanel } from "@/components/business/RightPanel";
import { useBidStats } from "@/hooks/useBidStats";
import { useBusinessJobs } from "@/hooks/useJob";
import { JobDetailItem } from "@/types/jobs";
import React, { useEffect, useState } from "react";

export const PlaceholderShape = ({
  className = "w-full h-full",
}: {
  className?: string;
}) => (
  <div
    className={`flex items-center justify-center bg-gray-200 rounded-lg text-gray-400 ${className}`}
  >
    <svg
      className="w-1/3 h-1/3"
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M50 0 L100 50 L50 100 L0 50 Z" opacity="0.4" />
      <circle cx="50" cy="50" r="25" opacity="0.6" />
      <polygon points="50,10 90,50 50,90 10,50" opacity="0.8" />
    </svg>
  </div>
);

const StatCard: React.FC<{
  title: string;
  count: number;
  subText: string;
  highlightColor: string;
}> = ({ title, count, subText, highlightColor }) => (
  <div className="flex-1 min-w-0 p-4 bg-white rounded-xl w-[200px] border border-gray-200">
    <div className={`text-xs font-medium uppercase text-gray-500 mb-1`}>
      {title}
    </div>
    <div className="flex justify-between items-center">
      <div className="text-3xl font-bold text-gray-900">{count}</div>
    </div>
  </div>
);

export default function JobRequestDashboard() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isError, error } = useBusinessJobs(page, limit);
  const { data: state } = useBidStats();

  useEffect(() => {
    if (data?.data.length) {
      setActiveJobId((prev) => prev ?? data.data[0].id);
    }
  }, [data]);

  const darkCharcoalText = "text-[#1e293b]";

  const activeJob: JobDetailItem | undefined = data?.data.find(
    (job) => job.id === activeJobId
  );

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (data && page < data.total_pages) setPage((p) => p + 1);
  };

  return (
    <div className={`min-h-screen font-inter ${darkCharcoalText} p-6 md:p-10`}>
      <div className="mx-auto">
        <header className="mb-8">
          <div className="mb-6 flex items-center">
            <h1 className={`text-2xl font-bold ${darkCharcoalText} mr-12`}>
              Job Requests
            </h1>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <StatCard
                title="Leads"
                count={5}
                subText="View All 20"
                highlightColor="text-gray-500"
              />
              <StatCard
                title="Bid Sent"
                count={state ? state.total : 0}
                subText="View All 10"
                highlightColor="text-gray-500"
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-3">
            <div className="p-0 bg-white rounded-lg shadow-lg border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Leads</h2>
              </div>

              <div className="divide-y divide-gray-100">
                {isLoading && <p className="p-4 text-gray-500">Loading...</p>}
                {isError && (
                  <p className="p-4 text-red-500">Error: {error?.message}</p>
                )}
                {!isLoading && !isError && data?.data.length === 0 && (
                  <p className="p-4 text-gray-500">No jobs found</p>
                )}

                {data?.data.map((job) => (
                  <JobItem
                    key={job.id}
                    job={job}
                    isActive={job.id === activeJobId}
                    onClick={() => setActiveJobId(job.id)}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center p-4 border-t border-gray-100">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  &lt; Prev
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {data?.total_pages ?? 1}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === data?.total_pages}
                  className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {activeJob ? (
              <CenterPanel {...activeJob} />
            ) : (
              <div className="p-6 bg-white rounded-lg shadow-md text-gray-500">
                Select a job to view details
              </div>
            )}
          </div>

          {/* <div className="lg:col-span-3">
            {activeJob ? (
              <RightPanel {...activeJob!} />
            ) : (
              <div className="p-6 bg-white rounded-lg shadow-md text-gray-500">
                No job selected
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
