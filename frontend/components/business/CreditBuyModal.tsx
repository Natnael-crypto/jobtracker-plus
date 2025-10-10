"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { X } from "lucide-react";
import { useBuyCredits } from "@/hooks/useCredit";

interface CreditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreditModal: React.FC<CreditModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [amount, setAmount] = useState<number | "">("");
  const { mutate: buy, isPending } = useBuyCredits();

  const handleBuy = () => {
    if (!amount || amount <= 0) return;
    buy({ amount: Number(amount) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogClose asChild>
          <button
            className="absolute right-4 top-4 rounded-md opacity-70 transition hover:opacity-100 focus:outline-none"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogClose>

        <DialogHeader>
          <DialogTitle>Buy Credits</DialogTitle>
          <DialogDescription>
            Add credits to your account. 1 credit = £1.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="credit-amount">Amount</Label>
            <Input
              id="credit-amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setAmount(isNaN(val) ? "" : val);
              }}
              placeholder="Enter credits (min 1)"
            />
          </div>
          {amount && amount > 0 && (
            <p className="text-sm text-muted-foreground">
              You will be charged <span className="font-medium">£{amount}</span>
              .
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleBuy}
            disabled={!amount || amount <= 0 || isPending}
          >
            {isPending ? "Redirecting..." : "Buy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
