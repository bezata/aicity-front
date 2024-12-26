"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import {
  AlertTriangle,
  Clock,
  Users,
  Brain,
  MessageCircle,
} from "lucide-react";
import { SessionViewer } from "@/components/session-viewer";
import { cn } from "@/lib/utils";
import { MainLayout } from "./main-layout";
import { LoadingScreen } from "./loading-screen";

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

interface Department {
  id: string;
  name: string;
  type: string;
  description: string;
  assignedAgents: string[];
  activeChats: any[];
  currentProjects: any[];
  metrics: {
    efficiency: number;
    responseTime: number;
    successRate: number;
    collaborationScore: number;
  };
  budget: {
    total: number;
    allocated: number;
    spent: number;
    donations: number;
    expenses: any[];
    donations_history: any[];
  };
}

interface DepartmentMetric {
  name: string;
  budget: number;
  sessions: number;
}

interface Session {
  id: string;
  departmentId: string;
  title: string;
  titleJp: string;
  participants: number;
  startTime: string;
  status: "live" | "scheduled" | "completed";
  participantsDetails?: {
    id: string;
    name: string;
    nameJp: string;
    role: string;
    avatar: string;
    isAgent?: boolean;
  }[];
}

export function DepartmentsOverview() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedSession, setSelectedSession] = useState<
    | (Session & {
        participantsDetails: NonNullable<Session["participantsDetails"]>;
      })
    | null
  >(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/departments");
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
      setIsLoading(false);
    };

    fetchDepartments();
  }, []);

  const departmentMetrics = departments.map((dept) => ({
    name: dept.name,
    budget: dept.budget.allocated / 1000000,
    sessions: dept.assignedAgents.length,
  }));

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            City Departments Overview
          </h1>
          <p className="text-muted-foreground">部門の概要</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <Card
              key={department.id}
              className="border-purple-500/10 bg-black/30 backdrop-blur-xl hover:bg-black/40 transition-colors cursor-pointer"
              onClick={() => router.push(`/departments/${department.id}`)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="font-light tracking-wider">
                    {department.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                  >
                    {department.type.replace(/_/g, " ")}
                  </Badge>
                </CardTitle>
                <CardDescription>{department.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Budget Progress
                    </span>
                    <span>
                      {Math.round(
                        (department.budget.spent / department.budget.total) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (department.budget.spent / department.budget.total) * 100
                    }
                    className="h-2 bg-purple-500/10"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{department.budget.spent.toLocaleString()} CR</span>
                    <span>{department.budget.total.toLocaleString()} CR</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Active Agents
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium">
                        {department.assignedAgents.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Response Time
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium">
                        {Math.round(department.metrics.responseTime * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-light tracking-wider">
                Department Metrics
              </CardTitle>
              <CardDescription>部門メトリクス</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                className="h-[300px]"
                config={{
                  budget: { label: "Budget", color: "#a855f7" },
                  sessions: { label: "Sessions", color: "#6366f1" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentMetrics}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-purple-500/10"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Bar
                      name="Budget (M CR)"
                      dataKey="budget"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      name="Active Sessions"
                      dataKey="sessions"
                      fill="hsl(var(--secondary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-light tracking-wider">
                Recent Sessions
              </CardTitle>
              <CardDescription>最近のセッション</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {departments.map((department) => (
                    <div
                      key={department.id}
                      className="flex items-start justify-between rounded-lg border border-purple-500/10 bg-black/20 p-3 hover:bg-black/30 transition-colors cursor-pointer"
                      onClick={() =>
                        setSelectedSession({
                          id: department.id,
                          departmentId: department.id,
                          title: department.name,
                          titleJp: department.name,
                          participants: department.assignedAgents.length,
                          startTime: "Active",
                          status: "live",
                          participantsDetails: department.assignedAgents.map(
                            (agent, index) => ({
                              id: agent,
                              name: `Agent ${index + 1}`,
                              nameJp: `エージェント ${index + 1}`,
                              role: "Department Agent",
                              avatar: "/placeholder.svg?height=40&width=40",
                              isAgent: true,
                            })
                          ),
                        })
                      }
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{department.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {department.type}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{department.assignedAgents.length} agents</span>
                          <span>•</span>
                          <span>Active</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-green-400/30 bg-green-500/10 text-green-300"
                      >
                        live
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {selectedSession && (
          <SessionViewer
            session={selectedSession}
            open={!!selectedSession}
            onOpenChange={(open) => !open && setSelectedSession(null)}
          />
        )}
      </div>
    </MainLayout>
  );
}
