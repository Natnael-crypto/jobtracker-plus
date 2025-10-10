"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useInvoices } from "@/hooks/useInvoice";
import { Invoice } from "@/types/invoice";

const PaymentStatusBadge: React.FC<{ status: Invoice["status"] }> = ({
  status,
}) => {
  let bgColor, textColor, borderColor;
  switch (status) {
    case "in_progress":
      bgColor = "bg-yellow-100/70";
      textColor = "text-yellow-700";
      borderColor = "border-yellow-200";
      break;
    case "paid":
      bgColor = "bg-green-100/70";
      textColor = "text-green-700";
      borderColor = "border-green-200";
      break;
    case "overdue":
      bgColor = "bg-red-100/70";
      textColor = "text-red-700";
      borderColor = "border-red-200";
      break;
  }

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border ${bgColor} ${textColor} ${borderColor}`}
    >
      {status}
      <ChevronDown className="w-3 h-3" />
    </div>
  );
};

const ITEMS_PER_PAGE = 9;

const InvoicePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useInvoices(currentPage, ITEMS_PER_PAGE);

  const invoices = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.total || 0;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isLoading)
    return <div className="p-8 text-gray-600">Loading invoices...</div>;
  if (isError)
    return <div className="p-8 text-red-500">Failed to load invoices.</div>;

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans ">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Invoices</h1>
        </header>

        {/* Table container with horizontal scroll for mobile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-green-50/50">
                <tr className="text-sm font-medium text-gray-500 uppercase">
                  <th className="py-4 px-6 text-left">Invoice ID</th>
                  <th className="py-4 px-6 text-left">Job Title</th>
                  <th className="py-4 px-6 text-left">Created Date</th>
                  <th className="py-4 px-6 text-left">Amount</th>
                  <th className="py-4 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/business/invoices/${invoice.id}`)
                    }
                  >
                    <td className="py-4 px-6 text-sm font-medium text-gray-700">
                      {invoice.id}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {invoice.job_title || "—"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                      £{invoice.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {invoice ? (
                        (() => {
                          const { status, due_date } = invoice;
                          const now = new Date();
                          const dueDate = new Date(due_date);

                          if (status === "paid") {
                            return <PaymentStatusBadge status="paid" />;
                          } else if (now > dueDate) {
                            return <PaymentStatusBadge status="overdue" />;
                          } else {
                            return <PaymentStatusBadge status="in_progress" />;
                          }
                        })()
                      ) : (
                        <span className="text-gray-500">Loading...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="p-4 flex flex-col bg-white hover:bg-gray-50 transition cursor-pointer"
                onClick={() =>
                  (window.location.href = `/business/invoices/${invoice.id}`)
                }
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-sm font-semibold text-gray-800">
                    {invoice.job_title || "Untitled Job"}
                  </h2>
                  {invoice ? (
                    (() => {
                      const { status, due_date } = invoice;
                      const now = new Date();
                      const dueDate = new Date(due_date);

                      if (status === "paid") {
                        return <PaymentStatusBadge status="paid" />;
                      } else if (now > dueDate) {
                        return <PaymentStatusBadge status="overdue" />;
                      } else {
                        return <PaymentStatusBadge status="in_progress" />;
                      }
                    })()
                  ) : (
                    <span className="text-gray-500">Loading...</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-1">
                  Invoice ID: <span className="font-medium">{invoice.id}</span>
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  Created: {new Date(invoice.created_at).toLocaleDateString()}
                </p>
                <p className="text-base font-semibold text-gray-800 mt-2">
                  £{invoice.total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100">
            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of{" "}
              {totalItems}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
