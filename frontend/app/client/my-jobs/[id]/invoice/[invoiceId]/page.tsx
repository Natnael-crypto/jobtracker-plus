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

/* ------------------ CLIENT INFO ------------------ */
const ClientInfo: React.FC<{ invoice: GetInvoiceResponse }> = ({ invoice }) => (
  <section className="flex flex-col sm:flex-row border-b border-gray-200 pb-6 mb-8 text-gray-700 gap-6">
    <div className="sm:w-1/2">
      <p className="text-sm font-semibold mb-2">Address</p>
      <p className="text-sm leading-relaxed">
        {invoice?.invoice?.street} <br />
        {invoice?.invoice?.city} <br />
        {invoice?.invoice?.country}
      </p>
    </div>
    <div className="sm:w-1/2 sm:pl-4 sm:border-l border-gray-200">
      <p className="text-sm font-semibold mb-2">Contact Detail</p>
      <p className="text-sm leading-relaxed">
        {invoice?.invoice?.phone} <br />
        {invoice?.invoice?.email}
      </p>
    </div>
  </section>
);

/* ------------------ SERVICE TABLE ------------------ */
const ServiceTable: React.FC<{ invoice: GetInvoiceResponse }> = ({
  invoice,
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

      {invoice?.line_items?.map((item, index) => (
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
  const quotId = params.invoiceId as string;

  const { data: invoice, isLoading } = useGetInvoiceByID(quotId);
  const { mutate: updateInvoice } = useUpdateInvoice();

  if (isLoading) return <div className="p-6 text-gray-500">Loading...</div>;

  const handlePaid = (quotId: string, status: InvoiceStatus) => {
    updateInvoice({ id: quotId, payload: { status } });
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex justify-center ">
      <div className="w-full max-w-5xl">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <a
            href="/business/shortlisted"
            className="text-sm font-medium text-green-700 hover:text-green-800"
          >
            ← Go back
          </a>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span>Invoice</span>
              {invoice?.invoice ? (
                (() => {
                  const { status, due_date } = invoice.invoice;
                  const now = new Date();
                  const dueDate = new Date(due_date);

                  if (status === "paid")
                    return (
                      <span className="text-green-700 font-semibold">Paid</span>
                    );
                  if (now > dueDate)
                    return (
                      <span className="text-red-700 font-semibold">
                        Overdue
                      </span>
                    );
                  return (
                    <span className="text-blue-700 font-semibold">
                      In Progress
                    </span>
                  );
                })()
              ) : (
                <span className="text-gray-500">Loading...</span>
              )}
            </h1>
          </div>
        </div>

        {/* CARD */}
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
              Invoice for {invoice?.invoice.job_title ?? ""}
            </h1>
            {invoice?.invoice.logo_url && (
              <div className="bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center w-14 h-14">
                <img
                  src={invoice.invoice.logo_url}
                  alt="Logo"
                  className="w-12 h-12 rounded-full border border-gray-200 object-cover"
                />
              </div>
            )}
          </div>

          {/* SECTIONS */}
          <ClientInfo invoice={invoice!} />
          <ServiceTable invoice={invoice!} />
          <QuoteNotesAndSummary invoice={invoice!} />

          {/* PAYMENT METHOD */}
          <h1 className="my-3 text-lg font-bold text-gray-900">
            Payment Method
          </h1>
          <div className="text-sm font-medium grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <p className="mb-1">Account Holder</p>
              <p className="text-gray-500">
                {invoice?.invoice.bank_account_name}
              </p>
            </div>
            <div>
              <p className="mb-1">Account Number</p>
              <p className="text-gray-500">
                {invoice?.invoice.bank_account_number}
              </p>
            </div>
            <div>
              <p className="mb-1">Bank Name</p>
              <p className="text-gray-500">{invoice?.invoice.bank_name}</p>
            </div>
            <div>
              <p className="mb-1">Sort Code</p>
              <p className="text-gray-500">{invoice?.invoice.sort_code}</p>
            </div>
            <div>
              <p className="mb-1">Routing Number</p>
              <p className="text-gray-500">
                {invoice?.invoice.bank_routing_number}
              </p>
            </div>
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
