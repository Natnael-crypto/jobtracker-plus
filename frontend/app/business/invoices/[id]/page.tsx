"use client";

import { Textarea } from "@/components/ui/textarea";
import { useGetInvoiceByID, useUpdateInvoice } from "@/hooks/useInvoice";
import { GetInvoiceResponse, InvoiceStatus } from "@/types/invoice";
import { useParams } from "next/navigation";
import React from "react";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatCurrency = (amount: number): string => {
  return currencyFormatter.format(amount).replace("£", "£");
};

const ClientInfo: React.FC<{ invoice: GetInvoiceResponse }> = ({ invoice }) => (
  <section className="flex flex-col sm:flex-row border-b border-gray-200 pb-6 mb-8 text-gray-700 gap-6 sm:gap-0">
    <div className="w-full sm:w-1/2 sm:pr-4">
      <p className="text-sm font-semibold mb-2">Address</p>
      <p className="text-sm leading-relaxed">
        {invoice?.invoice?.street} <br />
        {invoice?.invoice?.city} <br />
        {invoice?.invoice?.country}
      </p>
    </div>
    <div className="w-full sm:w-1/2 sm:pl-4 sm:border-l border-gray-200">
      <p className="text-sm font-semibold mb-2">Contact Detail</p>
      <p className="text-sm leading-relaxed break-words">
        {invoice?.invoice?.phone} <br />
        {invoice?.invoice?.email}
      </p>
    </div>
  </section>
);

const ServiceTable: React.FC<{ invoice: GetInvoiceResponse }> = ({
  invoice,
}) => (
  <div className="pt-6">
    <div className="hidden sm:grid grid-cols-6 lg:grid-cols-9 pb-3 text-sm font-semibold text-gray-800 border-b border-gray-200">
      <div className="col-span-3 lg:col-span-4">Product/Service</div>
      <div className="col-span-1 text-center">Unit</div>
      <div className="col-span-1 text-center">Qty</div>
      <div className="col-span-1 text-right lg:text-center">Rate</div>
      <div className="col-span-1 text-right">Total</div>
    </div>

    {invoice?.line_items.map((item, index) => (
      <div
        key={index}
        className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-9 py-4 border-b border-gray-200 items-start text-sm sm:text-base"
      >
        <div className="col-span-2 sm:col-span-3 lg:col-span-4 pr-4">
          <p className="font-medium text-gray-800">{item.service}</p>
          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
        </div>

        <div className="hidden sm:block col-span-1 text-center text-gray-700">
          {item.unit}
        </div>
        <div className="hidden sm:block col-span-1 text-center text-gray-700">
          {item.quantity}
        </div>
        <div className="hidden sm:block col-span-1 text-right lg:text-center text-gray-700">
          {formatCurrency(item.rate ?? 0)}
        </div>
        <div className="col-span-2 sm:col-span-1 text-right font-semibold text-gray-800 mt-1 sm:mt-0">
          {formatCurrency(item.total ?? 0)}
        </div>
      </div>
    ))}
  </div>
);

const QuoteNotesAndSummary: React.FC<{ invoice: GetInvoiceResponse }> = ({
  invoice,
}) => {
  const SummaryRow: React.FC<{
    label: string;
    value: number;
    isBold?: boolean;
    isGreen?: boolean;
  }> = ({ label, value, isBold = false, isGreen = false }) => (
    <div
      className={`flex justify-between py-2 ${
        isBold ? "border-t border-gray-300 pt-3 text-lg font-bold" : "text-base"
      }`}
    >
      <span className={isBold ? "text-gray-900" : "text-gray-700"}>
        {label}
      </span>
      <span
        className={`text-right ${isBold ? "text-gray-900" : "text-gray-700"} ${
          isGreen ? "text-green-600 font-semibold" : ""
        }`}
      >
        {formatCurrency(value)}
      </span>
    </div>
  );

  const subTotal = invoice?.line_items.reduce(
    (acc, item) => acc + (item.total ?? 0),
    0
  );
  const discounts = invoice?.invoice.discount ?? 0;
  const taxRate = invoice?.invoice.tax ?? 0;
  const taxAmount = subTotal * taxRate;
  const finalTotal = subTotal - discounts + taxAmount;
  const terms = invoice?.invoice.terms_and_conditions ?? "";

  return (
    <div className="flex flex-col lg:flex-row pt-10 pb-8 gap-6">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 mb-2">
          Terms and conditions
        </p>
        <Textarea
          rows={6}
          placeholder="Enter terms and conditions..."
          value={terms}
          className="resize-none w-full"
          readOnly
        />
      </div>

      <div className="w-full lg:w-80 bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
        <SummaryRow label="Subtotal" value={subTotal} />
        <SummaryRow label="Discounts" value={discounts} />
        <SummaryRow label="Tax" value={taxAmount} isGreen />
        <SummaryRow label="Total" value={finalTotal} isBold />
      </div>
    </div>
  );
};

export const QuotationDetail: React.FC = () => {
  const params = useParams();
  const quotId = params.id as string;
  const { data: invoice, isLoading } = useGetInvoiceByID(quotId);
  const { mutate: updateInvoice } = useUpdateInvoice();

  if (isLoading) return <div>Loading...</div>;

  const handlePaid = (quotId: string, status: InvoiceStatus) => {
    updateInvoice({ id: quotId, payload: { status } });
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <a
            href={`/business/shortlisted`}
            className="text-sm font-medium text-green-700 hover:text-green-800"
          >
            ← Go back
          </a>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <span>Invoice</span>
              {invoice && invoice.invoice ? (
                (() => {
                  const { status, due_date } = invoice.invoice;
                  const now = new Date();
                  const dueDate = new Date(due_date);

                  if (status === "paid") {
                    return (
                      <span className="text-green-700 font-semibold">Paid</span>
                    );
                  } else if (now > dueDate) {
                    return (
                      <span className="text-red-700 font-semibold">
                        Overdue
                      </span>
                    );
                  } else {
                    return (
                      <span className="text-blue-700 font-semibold">
                        In Progress
                      </span>
                    );
                  }
                })()
              ) : (
                <span className="text-gray-500">Loading...</span>
              )}
            </h1>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 md:p-10 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
              Invoice for {invoice?.invoice.job_title ?? ""}
            </h1>
            <div className="bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center">
              <img
                src={invoice?.invoice.logo_url ?? ""}
                alt="Logo"
                className="w-14 h-14 rounded-full border border-gray-200 object-cover"
              />
            </div>
          </div>

          <ClientInfo invoice={invoice!} />
          <ServiceTable invoice={invoice!} />
          <QuoteNotesAndSummary invoice={invoice!} />

          <h1 className="my-4 text-lg font-bold text-gray-900">
            Payment Method
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm font-medium">
            {[
              ["Bank Account Holder Name", invoice?.invoice.bank_account_name],
              ["Bank Account Number", invoice?.invoice.bank_account_number],
              ["Bank Name", invoice?.invoice.bank_name],
              ["Sort Code", invoice?.invoice.sort_code],
              ["Bank Routing Number", invoice?.invoice.bank_routing_number],
            ].map(([label, value], i) => (
              <div key={i} className="p-3 border rounded-lg bg-gray-50">
                <p className="text-gray-800 font-semibold">{label}</p>
                <p className="text-gray-500">{value || "—"}</p>
              </div>
            ))}
          </div>

          {/* ACTION BUTTON */}
          {invoice?.invoice.status === "in_progress" && (
            <div className="flex justify-start mt-8">
              <button
                onClick={() => handlePaid(invoice.invoice.id, "paid")}
                className="px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150"
              >
                Mark as Paid
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;
