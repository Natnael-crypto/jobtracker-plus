"use client";

import {
  useDeleteQuotation,
  useGetQuotationBusiness,
} from "@/hooks/useQuotations";
import { FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface QuotationBusinessProps {
  id: string;
}

export default function QuotationBusiness({ id }: QuotationBusinessProps) {
  const { data: quotations } = useGetQuotationBusiness(id);
  const { mutate: deleteQuotation, isPending } = useDeleteQuotation();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = (quotId: string) => {
    setDeleting(quotId);
    deleteQuotation(quotId, {
      onSettled: () => {
        setDeleting(null);
        window.location.reload();
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Create New Quotation */}
      <Link
        href={`/business/quotation/${id}`}
        className="flex items-center justify-between border border-gray-200 rounded-xl py-4 px-4 hover:bg-gray-50 transition-colors"
      >
        <p className="text-gray-700 text-lg font-medium">Create a quotation</p>
        <Plus className="bg-green-500 text-white p-2 rounded-full w-10 h-10 shadow-sm hover:bg-green-600 transition" />
      </Link>

      {/* Existing Quotations */}
      <div className="space-y-3">
        {quotations && quotations.length > 0 ? (
          quotations.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between border border-gray-100 hover:border-gray-300 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-150"
            >
              <Link
                href={`/business/quotation/quot/${q.id}`}
                className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 flex-1"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full">
                  <img src="/receipt.svg" alt="" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">
                    Quote ID: {q.id}
                  </p>
                  <p className="text-gray-500 text-sm">{q.job_title}</p>
                </div>
              </Link>

              <button
                onClick={() => handleDelete(q.id)}
                disabled={deleting === q.id}
                className="ml-4 text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                title="Delete Invoice"
              >
                {deleting === q.id ? (
                  <svg
                    className="animate-spin h-5 w-5 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">
            No quotations found for this job.
          </p>
        )}
      </div>
    </div>
  );
}
