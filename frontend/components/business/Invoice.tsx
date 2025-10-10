"use client";

import { useDeleteInvoice, useGetInvoiceBusiness } from "@/hooks/useInvoice";
import { Plus, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface InvoiceBusinessProps {
  id: string;
}

export default function InvoiceBusiness({ id }: InvoiceBusinessProps) {
  const { data: invoices } = useGetInvoiceBusiness(id);
  const { mutate: deleteInvoice } = useDeleteInvoice();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = (invoiceId: string) => {
    setDeleting(invoiceId);
    deleteInvoice(invoiceId, {
      onSettled: () => {
        setDeleting(null);
        window.location.reload();
      },
    });
  };

  return (
    <div className="space-y-4">
      <Link
        href={`/business/invoices/add/${id}`}
        className="flex items-center justify-between border border-gray-200 hover:border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-150"
      >
        <div className="flex items-center space-x-3">
          <Plus className="bg-green-500 p-2 rounded-full text-white w-10 h-10" />
          <p className="text-gray-700 text-lg font-medium">Create Invoice</p>
        </div>
      </Link>

      <div className="space-y-3">
        {invoices && invoices.length > 0 ? (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between border border-gray-100 hover:border-gray-300 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-150"
            >
              <Link
                href={`/business/invoices/${invoice.id}`}
                className="flex items-center space-x-3 w-full"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full">
                  <img src="/receipt.svg" alt="" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-800 font-semibold">
                    Invoice ID: {invoice.id}
                  </p>
                  <p className="text-gray-500 text-sm">{invoice.job_title}</p>
                </div>
              </Link>

              <button
                onClick={() => handleDelete(invoice.id)}
                disabled={deleting === invoice.id}
                className="ml-4 text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                title="Delete Invoice"
              >
                {deleting === invoice.id ? (
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
          <p className="text-gray-500 text-sm italic">No invoices found.</p>
        )}
      </div>
    </div>
  );
}
