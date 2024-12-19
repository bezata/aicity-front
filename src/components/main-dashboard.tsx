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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Brain,
  CircuitBoard,
  Cpu,
  Eye,
  Globe,
  Heart,
  Network,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function MainDashboard() {
  const [neuralLoad, setNeuralLoad] = useState(42);
  const [systemUptime, setSystemUptime] = useState(99.99);

  // Simulate neural load fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralLoad((prev) => {
        const change = Math.random() * 2 - 1; // Random change between -1 and 1
        return Math.min(Math.max(prev + change, 30), 70); // Keep between 30 and 70
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col space-y-6 bg-gradient-to-b from-black to-purple-950/20 p-6">
      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Neural Load",
            value: `${neuralLoad.toFixed(1)}%`,
            description: "Current system processing capacity",
            trend: neuralLoad > 45 ? "up" : "down",
            change: "+2.3%",
            icon: Brain,
            color: "text-purple-400",
          },
          {
            title: "Active Nodes",
            value: "1,247,892",
            description: "Connected consciousness points",
            trend: "up",
            change: "+12.5%",
            icon: Network,
            color: "text-blue-400",
          },
          {
            title: "System Integrity",
            value: `${systemUptime}%`,
            description: "Quantum matrix stability",
            trend: "up",
            change: "+0.01%",
            icon: Shield,
            color: "text-green-400",
          },
          {
            title: "Anomalies",
            value: "3",
            description: "Detected in last cycle",
            trend: "down",
            change: "-2",
            icon: AlertCircle,
            color: "text-red-400",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-purple-500/10 bg-black/40 backdrop-blur-xl"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`rounded-lg bg-purple-500/10 p-2 ${stat.color}`}
                  >
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-normal text-purple-100">
                    {stat.title}
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={`
                    ${
                      stat.trend === "up"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }
                  `}
                >
                  {stat.trend === "up" ? (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-light text-purple-50">
                  {stat.value}
                </div>
                <p className="text-xs text-purple-200/60">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-6">
        {/* District Performance */}
        <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg font-normal text-purple-100">
              District Performance
            </CardTitle>
            <CardDescription>
              Real-time district metrics and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="consciousness" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-purple-500/5">
                <TabsTrigger value="consciousness">Consciousness</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="consciousness" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      name: "Quantum Nexus",
                      load: 87,
                      capacity: "1.2 PQ",
                      status: "Optimal",
                      icon: Sparkles,
                    },
                    {
                      name: "Neural Hub Alpha",
                      load: 92,
                      capacity: "985 TQ",
                      status: "High Load",
                      icon: Brain,
                    },
                    {
                      name: "Consciousness Core",
                      load: 76,
                      capacity: "1.5 PQ",
                      status: "Optimal",
                      icon: CircuitBoard,
                    },
                    {
                      name: "Synapse Center",
                      load: 95,
                      capacity: "875 TQ",
                      status: "Critical",
                      icon: Cpu,
                    },
                  ].map((district, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <district.icon className="h-4 w-4 text-purple-400" />
                          <h3 className="font-light text-purple-100">
                            {district.name}
                          </h3>
                        </div>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              district.status === "Optimal"
                                ? "border-green-500/30 bg-green-500/10 text-green-400"
                                : district.status === "Critical"
                                ? "border-red-500/30 bg-red-500/10 text-red-400"
                                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                            }
                          `}
                        >
                          {district.status}
                        </Badge>
                      </div>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-purple-200/60">Neural Load</span>
                        <span className="text-purple-200">
                          {district.load}%
                        </span>
                      </div>
                      <Progress
                        value={district.load}
                        className="mb-2 h-1 bg-purple-950/50"
                      />
                      <div className="text-xs text-purple-200/60">
                        Processing Capacity: {district.capacity}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-normal text-purple-100">
              Neural Activity
            </CardTitle>
            <CardDescription>Real-time system events</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4 [&>div]:!scrollbar [&>div]:!scrollbar-track-transparent [&>div]:!scrollbar-thumb-purple-500/20">
              <div className="space-y-4">
                {[
                  {
                    title: "Quantum Fluctuation Detected",
                    description: "Anomaly contained in Sector 7",
                    time: "Just now",
                    icon: Activity,
                    color: "text-red-400",
                  },
                  {
                    title: "Neural Pathway Optimized",
                    description: "Efficiency increased by 15%",
                    time: "5 mins ago",
                    icon: Brain,
                    color: "text-green-400",
                  },
                  {
                    title: "New Consciousness Node",
                    description: "Integration successful",
                    time: "12 mins ago",
                    icon: CircuitBoard,
                    color: "text-blue-400",
                  },
                  {
                    title: "Security Protocol Update",
                    description: "Quantum encryption enhanced",
                    time: "27 mins ago",
                    icon: Shield,
                    color: "text-purple-400",
                  },
                  {
                    title: "Resource Allocation",
                    description: "Neural capacity expanded",
                    time: "1 hour ago",
                    icon: Cpu,
                    color: "text-yellow-400",
                  },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`mt-0.5 ${activity.color}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-100">
                        {activity.title}
                      </p>
                      <p className="text-xs text-purple-200/60">
                        {activity.description}
                      </p>
                      <p className="mt-1 text-xs text-purple-300/40">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Active Users",
            value: "42,892",
            change: "+2.5%",
            icon: Users,
          },
          {
            title: "Neural Pathways",
            value: "1.2M",
            change: "+15.2%",
            icon: Network,
          },
          {
            title: "System Health",
            value: "98.9%",
            change: "+0.5%",
            icon: Heart,
          },
          {
            title: "Global Sync",
            value: "99.99%",
            change: "+0.01%",
            icon: Globe,
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-purple-500/10 bg-black/40 backdrop-blur-xl"
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm text-purple-200/60">{stat.title}</p>
                <p className="text-2xl font-light text-purple-100">
                  {stat.value}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2.5">
                  <stat.icon className="h-4 w-4 text-purple-400" />
                </div>
                <Badge
                  variant="outline"
                  className="border-green-500/30 bg-green-500/10 text-green-400"
                >
                  <ArrowUp className="mr-1 h-3 w-3" />
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
