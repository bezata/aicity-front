"use client";

import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectId: string;
  onDonationComplete?: () => void;
}

type DonationState = "input" | "processing" | "success";

export function DonationModal({
  isOpen,
  onClose,
  projectTitle,
  projectId,
  onDonationComplete,
}: DonationModalProps) {
  const [amount, setAmount] = useState("");
  const [donationState, setDonationState] = useState<DonationState>("input");
  const [progress, setProgress] = useState(0);

  const handleDonate = async () => {
    if (!amount || isNaN(Number(amount))) return;

    setDonationState("processing");
    setProgress(0);

    // Simulate transaction processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + Math.random() * 10);
      });
    }, 200);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    clearInterval(interval);
    setProgress(100);
    setDonationState("success");

    // Reset after success
    setTimeout(() => {
      setDonationState("input");
      setAmount("");
      onDonationComplete?.();
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-purple-500/10 bg-black/90 text-purple-50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-wider">
            Support Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {donationState === "input" && (
            <div className="space-y-4">
              <p className="text-sm text-purple-300/70">
                Enter the amount you would like to donate to support{" "}
                <span className="text-purple-300">{projectTitle}</span>
              </p>

              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
                <Input
                  type="number"
                  placeholder="Amount in CR"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-purple-500/10 bg-black/20 pl-9 text-purple-300 placeholder:text-purple-300/50"
                />
              </div>

              <div className="flex gap-2">
                {[100, 500, 1000].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset.toString())}
                    className={cn(
                      "flex-1 border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200",
                      amount === preset.toString() &&
                        "border-purple-500 bg-purple-500/20"
                    )}
                  >
                    {preset} CR
                  </Button>
                ))}
              </div>

              <Button
                onClick={handleDonate}
                disabled={!amount || isNaN(Number(amount))}
                className="w-full gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 disabled:opacity-50"
              >
                <DollarSign className="h-4 w-4" />
                Donate
              </Button>
            </div>
          )}

          {donationState === "processing" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              </div>
              <p className="text-center text-sm text-purple-300/70">
                Processing your donation...
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-300/70">
                    Transaction Progress
                  </span>
                  <span className="text-purple-300">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-purple-500/10">
                  <div
                    className="absolute inset-y-0 left-0 bg-purple-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 animate-pulse bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {donationState === "success" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="rounded-full border border-green-500/20 bg-green-500/10 p-2">
                  <Check className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-medium text-green-300">
                  Donation Successful!
                </p>
                <p className="text-sm text-purple-300/70">
                  Thank you for supporting this project
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
