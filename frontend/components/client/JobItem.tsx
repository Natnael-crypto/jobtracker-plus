"use client";

import { useJobBidStats } from "@/hooks/useBidStats";
import { useEffect, useState } from "react";
import ReviewModal from "./ReviewModal";

interface JobItemProps {
  id: string;
  title: string;
  postedTime: string;
  metrics: {
    interests: number;
    shortlisted: number;
    bidRequests: string;
    referralProcessed: string;
  };
  status: "unsent" | "hired";
  category?: string;
}

interface MetricPillProps {
  label: string;
  count: number;
  color?: "green" | "yellow";
  jobID: string;
}

const MetricPill: React.FC<MetricPillProps> = ({
  label,
  count,
  color = "green",
  jobID,
}) => (
  <div
    className={`flex items-center gap-1 px-4 py-1.5 border rounded-full text-sm font-medium 
      ${
        color === "green"
          ? "text-green-600 border-green-200 bg-green-50"
          : "text-yellow-600 border-yellow-200 bg-yellow-50"
      }
    `}
  >
    <span className="font-semibold">{count}</span>
    <a
      href={"/client/my-jobs/" + jobID}
      className="underline hover:text-green-700"
    >
      {label}
    </a>
  </div>
);

export const JobItem: React.FC<JobItemProps> = ({
  id,
  title,
  postedTime,
  metrics,
  status: initialStatus,
  category,
}) => {
  const { data, isLoading, isError } = useJobBidStats(id);

  // Handle loading/error states for resilience
  if (isLoading) {
    return (
      <div className="p-6 bg-white border rounded shadow-sm mb-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded shadow-sm mb-5 text-red-700">
        Failed to load job stats.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm mb-5 items-center">
      {/* Job Info Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          <a
            href={`/client/my-jobs/${id}`}
            className="hover:text-blue-700 transition-colors duration-150"
          >
            {title}
          </a>
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <img src="/30.svg" alt="posted icon" className="mr-2 w-4 h-4" />
          <span>Posted {postedTime}</span>
        </div>
      </div>

      {/* Job Metrics Section */}
      <div className="flex flex-wrap gap-2 justify-start md:justify-center">
        <MetricPill
          label="Interests"
          count={data?.total ?? 0}
          color="green"
          jobID={id}
        />
        <MetricPill
          label="Shortlisted"
          count={data?.shortlisted ?? 0}
          color="yellow"
          jobID={id}
        />
        <MetricPill
          label="Invites"
          count={
            (data?.invites ?? 0) + (data?.accepted ?? 0) + (data?.hired ?? 0)
          }
          color="yellow"
          jobID={id}
        />
      </div>

      {/* Job Action Section */}
      <div className="flex justify-start md:justify-end items-center gap-4 text-sm font-medium">
        {(data?.hired ?? 0) + (data?.completed ?? 0) === 0 ? (
          <a
            href={`/trade/invite/${id}${
              category ? `?service=${category}` : ""
            }`}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
          >
            Send Invite
          </a>
        ) : (
          <>
            <a
              href={`/client/my-jobs/${id}`}
              className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
            >
              Hired
            </a>

            <a
              href={`/client/my-jobs/${id}`}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
            >
              See Invoice
            </a>
          </>
        )}
      </div>
    </div>
  );
};
