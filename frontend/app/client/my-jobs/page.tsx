"use client";

import React, { useEffect, useState } from "react";
import { useJobs, useMyJobsStat } from "@/hooks/useJob";
import { JobItem } from "@/components/client/JobItem";
import { Job } from "@/types/jobs";

interface StatCardProps {
  title: string;
  value: number | string;
  subtext: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext }) => (
  <div className="flex-1 min-w-[150px] sm:min-w-[200px] p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
    <p className="text-gray-800 text-sm font-semibold uppercase tracking-wide mb-1">
      {title}
    </p>
    <p className="text-gray-500 text-xs mb-2">{subtext}</p>
    <div className="text-3xl sm:text-4xl font-bold text-gray-900">{value}</div>
  </div>
);

const Pagination: React.FC<{
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages = 1, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, currentPage - 3),
    Math.min(totalPages, currentPage + 2)
  );

  return (
    <div className="flex items-center justify-center pt-6 sm:pt-10 flex-wrap gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 sm:p-3 text-gray-500 disabled:text-gray-300 hover:text-gray-800 transition"
      >
        ←
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-sm transition ${
            page === currentPage
              ? "bg-green-500 text-white font-semibold shadow"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 sm:p-3 text-gray-500 disabled:text-gray-300 hover:text-gray-800 transition"
      >
        →
      </button>
    </div>
  );
};

export default function PostedJobsPage() {
  const [total_jobs, setTotalJobs] = useState({
    title: "Total Jobs",
    value: "0",
    subtext: "Past 30 days",
  });
  const [hired, setHired] = useState({
    title: "Hired",
    value: "0",
    subtext: "Past 30 days",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const {
    jobs,
    meta,
    loading,
    error,
    refetch: fetchJobs,
  } = useJobs(currentPage, limit);
  const { data, isLoading, isError, refetch } = useMyJobsStat();

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setTotalJobs({
        title: "Total Jobs",
        value: data.total_jobs,
        subtext: "Past 30 days",
      });
      setHired({
        title: "Hired",
        value: data.hired,
        subtext: "Past 30 days",
      });
    }
  }, [data, isLoading, isError]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= meta.totalPages) {
      setCurrentPage(page);
      refetch();
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-12 bg-gray-50 font-sans">
      <main className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-6 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Jobs
          </h1>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <StatCard {...total_jobs} />
            <StatCard {...hired} />
          </div>
        </div>

        {/* Job Listings */}
        {loading && (
          <p className="text-gray-600 text-center py-6">Loading jobs...</p>
        )}
        {error && <p className="text-red-600 text-center py-6">{error}</p>}

        <div className="space-y-5">
          {jobs &&
            jobs.map((job: Job) => (
              <JobItem
                key={job.id}
                id={job.id}
                title={job.headline || job.service_category}
                postedTime={new Date(job.created_at).toLocaleString()}
                category={job.service_category}
                metrics={{
                  interests: 0,
                  shortlisted: 0,
                  bidRequests: "0",
                  referralProcessed: "0",
                }}
                status={job.status as "unsent" | "hired"}
              />
            ))}
        </div>

        {/* Pagination */}
        {jobs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
}
