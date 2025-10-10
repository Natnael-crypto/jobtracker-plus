"use client";

import { Textarea } from "@/components/ui/textarea";
import { useGetQuotationByID } from "@/hooks/useQuotations";
import { GetQuotationResponse } from "@/types/quotations";
import { useParams } from "next/navigation";
import React from "react";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatCurrency = (amount: number): string =>
  currencyFormatter.format(amount);

interface ClientInfoProps {
  quotation: GetQuotationResponse;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ quotation }) => (
  <section className="flex flex-col sm:flex-row border-b border-gray-200 pb-6 mb-8 text-gray-700 gap-4">
    <div className="sm:w-1/2">
      <p className="text-sm font-semibold mb-2">Address</p>
      <p className="text-sm leading-relaxed">
        {quotation?.quotation?.street} <br />
        {quotation?.quotation?.city} <br />
        {quotation?.quotation?.country}
      </p>
    </div>
    <div className="sm:w-1/2 sm:pl-4 sm:border-l border-gray-200">
      <p className="text-sm font-semibold mb-2">Contact</p>
      <p className="text-sm leading-relaxed">
        {quotation?.quotation?.phone} <br />
        {quotation?.quotation?.email}
      </p>
    </div>
  </section>
);

interface ServiceTableProps {
  quotation: GetQuotationResponse;
}

const ServiceTable: React.FC<ServiceTableProps> = ({ quotation }) => (
  <div className="overflow-x-auto">
    <div className="min-w-[600px] grid grid-cols-6 lg:grid-cols-9 pb-3 text-sm font-semibold text-gray-800 border-b border-gray-200">
      <div className="col-span-3 lg:col-span-4">Product/Service</div>
      <div className="col-span-1 text-center">Unit</div>
      <div className="col-span-1 text-center">Qty</div>
      <div className="col-span-1 text-right lg:text-center">Rate</div>
      <div className="col-span-1 text-right">Total</div>
    </div>

    {quotation?.line_items?.map((item, idx) => (
      <div
        key={idx}
        className="min-w-[600px] grid grid-cols-6 lg:grid-cols-9 py-4 border-b border-gray-200 items-start"
      >
        <div className="col-span-3 lg:col-span-4 pr-4">
          <p className="font-medium text-gray-800">{item.service}</p>
          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
        </div>
        <div className="col-span-1 text-center text-sm text-gray-700 mt-0.5">
          {item.unit}
        </div>
        <div className="col-span-1 text-center text-sm text-gray-700 mt-0.5">
          {item.quantity}
        </div>
        <div className="col-span-1 text-right lg:text-center text-sm text-gray-700 mt-0.5">
          {formatCurrency(item.rate ?? 0)}
        </div>
        <div className="col-span-1 text-right text-sm font-semibold text-gray-800 mt-0.5">
          {formatCurrency(item.total ?? 0)}
        </div>
      </div>
    ))}
  </div>
);

interface QuoteNotesAndSummaryProps {
  quotation: GetQuotationResponse;
}

const QuoteNotesAndSummary: React.FC<QuoteNotesAndSummaryProps> = ({
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

  const subTotal =
    quotation?.line_items?.reduce((acc, item) => acc + (item.total ?? 0), 0) ??
    0;
  const discounts = quotation?.quotation.discount ?? 0;
  const taxRate = quotation?.quotation.tax ?? 0;
  const taxAmount = subTotal * taxRate;
  const finalTotal = subTotal - discounts + taxAmount;
  const terms = quotation?.quotation.terms_and_conditions ?? "";

  return (
    <div className="flex flex-col lg:flex-row pt-10 pb-8 gap-8">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 mb-2">
          Terms & Conditions
        </p>
        <Textarea
          rows={10}
          placeholder="Enter terms and conditions..."
          value={terms}
          className="resize-none w-full"
          readOnly
        />
      </div>

      <div className="w-full lg:w-96 space-y-1">
        <SummaryRow label="Subtotal" value={subTotal} />
        <SummaryRow
          label="Discounts"
          value={discounts}
          isGreen={discounts === 0}
        />
        <SummaryRow label="Tax" value={taxAmount} isGreen />
        <SummaryRow label="Total" value={finalTotal} isBold />
      </div>
    </div>
  );
};

export const QuotationDetail: React.FC = () => {
  const params = useParams();
  const quotId = params.id as string;

  const { data: quotation, isLoading } = useGetQuotationByID(quotId);

  if (isLoading) return <div>Loading...</div>;

  const statusColor =
    quotation?.quotation.status === "in_progress"
      ? "text-blue-700"
      : quotation?.quotation.status === "accepted"
      ? "text-green-700"
      : "text-red-700";

  return (
    <div className="min-h-screen p-4 sm:p-8 flex justify-center bg-gray-50">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <a
            href="/business/shortlisted"
            className="text-sm font-medium text-green-700 hover:text-green-800 inline-block"
          >
            Go back
          </a>
          <h1 className={`text-xl sm:text-2xl font-bold ${statusColor}`}>
            Quotation: {quotation?.quotation.status.replace("_", " ")}
          </h1>
        </div>

        <div className="bg-white p-6 sm:p-10 md:p-12 rounded border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
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

          <ClientInfo quotation={quotation!} />
          <ServiceTable quotation={quotation!} />
          <QuoteNotesAndSummary quotation={quotation!} />
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;
