"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Shield,
  Heart,
  Building2,
  TreesIcon as Tree,
  Music,
  Workflow,
  Gauge,
  Activity,
  Sparkles,
  Zap,
  Recycle,
  PartyPopper,
  Building,
  Train,
  Wifi,
  Wrench,
  ShieldCheck,
  Globe,
  DollarSign,
  TrendingUp,
  BarChart,
  CircleDollarSign,
} from "lucide-react";

interface MetricCategory {
  id: string;
  name: string;
  nameJp: string;
  icon: any;
  metrics: {
    id: string;
    name: string;
    value: number;
    trend: "up" | "down" | "stable";
    icon: any;
  }[];
}

export function DistrictDetailedMetrics() {
  const [pulsePosition, setPulsePosition] = useState({ x: 50, y: 50 });
  const [activeMetrics, setActiveMetrics] = useState<MetricCategory[]>(
    getInitialMetrics()
  );

  // Animate background pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetrics((metrics) =>
        metrics.map((category) => ({
          ...category,
          metrics: category.metrics.map((metric) => ({
            ...metric,
            value: Math.min(
              100,
              Math.max(0, metric.value + (Math.random() * 4 - 2))
            ),
            trend:
              Math.random() > 0.7
                ? Math.random() > 0.5
                  ? "up"
                  : "down"
                : "stable",
          })),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Ambient Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at ${pulsePosition.x}% ${pulsePosition.y}%, rgba(147, 51, 234, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 90% 10%, rgba(124, 58, 237, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 10% 90%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95))
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container py-12">
        <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-light tracking-wider">
                  District Metrics
                </CardTitle>
                <p className="text-sm text-purple-300/70">区域メトリクス</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-purple-300">Live Updates</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="social" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 bg-black/20">
                <TabsTrigger value="social" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Social</span>
                </TabsTrigger>
                <TabsTrigger value="environment" className="gap-2">
                  <Tree className="h-4 w-4" />
                  <span className="hidden sm:inline">Environment</span>
                </TabsTrigger>
                <TabsTrigger value="culture" className="gap-2">
                  <Music className="h-4 w-4" />
                  <span className="hidden sm:inline">Culture</span>
                </TabsTrigger>
                <TabsTrigger value="infrastructure" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Infrastructure</span>
                </TabsTrigger>
                <TabsTrigger value="economy" className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Economy</span>
                </TabsTrigger>
              </TabsList>

              {activeMetrics.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {category.metrics.map((metric) => (
                        <Card
                          key={metric.id}
                          className="group border-purple-500/10 bg-black/40 transition-all hover:border-purple-500/20"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                                    <metric.icon className="h-4 w-4 text-purple-400" />
                                  </div>
                                  <span className="font-light tracking-wider text-purple-300">
                                    {metric.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <motion.div
                                    key={metric.trend}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-sm ${
                                      metric.trend === "up"
                                        ? "text-green-400"
                                        : metric.trend === "down"
                                        ? "text-red-400"
                                        : "text-purple-400"
                                    }`}
                                  >
                                    {metric.trend === "up"
                                      ? "↑"
                                      : metric.trend === "down"
                                      ? "↓"
                                      : "→"}
                                  </motion.div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-purple-300/70">
                                    Status
                                  </span>
                                  <span className="font-medium text-purple-300">
                                    {metric.value.toFixed(1)}%
                                  </span>
                                </div>
                                <Progress
                                  value={metric.value}
                                  className="h-2 bg-purple-500/10"
                                  // @ts-ignore
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getInitialMetrics(): MetricCategory[] {
  return [
    {
      id: "social",
      name: "Social & Community",
      nameJp: "社会とコミュニティ",
      icon: Users,
      metrics: [
        {
          id: "safety",
          name: "Safety Score",
          value: 92,
          trend: "stable",
          icon: Shield,
        },
        {
          id: "wellbeing",
          name: "Community Wellbeing",
          value: 88,
          trend: "up",
          icon: Heart,
        },
        {
          id: "cohesion",
          name: "Social Cohesion",
          value: 85,
          trend: "up",
          icon: Users,
        },
        {
          id: "services",
          name: "Public Service Access",
          value: 90,
          trend: "stable",
          icon: Building,
        },
        {
          id: "diversity",
          name: "Cultural Diversity",
          value: 95,
          trend: "up",
          icon: Globe,
        },
        {
          id: "engagement",
          name: "Community Engagement",
          value: 87,
          trend: "up",
          icon: Users,
        },
      ],
    },
    {
      id: "environment",
      name: "Environment & Health",
      nameJp: "環境と健康",
      icon: Tree,
      metrics: [
        {
          id: "cleanliness",
          name: "Cleanliness",
          value: 94,
          trend: "stable",
          icon: Sparkles,
        },
        {
          id: "noise",
          name: "Noise Levels",
          value: 82,
          trend: "down",
          icon: Activity,
        },
        {
          id: "crowding",
          name: "Crowding Levels",
          value: 78,
          trend: "stable",
          icon: Users,
        },
        {
          id: "emissions",
          name: "Carbon Emissions",
          value: 95,
          trend: "up",
          icon: Zap,
        },
        {
          id: "waste",
          name: "Waste Management",
          value: 91,
          trend: "up",
          icon: Recycle,
        },
        {
          id: "green",
          name: "Green Space Coverage",
          value: 88,
          trend: "stable",
          icon: Tree,
        },
      ],
    },
    {
      id: "culture",
      name: "Culture & Development",
      nameJp: "文化と発展",
      icon: Music,
      metrics: [
        {
          id: "vibrancy",
          name: "Cultural Vibrancy",
          value: 93,
          trend: "up",
          icon: Music,
        },
        {
          id: "events",
          name: "Events Frequency",
          value: 89,
          trend: "up",
          icon: PartyPopper,
        },
        {
          id: "heritage",
          name: "Heritage Preservation",
          value: 91,
          trend: "stable",
          icon: Building,
        },
        {
          id: "participation",
          name: "Community Participation",
          value: 86,
          trend: "up",
          icon: Users,
        },
        {
          id: "growth",
          name: "Economic Growth",
          value: 88,
          trend: "up",
          icon: Activity,
        },
        {
          id: "business",
          name: "Business Activity",
          value: 85,
          trend: "stable",
          icon: Building2,
        },
      ],
    },
    {
      id: "infrastructure",
      name: "Infrastructure & Services",
      nameJp: "インフラとサービス",
      icon: Building2,
      metrics: [
        {
          id: "quality",
          name: "Infrastructure Quality",
          value: 90,
          trend: "stable",
          icon: Building2,
        },
        {
          id: "transport",
          name: "Transport Efficiency",
          value: 87,
          trend: "up",
          icon: Train,
        },
        {
          id: "energy",
          name: "Energy Efficiency",
          value: 92,
          trend: "up",
          icon: Zap,
        },
        {
          id: "smart",
          name: "Smart Integration",
          value: 94,
          trend: "up",
          icon: Wifi,
        },
        {
          id: "accessibility",
          name: "Accessibility",
          value: 89,
          trend: "stable",
          icon: Users,
        },
        {
          id: "maintenance",
          name: "Maintenance",
          value: 91,
          trend: "up",
          icon: Wrench,
        },
        {
          id: "resilience",
          name: "Resilience",
          value: 93,
          trend: "stable",
          icon: ShieldCheck,
        },
      ],
    },
    {
      id: "economy",
      name: "Economic & Finance",
      nameJp: "経済と金融",
      icon: DollarSign,
      metrics: [
        {
          id: "growth",
          name: "Economic Growth",
          value: 89,
          trend: "up",
          icon: TrendingUp,
        },
        {
          id: "market",
          name: "Market Activity",
          value: 92,
          trend: "stable",
          icon: BarChart,
        },
        {
          id: "investment",
          name: "Investment Flow",
          value: 87,
          trend: "up",
          icon: CircleDollarSign,
        },
        {
          id: "business",
          name: "Business Activity",
          value: 91,
          trend: "up",
          icon: Building2,
        },
        {
          id: "revenue",
          name: "Revenue Generation",
          value: 88,
          trend: "stable",
          icon: DollarSign,
        },
        {
          id: "employment",
          name: "Employment Rate",
          value: 94,
          trend: "up",
          icon: Users,
        },
      ],
    },
  ];
}
