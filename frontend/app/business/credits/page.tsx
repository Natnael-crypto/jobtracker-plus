"use client";

import React, { useState, useMemo } from "react";
import { useUserCredit } from "@/hooks/useCredit";
import { CreditModal } from "@/components/business/CreditBuyModal";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const PayoutsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useUserCredit(
    currentPage,
    ITEMS_PER_PAGE
  );

  const totalItems = data?.total || 0;
  const creditHistory = data?.creditHistory || [];
  const credit = data?.credit;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Failed to load credit data.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 lg:p-12 font-inter">
      <header className="flex justify-between items-start mb-8 lg:mb-12 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Credit History
          </h1>
          <p className="text-gray-500 text-base">
            <strong>{credit?.available_credits ?? 0}</strong> Credits available
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-800 text-white font-semibold text-sm rounded-lg shadow-lg hover:bg-gray-900 transition duration-150 transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Buy Credits</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-7xl mx-auto border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-[#F7FCFA] text-left text-sm font-medium text-gray-500">
                <th scope="col" className="px-6 py-4">
                  Credit Change
                </th>
                <th scope="col" className="px-6 py-4">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {creditHistory.map((history) => (
                <tr
                  key={history.id}
                  className="hover:bg-gray-50 transition duration-75"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {history.credit_change > 0
                      ? `+${history.credit_change}`
                      : history.credit_change}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(history.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t text-sm text-gray-500">
          <p>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems}
          </p>

          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <CreditModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default PayoutsTable;
