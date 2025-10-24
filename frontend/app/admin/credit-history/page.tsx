"use client";

import React, { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminCreditHistory } from "@/hooks/useCredit";

export default function AdminCreditHistoryPage() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const { data, isLoading, isError, error, refetch } = useAdminCreditHistory(
    page,
    limit
  );

  const total = data?.total ?? 0;
  const totalPurchased = data?.totalPurchased ?? 0;
  const items = data?.data ?? [];

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePageChange = (value: number) =>
    setPage(() => Math.min(Math.max(1, value), totalPages));
  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1); 
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black mx-auto p-6">
      <div className="">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Credit History</h1>
        </header>

        <div className="flex gap-4 mb-4 items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm">Total entries</span>
            <strong className="text-xl">{total.toLocaleString()}</strong>
          </div>

          <div className="flex flex-col">
            <span className="text-sm">Total purchased</span>
            <strong className="text-xl">
              {totalPurchased.toLocaleString()}
            </strong>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="limit">Rows per page</label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border border-gray-300 p-1 rounded bg-white text-black"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>

            <Button
              onClick={() => refetch()}
              className="border border-gray-300 bg-white text-black hover:bg-black hover:text-white"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {!isLoading && !isError && (
        <Card className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 bg-gray-100 font-semibold text-gray-700 text-sm px-4 py-3 sticky top-0">
            <div>ID</div>
            <div>User Name</div>
            <div>Phone Number</div>
            <div>Credit Change</div>
            <div>Created</div>
          </div>

          {/* Table Rows */}
          <div>
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No jobs found</p>
            ) : (
              items.map((credit, idx) => {
                return (
                  <div
                    key={credit.id}
                    className={`grid grid-cols-5 items-center px-4 py-3 text-sm hover:bg-gray-50 transition cursor-pointer ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="truncate font-medium text-gray-900">
                      {credit.id ?? "Untitled"}
                    </div>

                    <div className="text-gray-600 truncate">
                      {credit.user_profile.first_name}{" "}
                      {credit.user_profile.last_name}
                    </div>

                    <div className="text-gray-700 font-medium">
                      {credit.user_profile.phone_number || "N/A"}
                    </div>

                    <div className="text-gray-700 font-medium">
                      {credit.credit_change || "N/A"}
                    </div>

                    <div className="text-gray-500 text-sm">
                      {new Date(credit.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* Pagination Controls */}
      {items.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={handlePrev}>
            Previous
          </Button>
          <span className="text-gray-600 text-sm">
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={totalPages < limit}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
