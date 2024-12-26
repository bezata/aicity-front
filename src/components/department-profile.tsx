"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Users,
  DollarSign,
  Activity,
  Calendar,
  MessageCircle,
  ChevronRight,
  Clock,
} from "lucide-react";

interface AgentHealth {
  physical: number;
  mental: number;
  energy: number;
  motivation: number;
  happiness: number;
  satisfaction: number;
  stress: number;
}

interface Metrics {
  efficiency: number;
  responseTime: number;
  successRate: number;
  collaborationScore: number;
}

interface PerformanceRecord {
  timestamp: string;
  description: string;
  metrics: Metrics;
  agentHealth: AgentHealth;
  budgetHealth: number;
}

interface DepartmentPerformance {
  success: boolean;
  departmentId: string;
  departmentName: string;
  performanceHistory: PerformanceRecord[];
}

export function DepartmentProfile() {
  const router = useRouter();
  const [performanceData, setPerformanceData] =
    useState<DepartmentPerformance | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/departments/economy-dept/performance/history"
        );
        const data = await response.json();
        setPerformanceData(data);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(Number(timestamp));
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const latestActivities =
    performanceData?.performanceHistory.slice(0, 3).map((record, index) => ({
      id: index.toString(),
      type: "update",
      title: "Department Update",
      description:
        record.description
          .replace("Here is the activity description:\n\n", "")
          .slice(0, 200) + "...",
      time: formatTimestamp(record.timestamp),
      metrics: record.metrics,
      agentHealth: record.agentHealth,
    })) || [];

  return (
    <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-light tracking-wider">
            Latest Department Activity
          </CardTitle>
          <Button
            variant="ghost"
            className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
            onClick={() => router.push("/departments")}
          >
            View All Departments
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-purple-500/20">
              <AvatarImage src="/avatars/economy.png" />
              <AvatarFallback className="bg-purple-500/10 text-purple-300">
                ED
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-purple-300">
                {performanceData?.departmentName || "Economy Department"}
              </h3>
              <div className="mt-1 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-purple-500/20 bg-purple-500/5"
                >
                  <Users className="mr-1 h-3 w-3" />
                  Active
                </Badge>
                <Badge
                  variant="outline"
                  className="border-purple-500/20 bg-purple-500/5"
                >
                  <MessageCircle className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {latestActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                    <Activity className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-purple-300">
                        {activity.title}
                      </h3>
                      <div className="flex items-center gap-1 text-purple-300/50">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{activity.time}</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-purple-300/70">
                      {activity.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Progress
                          value={activity.metrics.efficiency * 100}
                          className="h-1 w-20 bg-purple-500/10"
                        />
                        <span className="text-xs text-purple-300/70">
                          {Math.round(activity.metrics.efficiency * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
              onClick={() => router.push("http://localhost:3000/economy-dept")}
            >
              View Department
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
              onClick={() => router.push("http://localhost:3000/departments")}
            >
              <DollarSign className="h-4 w-4" />
              Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
