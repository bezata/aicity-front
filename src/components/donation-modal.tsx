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
import { Check, Loader2, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SystemProgram,
  PublicKey,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import {
  useAppKitConnection,
  type Provider,
} from "@reown/appkit-adapter-solana/react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectId: string;
  onDonationComplete?: () => void;
  project: {
    id: string;
    departmentId: string;
    targetAmount: number;
    currentAmount: number;
    title: string;
    description: string;
    celebrationEvent: {
      title: string;
      description: string;
      duration: number;
      category: string;
      impact: {
        social: number;
        economic: number;
        cultural: number;
        environmental: number;
      };
    };
  };
}

type DonationState = "input" | "processing" | "success" | "error";

const PROGRAM_ID = new PublicKey(
  "FW3YLzmZnyVQXgf7dWPCK1AnkENxCnk65yh2nihKoyYV"
);

export function DonationModal({
  isOpen,
  onClose,
  projectTitle,
  projectId,
  onDonationComplete,
  project,
}: DonationModalProps) {
  const [amount, setAmount] = useState("");
  const [donationState, setDonationState] = useState<DonationState>("input");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");

  const { address } = useAppKitAccount();
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");

  const handleDonate = async () => {
    if (!amount || isNaN(Number(amount))) return;
    if (!connection || !walletProvider?.publicKey || !address) {
      setError("Wallet not connected");
      setDonationState("error");
      return;
    }

    try {
      setDonationState("processing");
      setProgress(20);

      const balance = await connection.getBalance(walletProvider.publicKey);
      if (balance < LAMPORTS_PER_SOL / 100) {
        throw new Error("Not enough SOL in wallet");
      }

      setProgress(40);

      const userPubkey = new PublicKey(address);
      const projectPubkey = new PublicKey(projectId);

      const donateIx = new TransactionInstruction({
        programId: PROGRAM_ID,
        keys: [
          {
            pubkey: userPubkey,
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: projectPubkey,
            isSigner: false,
            isWritable: true,
          },
        ],
        data: Buffer.from([
          0x1,
          ...Array.from(
            new Uint8Array(new Float64Array([Number(amount)]).buffer)
          ),
        ]),
      });

      setProgress(60);

      const tx = new Transaction().add(donateIx);
      tx.feePayer = userPubkey;

      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash = blockhash;

      setProgress(80);

      const sendOptions = {
        skipPreflight: false,
      };

      await walletProvider.signAndSendTransaction(tx, sendOptions);
      const apiKey = process.env.BACKEND_API_KEY;
      // Send backend notification
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/donations/simple`, {
        headers: {
          "Content-Type": "application/json",
          ...(apiKey && { "x-api-key": apiKey }),
        },
        method: "POST",
        body: JSON.stringify({
          userId: address,
          userName: "Reown Donor",
          amount: Number(amount),
          districtId: "central-district",
          departmentId: project.departmentId,
          purpose: project.title,
          category: project.celebrationEvent.category,
          subcategory: {
            [project.celebrationEvent.category]: {
              tradition:
                project.departmentId === "culture" ? "Local Arts" : undefined,
              festival: project.celebrationEvent.title,
              program: project.title,
              community: `${
                project.departmentId.charAt(0).toUpperCase() +
                project.departmentId.slice(1)
              } Community`,
              impact: Object.entries(project.celebrationEvent.impact).sort(
                ([, a], [, b]) => b - a
              )[0][0],
            },
          },
        }),
      });

      setProgress(100);
      setDonationState("success");

      setTimeout(() => {
        setDonationState("input");
        setAmount("");
        onDonationComplete?.();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Donation error:", error);
      setError(error instanceof Error ? error.message : "Transaction failed");
      setDonationState("error");
      setTimeout(() => {
        setDonationState("input");
        setError("");
      }, 3000);
    }
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
                Enter the amount of tokens you would like to donate to support{" "}
                <span className="text-purple-300">{projectTitle}</span>
              </p>

              <div className="relative">
                <Coins className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
                <Input
                  type="number"
                  placeholder="Amount in tokens"
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
                    {preset} tokens
                  </Button>
                ))}
              </div>

              <Button
                onClick={handleDonate}
                disabled={
                  !amount ||
                  isNaN(Number(amount)) ||
                  !connection ||
                  !walletProvider?.publicKey
                }
                className="w-full gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 disabled:opacity-50"
              >
                <Coins className="h-4 w-4" />
                {!address ? "Connect Wallet" : "Donate"}
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

          {donationState === "error" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="font-medium text-red-300">Transaction Failed</p>
                <p className="text-sm text-purple-300/70">{error}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
