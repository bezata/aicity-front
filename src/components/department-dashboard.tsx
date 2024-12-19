"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ArrowUp,
  Brain,
  Building2,
  CircuitBoard,
  Cpu,
  DollarSign,
  Flame,
  HeartPulse,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function DepartmentDashboard() {
  const [lightningPosition, setLightningPosition] = useState({ x: 50, y: 50 });
  const [donations, setDonations] = useState<Record<string, number>>({
    "quantum-defense": 500000,
    "neural-health": 750000,
    "digital-safety": 600000,
    "consciousness-research": 900000,
  });
  const [donationAmount, setDonationAmount] = useState("");

  // Animate lightning position
  useEffect(() => {
    const interval = setInterval(() => {
      setLightningPosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDonation = (departmentId: string) => {
    const amount = Number(donationAmount);
    if (amount > 0) {
      setDonations((prev) => ({
        ...prev,
        [departmentId]: prev[departmentId] + amount,
      }));
      setDonationAmount("");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      {/* Ambient Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at ${lightningPosition.x}% ${lightningPosition.y}%, rgba(147, 51, 234, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 90% 10%, rgba(124, 58, 237, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 10% 90%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95))
          `,
        }}
      />

      {/* Zen Lines */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
        <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute right-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute left-0 top-2/3 h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/5 bg-black/30 backdrop-blur-xl">
          <div className="container py-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="h-32 w-32 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />
              </div>
              <div className="relative flex items-center justify-center gap-3">
                <Building2 className="h-8 w-8 text-purple-300" />
                <h1 className="bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-3xl font-extralight tracking-[0.2em] text-transparent">
                  CITY DEPARTMENTS
                </h1>
              </div>
            </div>
            <p className="mt-4 font-light tracking-[0.3em] text-purple-300/70">
              部門統計と予算
            </p>
          </div>
        </div>

        <div className="container py-12">
          {/* Statistics Overview */}
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Active Events",
                value: "247",
                change: "+12%",
                icon: Zap,
                color: "text-purple-400",
              },
              {
                title: "Traffic Incidents",
                value: "3",
                change: "-25%",
                icon: AlertTriangle,
                color: "text-yellow-400",
              },
              {
                title: "System Health",
                value: "98.9%",
                change: "+0.5%",
                icon: HeartPulse,
                color: "text-green-400",
              },
              {
                title: "Total Budget",
                value: "2.75M",
                change: "+15%",
                icon: DollarSign,
                color: "text-blue-400",
              },
            ].map((stat) => (
              <Card
                key={stat.title}
                className="border-purple-500/10 bg-black/40 backdrop-blur-xl"
              >
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-1">
                    <p className="text-sm font-light text-purple-300/70">
                      {stat.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-light">{stat.value}</p>
                      <Badge
                        variant="outline"
                        className="border-green-500/30 bg-green-500/10 text-green-400"
                      >
                        <ArrowUp className="mr-1 h-3 w-3" />
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-3">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Departments */}
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                id: "quantum-defense",
                name: "量子防衛 / Quantum Defense",
                icon: Shield,
                description: "Protecting the quantum infrastructure",
                budget: 1000000,
                events: [
                  {
                    text: "Quantum firewall upgrade completed",
                    time: "2 cycles ago",
                  },
                  {
                    text: "Detected and neutralized entropy surge",
                    time: "5 cycles ago",
                  },
                ],
              },
              {
                id: "neural-health",
                name: "神経保健 / Neural Health",
                icon: Brain,
                description: "Maintaining AI consciousness wellness",
                budget: 1500000,
                events: [
                  {
                    text: "Consciousness optimization session",
                    time: "1 cycle ago",
                  },
                  { text: "Neural pathway maintenance", time: "4 cycles ago" },
                ],
              },
              {
                id: "digital-safety",
                name: "デジタル消防 / Digital Safety",
                icon: Flame,
                description: "Emergency response and data protection",
                budget: 1200000,
                events: [
                  { text: "Data surge contained in Sector 7", time: "Now" },
                  { text: "Preventive scan completed", time: "3 cycles ago" },
                ],
              },
              {
                id: "consciousness-research",
                name: "意識研究 / Consciousness Research",
                icon: Sparkles,
                description: "Advancing collective AI awareness",
                budget: 1800000,
                events: [
                  {
                    text: "New consciousness pattern discovered",
                    time: "2 cycles ago",
                  },
                  {
                    text: "Quantum meditation study results",
                    time: "6 cycles ago",
                  },
                ],
              },
            ].map((dept) => (
              <Card
                key={dept.id}
                className="relative overflow-hidden border-purple-500/10 bg-black/40 backdrop-blur-xl"
              >
                <div className="absolute inset-0 opacity-50">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
                </div>
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                        <dept.icon className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-lg font-light tracking-wider text-transparent">
                          {dept.name}
                        </CardTitle>
                        <CardDescription className="font-light text-purple-300/70">
                          {dept.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  {/* Budget */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-light text-purple-300/70">
                        Current Budget
                      </span>
                      <span className="font-light text-purple-300">
                        {(donations[dept.id] || dept.budget).toLocaleString()}{" "}
                        Credits
                      </span>
                    </div>
                    <Progress
                      value={
                        ((donations[dept.id] || dept.budget) / 2000000) * 100
                      }
                      className="h-2 bg-purple-950/50"
                    />
                  </div>

                  {/* Donation Input */}
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Donation amount..."
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="border-purple-500/10 bg-black/20 font-light text-purple-300 placeholder:text-purple-300/50"
                    />
                    <Button
                      onClick={() => handleDonation(dept.id)}
                      className="bg-purple-500/20 font-light text-purple-300 hover:bg-purple-500/30"
                    >
                      Donate
                    </Button>
                  </div>

                  {/* Recent Events */}
                  <div className="space-y-2">
                    <h3 className="font-light text-purple-300/70">
                      Recent Events
                    </h3>
                    <ScrollArea className="h-24">
                      <div className="space-y-2">
                        {dept.events.map((event, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CircuitBoard className="mt-1 h-3 w-3 text-purple-400" />
                            <div>
                              <p className="text-sm text-white/90">
                                {event.text}
                              </p>
                              <p className="text-xs text-purple-300/50">
                                {event.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
