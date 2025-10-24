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
import { useCreateQuotation } from "@/hooks/useQuotations";
import { v4 as uuidv4 } from "uuid";

interface LineItem {
  id: string;
  product: string;
  description: string;
  unit: string;
  qty: number;
  rate: number;
}

interface Summary {
  discountRate: number; // percentage
  taxRate: number; // percentage
  requiredDepositValue: number;
}

const QuoteForm: React.FC = () => {
  const params = useParams();
  const jobId = params.id as string;

  const { data: jobData } = useGetJob(jobId);
  const { data: profile } = useUserProfile();
  const { data: address } = useUserAddress();
  const { mutateAsync: createQuotation, isPending } = useCreateQuotation();

  const [items, setItems] = useState<LineItem[]>([]);
  const [terms, setTerms] = useState<string>("");
  const [summary, setSummary] = useState<Summary>({
    discountRate: 0,
    taxRate: 0,
    requiredDepositValue: 0,
  });

  // ---- COMPUTATIONS ----
  const subtotal = items.reduce((acc, i) => acc + i.qty * i.rate, 0);
  const discountAmount = Math.max(0, (subtotal * summary.discountRate) / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = Math.max(0, (taxableAmount * summary.taxRate) / 100);
  const total = taxableAmount + taxAmount;

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

  const formatCurrency = (val: number) =>
    val.toLocaleString("en-GB", { style: "currency", currency: "GBP" });

  const handleSubmit = async () => {
    try {
      const payload = {
        job_id: jobId,
        discount: discountAmount, // send real deducted amount
        tax: taxAmount, // send calculated tax amount
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
        line_items: items.map((item) => ({
          type: "Quotation" as const,
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
    <div className="min-h-screen p-4 sm:p-8 flex justify-center">
      <Card className="w-full max-w-5xl p-6 sm:p-10 border border-gray-200 shadow-none">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Quote for {jobData?.headline ?? "Loading..."}
          </h1>
          {profile?.image_url && (
            <div className="bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center w-14 h-14">
              <img
                src={profile.image_url}
                alt="Profile"
                className="w-12 h-12 rounded-full border border-gray-200 object-cover"
              />
            </div>
          )}
        </header>

        {/* ADDRESS & CONTACT */}
        <section className="flex flex-col sm:flex-row border-b border-gray-200 pb-6 mb-8 gap-6 text-gray-700">
          <div className="sm:w-1/2">
            <p className="text-sm font-semibold mb-2">Address</p>
            <p className="text-sm leading-relaxed">
              {address?.street} <br />
              {address?.city} <br />
              {address?.country}
            </p>
          </div>
          <div className="sm:w-1/2 sm:pl-4 sm:border-l border-gray-200">
            <p className="text-sm font-semibold mb-2">Contact</p>
            <p className="text-sm leading-relaxed">
              {profile?.phone_number} <br />
              {profile?.id}
            </p>
          </div>
        </section>

        {/* LINE ITEMS */}
        <section className="overflow-x-auto">
          <div className="grid grid-cols-12 gap-3 text-xs sm:text-sm font-semibold uppercase text-gray-500 border-b border-gray-300 pb-2 mb-4 min-w-[600px]">
            <div className="col-span-6 lg:col-span-6">Product/Service</div>
            <div className="col-span-2 hidden lg:block">Unit</div>
            <div className="col-span-2 lg:col-span-1">Qty</div>
            <div className="col-span-2 lg:col-span-1">Rate</div>
            <div className="col-span-6 lg:col-span-2">Total</div>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-3 mb-4 items-start min-w-[600px]"
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
                  value={formatCurrency(item.qty * item.rate)}
                  readOnly
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
            <Plus className="h-4 w-4" />
            <span>Add Line Item</span>
          </Button>
        </section>

        {/* SUMMARY & TERMS */}
        <div className="border-b border-gray-200 my-8"></div>
        <section className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800 mb-2">
              Terms & Conditions
            </p>
            <Textarea
              rows={5}
              placeholder="Enter terms and conditions..."
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="resize-none w-full"
            />
          </div>

          <div className="w-full lg:w-80 pt-4 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>

            {/* Discount Section */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Discount (%)</span>
              <Input
                type="number"
                min={0}
                max={100}
                value={summary.discountRate}
                onChange={(e) =>
                  setSummary({
                    ...summary,
                    discountRate: Math.max(0, Number(e.target.value)),
                  })
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

            {/* Tax Section */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tax Rate (%)</span>
              <Input
                type="number"
                min={0}
                value={summary.taxRate}
                onChange={(e) =>
                  setSummary({
                    ...summary,
                    taxRate: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-24 text-right"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax Amount</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>

            <div className="pt-2 border-t border-gray-300 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </section>

        {/* SUBMIT */}
        <div className="flex justify-end mt-10">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-green-500 hover:bg-green-600 shadow-md shadow-green-300/50"
          >
            {isPending ? "Sending..." : "Send Quotation"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuoteForm;
