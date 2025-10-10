"use client";

import { CenterPanelAwarded } from "@/components/business/CenterPanelAwarded";
import { JobItem } from "@/components/business/JobItemListing";
import { RightPanel } from "@/components/business/RightPanel";
import { useBidStats } from "@/hooks/useBidStats";
import { useBusinessJobAwarded } from "@/hooks/useJob";
import { JobDetailItem } from "@/types/jobs";
import React, { useEffect, useState } from "react";

const StatCard: React.FC<{
  title: string;
  count: number;
  subText: string;
  highlightColor: string;
}> = ({ title, count, subText, highlightColor }) => (
  <div className="flex-1 min-w-0 p-4 py-2 bg-white rounded-xl w-[250px] border border-gray-200">
    <div className={`text-lg font-semibold  text-gray-900 mb-1`}>{title}</div>
    <p className="text-xs text-gray-500 mb-1">Past 30 days</p>

    <div className="flex justify-between items-center">
      <div className="text-3xl font-bold text-gray-900">{count}</div>
    </div>
  </div>
);

export default function ShortlistedDashboard() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isError, error } = useBusinessJobAwarded(
    page,
    limit
  );
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
              Awarded Jobs
            </h1>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <StatCard
                title="Awarded Jobs"
                count={state?.hired ? state.hired + state?.completed : 0}
                subText="View All 20"
                highlightColor="text-gray-500"
              />
              <StatCard
                title="Completed Jobs"
                count={state?.completed ? state.completed : 0}
                subText="View All 10"
                highlightColor="text-gray-500"
              />
              <StatCard
                title="Ongoing Jobs"
                count={state?.hired ? state.hired : 0}
                subText="View All 10"
                highlightColor="text-gray-500"
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
            <CenterPanelAwarded {...activeJob!} />
          </div>

          <div className="lg:col-span-3">
            {/* <RightPanel {...activeJob!} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
