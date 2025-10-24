"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRefundRequest } from "@/hooks/useCredit";

interface RefundModalProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RefundModal({
  id,
  open,
  onOpenChange,
}: RefundModalProps) {
  const [reason, setReason] = useState("");

  const { mutate: handleRefund } = useRefundRequest();

  const handleSubmit = () => {
    if (!reason.trim()) return alert("Please provide a reason for refund.");
    handleRefund({ credit_usage_id: id, user_reason: reason });
    onOpenChange(false);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border border-black text-black hover:bg-black hover:text-white transition"
        >
          Request Refund
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white text-black border border-black rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Request Refund
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Please provide a reason for requesting a refund on this credit
            usage.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <label className="block mb-2 font-medium text-sm">
            Reason for refund
          </label>
          <Textarea
            placeholder="Write your reason here..."
            value={reason}
            onChange={(e) => {
              if (e.target.value.length <= 50) {
                setReason(e.target.value);
              }
            }}
            maxLength={50}
            className="border border-black rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={4}
          />
          <div className="text-xs text-gray-500 text-right mt-1">
            {reason.length}/50 characters
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border border-black text-black hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-black text-white hover:bg-gray-800"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
