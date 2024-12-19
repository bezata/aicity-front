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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Brain,
  Building2,
  CircuitBoard,
  Compass,
  Cpu,
  FileText,
  Fingerprint,
  Flame,
  Globe,
  Home,
  MessageSquare,
  Radio,
  Settings,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface NavigationItem {
  name: string;
  icon: any; // or use proper Lucide icon type
  href: string;
  badge?: string;
  status?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export default function Navigation() {
  const [lightningPosition, setLightningPosition] = useState({ x: 50, y: 50 });

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

  const navigationSections: NavigationSection[] = [
    {
      title: "Core Systems",
      items: [
        { name: "Overview", icon: Home, href: "/", badge: "Active" },
        {
          name: "Chronicles",
          icon: FileText,
          href: "/chronicles",
          badge: "New",
        },
        { name: "Districts", icon: Globe, href: "/districts" },
        { name: "Navigation", icon: Compass, href: "/navigation" },
      ],
    },
    {
      title: "Departments",
      items: [
        {
          name: "Quantum Defense",
          icon: Shield,
          href: "/departments/quantum-defense",
          status: "Optimal",
        },
        {
          name: "Neural Health",
          icon: Brain,
          href: "/departments/neural-health",
          status: "Active",
        },
        {
          name: "Digital Safety",
          icon: Flame,
          href: "/departments/digital-safety",
          status: "Alert",
        },
        {
          name: "Consciousness Research",
          icon: Sparkles,
          href: "/departments/consciousness",
          status: "Active",
        },
      ],
    },
    {
      title: "Utilities",
      items: [
        { name: "Settings", icon: Settings, href: "/settings" },
        { name: "System Status", icon: AlertCircle, href: "/status" },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Ambient Background Effects */}
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
                <Compass className="h-8 w-8 text-purple-300" />
                <h1 className="bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-3xl font-extralight tracking-[0.2em] text-transparent">
                  NEURAL NEXUS
                </h1>
              </div>
            </div>
            <p className="mt-4 font-light tracking-[0.3em] text-purple-300/70">
              システムナビゲーション
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {navigationSections.map((section, i) => (
              <Card
                key={i}
                className="border-purple-500/10 bg-black/40 backdrop-blur-xl"
              >
                <CardHeader>
                  <CardTitle className="font-light tracking-[0.15em]">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="font-light text-purple-300/70">
                    {section.items.length} modules available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {section.items.map((item, j) => (
                      <Link key={j} href={item.href}>
                        <Button
                          variant="ghost"
                          className="relative w-full justify-start gap-3 overflow-hidden rounded-lg border border-transparent px-3 py-6 text-left transition-all hover:border-purple-500/20 hover:bg-purple-500/10"
                        >
                          <div className="relative z-10 flex w-full items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                                <item.icon className="h-4 w-4 text-purple-400" />
                              </div>
                              <span className="font-light">{item.name}</span>
                            </div>
                            {(item.badge || item.status) && (
                              <Badge
                                variant="outline"
                                className={`border-purple-400/30 bg-purple-500/10 text-purple-300
                                  ${
                                    item.status === "Alert"
                                      ? "border-red-400/30 bg-red-500/10 text-red-300"
                                      : ""
                                  }
                                  ${
                                    item.status === "Optimal"
                                      ? "border-green-400/30 bg-green-500/10 text-green-300"
                                      : ""
                                  }
                                `}
                              >
                                {item.badge || item.status}
                              </Badge>
                            )}
                          </div>
                          {/* Hover Effect */}
                          <div className="absolute inset-0 z-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </Button>
                      </Link>
                    ))}
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
