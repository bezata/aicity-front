"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Cpu, Network, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemCheck {
  id: string;
  name: string;
  nameJp: string;
  status: "checking" | "complete" | "pending";
  progress: number;
  icon: any;
}

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [systemChecks, setSystemChecks] = useState<SystemCheck[]>([
    {
      id: "neural",
      name: "Neural Network Initialization",
      nameJp: "ニューラルネットワーク初期化",
      status: "pending",
      progress: 0,
      icon: Brain,
    },
    {
      id: "quantum",
      name: "Quantum Core Synchronization",
      nameJp: "量子コア同期",
      status: "pending",
      progress: 0,
      icon: Cpu,
    },
    {
      id: "security",
      name: "Security Protocol Activation",
      nameJp: "セキュリティプロトコル起動",
      status: "pending",
      progress: 0,
      icon: Shield,
    },
    {
      id: "network",
      name: "Network Matrix Configuration",
      nameJp: "ネットワークマトリックス構成",
      status: "pending",
      progress: 0,
      icon: Network,
    },
  ]);

  useEffect(() => {
    // Simulate overall progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + Math.random() * 2);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Simulate system checks
  useEffect(() => {
    const startNextCheck = (index: number) => {
      if (index >= systemChecks.length) return;

      setSystemChecks((prev) =>
        prev.map((check, i) => ({
          ...check,
          status: i === index ? "checking" : check.status,
        }))
      );

      const checkInterval = setInterval(() => {
        setSystemChecks((prev) => {
          const newChecks = [...prev];
          const currentCheck = newChecks[index];

          if (currentCheck.progress >= 100) {
            clearInterval(checkInterval);
            newChecks[index] = {
              ...currentCheck,
              status: "complete",
              progress: 100,
            };
            startNextCheck(index + 1);
            return newChecks;
          }

          newChecks[index] = {
            ...currentCheck,
            progress: currentCheck.progress + Math.random() * 4,
          };
          return newChecks;
        });
      }, 100);

      return () => clearInterval(checkInterval);
    };

    startNextCheck(0);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Neural Network Background Animation */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.05) 0%, transparent 40%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-2xl space-y-8 p-8">
          {/* Header */}
          <div className="text-center">
            <div className="relative mb-4 inline-block">
              <Brain className="h-12 w-12 text-purple-400" />
            </div>
            <h1 className="bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-4xl font-light tracking-wider text-transparent">
              NEUROVA CITY
            </h1>
            <p className="mt-2 text-sm font-light tracking-[0.5em] text-purple-300/70">
              ニューロヴァシティ
            </p>
          </div>

          {/* Main Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-300/70">System Initialization</span>
              <span className="font-medium text-purple-300">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="relative">
              <Progress
                value={progress}
                className="h-2 bg-purple-500/10"
                // @ts-ignore
                indicatorClassName="bg-purple-500"
              />
            </div>
          </div>

          {/* System Checks */}
          <div className="space-y-4">
            {systemChecks.map((check) => (
              <div key={check.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                      <check.icon
                        className={cn(
                          "h-4 w-4",
                          check.status === "complete"
                            ? "text-green-400"
                            : check.status === "checking"
                            ? "text-purple-400 animate-pulse"
                            : "text-purple-400/50"
                        )}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-purple-300">
                        {check.name}
                      </p>
                      <p className="text-sm text-purple-300/70">
                        {check.nameJp}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-purple-400/30",
                      check.status === "complete"
                        ? "border-green-400/30 bg-green-500/10 text-green-300"
                        : check.status === "checking"
                        ? "animate-pulse border-purple-400/30 bg-purple-500/10 text-purple-300"
                        : "border-purple-400/30 bg-purple-500/10 text-purple-300/50"
                    )}
                  >
                    {check.status === "complete"
                      ? "Complete"
                      : check.status === "checking"
                      ? "Checking..."
                      : "Pending"}
                  </Badge>
                </div>
                <div className="relative">
                  <Progress
                    value={check.progress}
                    className={cn(
                      "h-1",
                      check.status === "pending"
                        ? "bg-purple-500/5"
                        : "bg-purple-500/10"
                    )}
                    // @ts-ignore
                    indicatorClassName={cn(
                      check.status === "complete"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Status Message */}
          <div className="text-center">
            <p className="text-sm text-purple-300/70">
              {progress < 100
                ? "Initializing Neural Systems..."
                : "Neural Systems Online"}
            </p>
            <p className="text-xs text-purple-300/50">
              {progress < 100
                ? "ニューラルシステム初期化中..."
                : "ニューラルシステムオンライン"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
