"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetJob } from "@/hooks/useJob";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserAddress } from "@/hooks/userAddress";
import { v4 as uuidv4 } from "uuid";
import { useCreateInvoice } from "@/hooks/useInvoice";

interface LineItem {
  id: string;
  product: string;
  description: string;
  unit: string;
  qty: number;
  rate: number;
}

interface Summary {
  discount: number;
  taxRate: number;
}

interface BankInfo {
  bank_account_name: string;
  bank_account_number: string;
  bank_name: string;
  bank_routing_number: string;
  sort_code: string;
}

const InvoiceForm: React.FC = () => {
  const params = useParams();
  const jobId = params.id as string;

  const { data: jobData } = useGetJob(jobId);
  const { data: profile } = useUserProfile();
  const { data: address } = useUserAddress();

  const { mutateAsync: createInvoice, isPending } = useCreateInvoice();

  const [items, setItems] = useState<LineItem[]>([]);
  const [terms, setTerms] = useState<string>("");
  const [summary, setSummary] = useState<Summary>({
    discount: 0,
    taxRate: 0,
  });
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bank_account_name: "",
    bank_account_number: "",
    bank_name: "",
    bank_routing_number: "",
    sort_code: "",
  });
  const [dueDate, setDueDate] = useState<string>("");

  // ------------------------------
  // Calculations
  // ------------------------------
  const subtotal = items.reduce((acc, i) => acc + i.qty * i.rate, 0);
  const discountAmount = Math.max(0, (subtotal * summary.discount) / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * summary.taxRate;
  const total = taxableAmount + taxAmount;

  const formatCurrency = (val: number) =>
    val.toLocaleString("en-GB", { style: "currency", currency: "GBP" });

  // ------------------------------
  // Item Management
  // ------------------------------
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: uuidv4(), product: "", description: "", unit: "", qty: 1, rate: 1 },
    ]);
  };

  const updateItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "qty" || field === "rate" ? Number(value) : value,
            }
          : item
      )
    );
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  // ------------------------------
  // Submit Handler
  // ------------------------------
  const handleSubmit = async () => {
    try {
      const payload = {
        job_id: jobId,
        discount: summary.discount,
        tax: summary.taxRate,
        terms_and_conditions: terms,
        total,
        street: address?.street,
        city: address?.city,
        state: address?.state,
        country: address?.country,
        phone: profile?.phone_number,
        email: profile?.id,
        logo_url: profile?.image_url ?? "",
        job_title: jobData?.headline ?? "",
        due_date: dueDate,
        bank_account_name: bankInfo.bank_account_name,
        bank_account_number: bankInfo.bank_account_number,
        bank_name: bankInfo.bank_name,
        bank_routing_number: bankInfo.bank_routing_number,
        sort_code: bankInfo.sort_code,
        line_items: items.map((item) => ({
          type: "Invoice" as "Invoice",
          service: item.product,
          quantity: item.qty,
          rate: item.rate,
          total: item.qty * item.rate,
          unit: Number(item.unit) || 1,
          description: item.description,
        })),
      };

      await createInvoice(payload);
      window.location.href = "/business/invoices";
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  // ------------------------------
  // JSX
  // ------------------------------
  return (
    <div className="min-h-screen p-6 sm:p-10 md:p-12 flex justify-center">
      <Card className="w-full p-8 border border-gray-200 shadow-none">
        <header className="flex justify-between items-start mb-10">
          <h1 className="text-xl font-bold text-gray-900">
            Invoice for {jobData?.headline ?? "Loading..."}
          </h1>
          <img
            src={profile?.image_url ?? ""}
            alt="Profile"
            className="w-14 h-14 rounded-full border border-gray-200 bg-gray-100"
          />
        </header>

        {/* Address Section */}
        <section className="flex border-b border-gray-200 pb-6 mb-8 text-gray-700">
          <div className="w-1/2 pr-4">
            <p className="text-sm font-semibold mb-2">Address</p>
            <p className="text-sm leading-relaxed">
              {address?.street} <br />
              {address?.city}, {address?.state} <br />
              {address?.country}
            </p>
          </div>
          <div className="w-1/2 pl-4 border-l border-gray-200">
            <p className="text-sm font-semibold mb-2">Contact</p>
            <p className="text-sm leading-relaxed">
              {profile?.phone_number} <br />
              {profile?.id}
            </p>
          </div>
        </section>

        {/* Line Items */}
        <section>
          <div className="grid grid-cols-12 gap-3 text-xs font-semibold uppercase text-gray-500 border-b border-gray-300 pb-2 mb-4">
            <div className="col-span-4 lg:col-span-6 text-left">
              Product/Service
            </div>
            <div className="col-span-2 text-left hidden lg:block">Unit</div>
            <div className="col-span-2 lg:col-span-1 text-left">Qty</div>
            <div className="col-span-2 lg:col-span-1 text-left">Rate</div>
            <div className="col-span-4 lg:col-span-2 text-left">Total</div>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-3 mb-4 items-start text-gray-900"
            >
              <div className="col-span-12 lg:col-span-6 space-y-2">
                <Input
                  placeholder="Product / Service"
                  value={item.product}
                  onChange={(e) =>
                    updateItem(item.id, "product", e.target.value)
                  }
                />
                <Textarea
                  placeholder="Description"
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, "description", e.target.value)
                  }
                />
              </div>

              <div className="col-span-6 lg:col-span-2">
                <Input
                  placeholder="Unit"
                  value={item.unit}
                  onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                />
              </div>

              <div className="col-span-6 lg:col-span-1">
                <Input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                  className="text-center"
                />
              </div>

              <div className="col-span-6 lg:col-span-1">
                <Input
                  type="number"
                  min={1}
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                  className="text-center"
                />
              </div>

              <div className="col-span-6 lg:col-span-2 flex items-center space-x-2">
                <Input
                  readOnly
                  value={formatCurrency(item.qty * item.rate)}
                  className="text-right font-medium bg-gray-50 cursor-default"
                />
                <Trash2
                  className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer"
                  onClick={() => removeItem(item.id)}
                />
              </div>
            </div>
          ))}

          <Button
            onClick={addItem}
            variant="outline"
            size="sm"
            className="mt-2 flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" /> <span>Add Line Item</span>
          </Button>
        </section>

        {/* Summary */}
        <div className="border-b border-gray-200 my-8"></div>
        <section className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-7/12">
            <p className="text-sm font-medium text-gray-800 mb-2">
              Terms and Conditions
            </p>
            <Textarea
              rows={5}
              placeholder="Enter terms and conditions..."
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="w-full lg:w-5/12 pt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Discount</span>
              <Input
                type="number"
                min={0}
                value={summary.discount}
                onChange={(e) =>
                  setSummary({ ...summary, discount: Number(e.target.value) })
                }
                className="w-24 text-right"
              />
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>Discount Amount</span>
              <span className="font-medium text-red-500">
                -{formatCurrency(discountAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tax Rate (%)</span>
              <Input
                type="number"
                min={0}
                value={summary.taxRate * 100}
                onChange={(e) =>
                  setSummary({
                    ...summary,
                    taxRate: Number(e.target.value) / 100,
                  })
                }
                className="w-24 text-right"
              />
            </div>

            <div className="flex justify-between">
              <span className="text-sm font-medium">Tax Amount</span>
              <span className="font-semibold">{formatCurrency(taxAmount)}</span>
            </div>

            <div className="pt-2 border-t border-gray-300 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </section>

        {/* Bank Info */}
        <h1 className="mt-6 text-lg font-bold text-gray-900">
          Payment Method (optional)
        </h1>
        <div className="text-sm font-medium grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="mb-1">Bank Account Name</p>
            <Input
              value={bankInfo.bank_account_name}
              placeholder="John Doe"
              onChange={(e) =>
                setBankInfo({ ...bankInfo, bank_account_name: e.target.value })
              }
            />
          </div>
          <div>
            <p className="mb-1">Account Number</p>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 8-digit account number"
              maxLength={8}
              value={bankInfo.bank_account_number}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                if (value.length <= 8) {
                  setBankInfo({
                    ...bankInfo,
                    bank_account_number: value,
                  });
                }
              }}
            />
            {bankInfo.bank_account_number.length > 0 &&
              bankInfo.bank_account_number.length < 8 && (
                <p className="text-red-500 text-sm mt-1">
                  Account number must be 8 digits.
                </p>
              )}
          </div>
          <div>
            <p className="mb-1">Bank Name</p>
            <Input
              value={bankInfo.bank_name}
              placeholder="Enter bank name"
              onChange={(e) =>
                setBankInfo({ ...bankInfo, bank_name: e.target.value })
              }
            />
          </div>
          <div>
            <p className="mb-1">Sort Code</p>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 6-digit sort code"
              maxLength={6}
              value={bankInfo.sort_code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                if (value.length <= 6) {
                  setBankInfo({
                    ...bankInfo,
                    sort_code: value,
                  });
                }
              }}
            />
            {bankInfo.sort_code.length > 0 && bankInfo.sort_code.length < 6 && (
              <p className="text-red-500 text-sm mt-1">
                Sort code must be 6 digits.
              </p>
            )}
          </div>

          <div>
            <p className="mb-1">Routing Number</p>
            <Input
              value={bankInfo.bank_routing_number}
              onChange={(e) =>
                setBankInfo({
                  ...bankInfo,
                  bank_routing_number: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Due Date */}
        <h1 className="mt-6 text-lg font-bold text-gray-900">Due Date</h1>
        <Input
          type="date"
          onChange={(e) => setDueDate(new Date(e.target.value).toISOString())}
          className="mt-2 w-64"
        />

        <div className="flex justify-end mt-12">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isPending}
            className="shadow-md shadow-green-300/50 bg-green-500 hover:bg-green-600"
          >
            {isPending ? "Sending..." : "Send Invoice"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceForm;
