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
  requiredDepositValue: number;
}

interface BankInfo {
  bank_account_name: string;
  bank_account_number: string;
  bank_name: string;
  bank_routing_number: string;
  sort_code: string;
}

const QuoteForm: React.FC = () => {
  const params = useParams();
  const jobId = params.id as string;

  const { data: jobData } = useGetJob(jobId);
  const { data: profile } = useUserProfile();
  const { data: address } = useUserAddress();

  const { mutateAsync: createQuotation, isPending } = useCreateInvoice();

  const [items, setItems] = useState<LineItem[]>([]);
  const [terms, setTerms] = useState<string>("");
  const [summary, setSummary] = useState<Summary>({
    discount: 0,
    taxRate: 0,
    requiredDepositValue: 0,
  });
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bank_account_name: "",
    bank_account_number: "",
    bank_name: "",
    bank_routing_number: "",
    sort_code: "",
  });
  const [dueDate, setDueDate] = useState<string>("");

  const subtotal = items.reduce((acc, i) => acc + i.qty * i.rate, 0);
  const taxAmount = (subtotal - summary.discount) * summary.taxRate;
  const total = subtotal - summary.discount + taxAmount;

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: uuidv4(),
        product: "",
        description: "",
        unit: "",
        qty: 1,
        rate: 1,
      },
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

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const formatCurrency = (val: number) =>
    val.toLocaleString("en-GB", { style: "currency", currency: "GBP" });

  const handleSubmit = async () => {
    try {
      const payload = {
        job_id: jobId,
        discount: summary.discount,
        tax: summary.taxRate,
        terms_and_conditions: terms,
        total: 0,
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
          type: "Quotation" as "Quotation",
          service: item.product,
          quantity: item.qty,
          rate: item.rate,
          total: item.qty * item.rate,
          unit: Number(item.unit) || 1,
          description: item.description,
        })),
      };

      await createQuotation(payload);

      window.location.href = "/business/shortlisted";
    } catch (error: any) {
      console.error("Error creating quotation:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-10 md:p-12 font-sans flex justify-center">
      <Card className="w-full p-8 border border-gray-200 shadow-none">
        <header className="flex justify-between items-start mb-10">
          <h1 className="text-xl font-bold text-gray-900">
            Invoice for {jobData?.headline ?? "Loading..."}
          </h1>
          <div className="bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center">
            <img
              src={profile?.image_url ?? ""}
              alt=""
              className="w-14 h-14 rounded-full border border-gray-200"
            />
          </div>
        </header>

        {/* Address and contact info */}
        <section className="flex border-b border-gray-200 pb-6 mb-8 text-gray-700">
          <div className="w-1/2 pr-4">
            <p className="text-sm font-semibold mb-2">Address</p>
            <p className="text-sm leading-relaxed">
              {address?.street} <br />
              {address?.city} <br />
              {address?.country}
            </p>
          </div>
          <div className="w-1/2 pl-4 border-l border-gray-200">
            <p className="text-sm font-semibold mb-2">Contact Detail</p>
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
                  value={item.qty}
                  min={1}
                  onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                  className="text-center"
                />
              </div>

              <div className="col-span-6 lg:col-span-1">
                <Input
                  type="number"
                  value={item.rate}
                  min={1}
                  onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                  className="text-center"
                />
              </div>

              <div className="col-span-6 lg:col-span-2 flex items-center space-x-2">
                <Input
                  value={formatCurrency(item.qty * item.rate)}
                  readOnly
                  min={1}
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
              Terms and conditions
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
                value={summary.discount}
                onChange={(e) =>
                  setSummary({ ...summary, discount: Number(e.target.value) })
                }
                className="w-24 text-right"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tax Rate (%)</span>
              <Input
                type="number"
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

        <h1 className="mt-3 text-lg font-bold text-gray-900">Payment Method</h1>

        <div className="text-sm font-medium flex justify-between">
          <div>
            <p className="mb-1">Bank Account Holder Name</p>
            <Input
              value={bankInfo.bank_account_name}
              onChange={(e) =>
                setBankInfo({ ...bankInfo, bank_account_name: e.target.value })
              }
            />
          </div>

          <div>
            <p className="mb-1">Bank Account Number</p>
            <Input
              value={bankInfo.bank_account_number}
              onChange={(e) =>
                setBankInfo({
                  ...bankInfo,
                  bank_account_number: e.target.value,
                })
              }
            />
          </div>

          <div>
            <p className="mb-1">Bank Name</p>
            <Input
              value={bankInfo.bank_name}
              onChange={(e) =>
                setBankInfo({ ...bankInfo, bank_name: e.target.value })
              }
            />
          </div>

          <div>
            <p className="mb-1">Sort Code</p>
            <Input
              value={bankInfo.sort_code}
              onChange={(e) =>
                setBankInfo({ ...bankInfo, sort_code: e.target.value })
              }
            />
          </div>

          <div>
            <p className="mb-1">Bank Routing Number</p>
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

        <h1>Due date</h1>
        <div className="text-sm font-medium w-100">
          <Input
            value={dueDate}
            onChange={(e) => setDueDate(new Date(e.target.value).toISOString())}
            type="date"
          />
        </div>

        <div className="flex justify-end mt-12">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isPending}
            className="shadow-md shadow-green-300/50 bg-green-500 hover:bg-green-600"
          >
            {isPending ? "Sending..." : "Send"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuoteForm;
