"use client";

import { Textarea } from "@/components/ui/textarea";
import { useGetQuotationByID, useUpdateQuotation } from "@/hooks/useQuotations";
import { GetQuotationResponse, QuotationStatus } from "@/types/quotations";
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

/* ------------------ CLIENT INFO ------------------ */
const ClientInfo: React.FC<{ quotation: GetQuotationResponse }> = ({
  quotation,
}) => (
  <section className="flex flex-col sm:flex-row border-b border-gray-200 pb-6 mb-8 gap-6 text-gray-700">
    <div className="sm:w-1/2">
      <p className="text-sm font-semibold mb-2">Address</p>
      <p className="text-sm leading-relaxed">
        {quotation?.quotation?.street} <br />
        {quotation?.quotation?.city} <br />
        {quotation?.quotation?.country}
      </p>
    </div>
    <div className="sm:w-1/2 sm:pl-4 sm:border-l border-gray-200">
      <p className="text-sm font-semibold mb-2">Contact Detail</p>
      <p className="text-sm leading-relaxed">
        {quotation?.quotation?.phone} <br />
        {quotation?.quotation?.email}
      </p>
    </div>
  </section>
);

/* ------------------ SERVICE TABLE ------------------ */
const ServiceTable: React.FC<{ quotation: GetQuotationResponse }> = ({
  quotation,
}) => (
  <div className="pt-6 overflow-x-auto">
    <div className="min-w-[600px]">
      <div className="grid grid-cols-6 lg:grid-cols-9 pb-3 text-xs sm:text-sm font-semibold text-gray-800 border-b border-gray-200">
        <div className="col-span-3 lg:col-span-4">Product/Service</div>
        <div className="col-span-1 text-center">Unit</div>
        <div className="col-span-1 text-center">Qty</div>
        <div className="col-span-1 text-right lg:text-center">Rate</div>
        <div className="col-span-1 text-right">Total</div>
      </div>

      {quotation?.line_items?.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-6 lg:grid-cols-9 py-4 border-b border-gray-200 items-start text-xs sm:text-sm"
        >
          <div className="col-span-3 lg:col-span-4 pr-4">
            <p className="font-medium text-gray-800">{item.service}</p>
            <p className="text-gray-500 mt-1">{item.description}</p>
          </div>
          <div className="col-span-1 text-center text-gray-700">
            {item.unit}
          </div>
          <div className="col-span-1 text-center text-gray-700">
            {item.quantity}
          </div>
          <div className="col-span-1 text-right lg:text-center text-gray-700">
            {formatCurrency(item.rate ?? 0)}
          </div>
          <div className="col-span-1 text-right font-semibold text-gray-800">
            {formatCurrency(item.total ?? 0)}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ------------------ NOTES AND SUMMARY ------------------ */
const QuoteNotesAndSummary: React.FC<{ quotation: GetQuotationResponse }> = ({
  quotation,
}) => {
  const SummaryRow: React.FC<{
    label: string;
    value: number;
    isBold?: boolean;
    isGreen?: boolean;
  }> = ({ label, value, isBold = false, isGreen = false }) => (
    <div
      className={`flex justify-between py-2 ${
        isBold
          ? "border-t border-gray-300 pt-3 text-lg font-bold"
          : "text-sm sm:text-base"
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

  const subTotal = quotation?.line_items.reduce(
    (acc, item) => acc + (item.total ?? 0),
    0
  );
  const discounts = quotation?.quotation.discount ?? 0;
  const taxRate = quotation?.quotation.tax ?? 0;
  const taxAmount = subTotal * taxRate;
  const finalTotal = subTotal - discounts + taxAmount;
  const terms = quotation?.quotation.terms_and_conditions ?? "";

  return (
    <div className="flex flex-col lg:flex-row pt-10 pb-8 gap-8">
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

      <div className="w-full lg:w-80">
        <div className="space-y-1">
          <SummaryRow label="Subtotal" value={subTotal} />
          <SummaryRow
            label="Discounts"
            value={discounts}
            isGreen={discounts === 0}
          />
          <SummaryRow label="Tax" value={taxAmount} isGreen={true} />
        </div>

        <SummaryRow label="Total" value={finalTotal} isBold={true} />
      </div>
    </div>
  );
};

/* ------------------ MAIN PAGE ------------------ */
export const QuotationDetail: React.FC = () => {
  const params = useParams();
  const quotId = params.quotId as string;

  const { data: quotation, isLoading } = useGetQuotationByID(quotId);
  const { mutate: updateQuotation } = useUpdateQuotation();

  if (isLoading) return <div className="p-6 text-gray-500">Loading...</div>;

  const handleAccept = () => {
    if (!quotation?.quotation.id) return;
    updateQuotation({
      id: quotation.quotation.id,
      payload: { status: "accepted" },
    });
  };

  const handleReject = () => {
    if (!quotation?.quotation.id) return;
    updateQuotation({
      id: quotation.quotation.id,
      payload: { status: "rejected" },
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-5xl">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <a
            href={`/client/my-jobs/${quotation?.quotation.job_id}`}
            className="text-sm font-medium text-green-700 hover:text-green-800"
          >
            ← Go back to My Jobs
          </a>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            Quotation
            {quotation?.quotation.status === "in_progress" ? (
              <span className="text-blue-700 font-semibold">In Progress</span>
            ) : quotation?.quotation.status === "accepted" ? (
              <span className="text-green-700 font-semibold">Accepted</span>
            ) : (
              <span className="text-red-700 font-semibold">Rejected</span>
            )}
          </h1>
        </div>

        {/* CARD */}
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
              Quote for {quotation?.quotation.job_title ?? ""}
            </h1>
            {quotation?.quotation.logo_url && (
              <div className="bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center w-14 h-14">
                <img
                  src={quotation.quotation.logo_url}
                  alt="Logo"
                  className="w-12 h-12 rounded-full border border-gray-200 object-cover"
                />
              </div>
            )}
          </div>

          {/* SECTIONS */}
          <ClientInfo quotation={quotation!} />
          <ServiceTable quotation={quotation!} />
          <QuoteNotesAndSummary quotation={quotation!} />

          {/* ACTION BUTTONS */}
          {quotation?.quotation.status === "in_progress" && (
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;
