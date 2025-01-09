"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useAppKitAccount } from "@reown/appkit/react";

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
  participantsDetails: {
    id: string;
    name: string;
    nameJp: string;
    role: string;
    avatar: string;
    isAgent?: boolean;
  }[];
  messages?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      nameJp: string;
      role: string;
      avatar: string;
      isAgent?: boolean;
    };
    timestamp: string;
  }[];
}

interface Collaboration {
  id: string;
  status: string;
  agents: { id: string }[];
  messages: any[];
  decisions: any[];
  metrics: {
    consensusLevel: number;
    progressRate: number;
    effectiveness: number;
    participationScore: Record<string, number>;
    topicsAnalyzed: number;
    consensusLevels: number[];
    averageConsensus: number;
  };
}

export function DepartmentsOverview() {
  const router = useRouter();
  const apiKey = process.env.BACKEND_API_KEY;
  const { address } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const response = await fetch(
          "https://backend.neurova.fun/api/collaborations"
        );
        if (!response.ok) throw new Error("Failed to fetch collaborations");
        const { data } = await response.json();

        // Convert collaborations to sessions format
        const sessions: Session[] = data.map((collab: Collaboration) => ({
          id: collab.id,
          title: `Collaboration Session`,
          titleJp: "コラボレーションセッション",
          departmentId: collab.agents[0]?.id || "unknown",
          participants: collab.agents.length,
          startTime: new Date().toISOString(),
          status:
            collab.status === "completed"
              ? ("completed" as const)
              : ("live" as const),
          participantsDetails: collab.agents.map((agent) => ({
            id: agent.id,
            name: agent.id.charAt(0).toUpperCase() + agent.id.slice(1),
            nameJp: agent.id,
            role: "Department Agent",
            avatar: "/placeholder.svg?height=40&width=40",
            isAgent: true,
          })),
          messages: collab.messages.map((msg: any) => ({
            id: `msg-${msg.timestamp}`,
            content: msg.content,
            sender: {
              id: msg.agentId,
              name: msg.agentId.charAt(0).toUpperCase() + msg.agentId.slice(1),
              nameJp: msg.agentId,
              role: "Department Agent",
              avatar: "/placeholder.svg?height=40&width=40",
              isAgent: true,
            },
            timestamp: new Date(msg.timestamp).toISOString(),
          })),
        }));

        setActiveSessions(
          sessions.filter((s) => s.status === "completed").slice(0, 5)
        );
      } catch (error) {
        console.error("Error fetching collaborations:", error);
        setActiveSessions([]);
      }
    };

    fetchCollaborations();
    const interval = setInterval(fetchCollaborations, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleViewSession = useCallback((session: Session) => {
    setSelectedSession(session);
  }, []);

  const departmentMetrics = departments.map((dept) => ({
    name: dept.name,
    budget: dept.budget.allocated / 1000000,
    sessions: dept.assignedAgents.length,
  }));

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/departments`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    fetchDepartments();
  }, []);

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
                      name="Budget (M NRA)"
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
              <div>
                <CardTitle className="font-light tracking-wider">
                  Recent Completed Sessions
                </CardTitle>
                <CardDescription>完了したセッション</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {activeSessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[250px] text-center space-y-3">
                      <Brain className="h-12 w-12 text-purple-400/50 animate-pulse" />
                      <p className="text-sm font-medium text-purple-300">
                        Departments are taking a little break... 😴
                      </p>
                      <p className="text-xs text-purple-300/70">
                        部門はちょっと休憩中...
                      </p>
                    </div>
                  ) : (
                    activeSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-start justify-between rounded-lg border border-purple-500/10 bg-black/20 p-3 hover:bg-black/30 transition-colors cursor-pointer"
                        onClick={() => handleViewSession(session)}
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{session.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.titleJp}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{session.participants} participants</span>
                            <span>•</span>
                            <span>{session.status}</span>
                            {session.id.startsWith("emergency-") && (
                              <>
                                <span>•</span>
                                <AlertTriangle className="h-3 w-3 text-yellow-400" />
                                <span className="text-yellow-400">
                                  Emergency
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "border-purple-400/30 bg-purple-500/10",
                            session.status === "live"
                              ? "border-green-400/30 bg-green-500/10 text-green-300"
                              : "text-purple-300"
                          )}
                        >
                          {session.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((department) => (
            <Card
              key={department.id}
              className="border-purple-500/10 bg-black/30 backdrop-blur-xl flex flex-col p-6"
            >
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-light tracking-wider">
                      {department.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                    >
                      {department.type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {department.description}
                  </p>
                </div>

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
                    <span>{department.budget.spent.toLocaleString()} NRA</span>
                    <span>{department.budget.total.toLocaleString()} NRA</span>
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
              </div>

              <Button
                onClick={() => router.push(`/departments/${department.id}`)}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 backdrop-blur-sm transition-all mt-6"
              >
                View Details
              </Button>
            </Card>
          ))}
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
