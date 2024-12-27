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

export function DepartmentsOverview() {
  const router = useRouter();
  const apiKey = process.env.BACKEND_API_KEY;
  const { address } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);

  const emergencyAlerts = [
    {
      id: "emergency-1",
      title: "🚨 Emergency Alert",
      titleJp: "緊急アラート",
      content:
        "🌸 Cherry blossom festival preparations needed! All hands on deck for this beautiful emergency! 🎋",
      departmentId: "culture",
      participants: 3,
      status: "live",
    },
    {
      id: "emergency-2",
      title: "🚨 Emergency Alert",
      titleJp: "緊急アラート",
      content:
        "🐱 Cat stuck in a quantum computer! Need immediate assistance from our tech team! 🖥️",
      departmentId: "tech",
      participants: 4,
      status: "live",
    },
    {
      id: "emergency-3",
      title: "🚨 Emergency Alert",
      titleJp: "緊急アラート",
      content:
        "🎮 Virtual reality festival overload! Too much fun detected in sector 7! 🎉",
      departmentId: "entertainment",
      participants: 5,
      status: "live",
    },
    {
      id: "emergency-4",
      title: "🚨 Emergency Alert",
      titleJp: "緊急アラート",
      content:
        "🌈 Rainbow bridge malfunction! Need immediate recalibration of happiness levels! ✨",
      departmentId: "infrastructure",
      participants: 3,
      status: "live",
    },
    {
      id: "emergency-5",
      title: "🚨 Emergency Alert",
      titleJp: "緊急アラート",
      content:
        "🍜 Ramen shortage detected! Emergency noodle supply needed in downtown district! 🥢",
      departmentId: "services",
      participants: 4,
      status: "live",
    },
  ];

  useEffect(() => {
    const fetchActiveSessions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/collaborations`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(apiKey && { "x-api-key": apiKey }),
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch collaborations");
        }
        const data = await response.json();
        if (data.success) {
          const formattedSessions = data.data.map((collab: any) => ({
            id: collab.id,
            departmentId: collab.agents[0]?.id || "unknown",
            title: collab.messages[0]?.topics?.includes("emergency")
              ? "Emergency Alert"
              : collab.messages[0]?.content.split("\n")[0] ||
                "Untitled Session",
            titleJp: collab.messages[0]?.content.split("\n")[1] || "",
            participants: collab.agents.length,
            startTime: new Date(collab.messages[0]?.timestamp).toISOString(),
            status: collab.status,
            participantsDetails: collab.agents.map((agent: any) => ({
              id: agent.id,
              name: agent.name || agent.id,
              nameJp: `エージェント`,
              role: "Collaborator",
              avatar: "/placeholder.svg?height=40&width=40",
              isAgent: true,
            })),
            messages: collab.messages.map((msg: any) => ({
              id: msg.timestamp.toString(),
              content: msg.content,
              sender: {
                id: msg.agentId,
                name:
                  collab.agents.find((a: any) => a.id === msg.agentId)?.name ||
                  msg.agentId,
                nameJp: `エージェント`,
                role: "Collaborator",
                avatar: "/placeholder.svg?height=40&width=40",
                isAgent: true,
              },
              timestamp: new Date(msg.timestamp).toISOString(),
            })),
          }));

          // Add random emergency alerts
          const randomEmergencies = emergencyAlerts
            .sort(() => 0.5 - Math.random())
            .slice(0, 2)
            .map((alert) => ({
              ...alert,
              startTime: new Date().toISOString(),
              participantsDetails: Array(alert.participants).fill({
                id: "agent",
                name: "Emergency Agent",
                nameJp: "緊急対応エージェント",
                role: "Emergency Responder",
                avatar: "/placeholder.svg?height=40&width=40",
                isAgent: true,
              }),
              messages: [
                {
                  id: Date.now().toString(),
                  content: alert.content,
                  sender: {
                    id: "system",
                    name: "System",
                    nameJp: "システム",
                    role: "Alert System",
                    avatar: "/placeholder.svg?height=40&width=40",
                    isAgent: true,
                  },
                  timestamp: new Date().toISOString(),
                },
              ],
            }));

          setActiveSessions([...randomEmergencies, ...formattedSessions]);
        }
      } catch (error) {
        console.error("Error fetching collaborations:", error);
      }
    };

    fetchActiveSessions();
    // Fetch every 5 minutes
    const interval = setInterval(fetchActiveSessions, 5 * 60 * 1000);
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
          `${process.env.NEXT_PUBLIC_API_URL}api/departments`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(apiKey && { "x-api-key": apiKey }),
            },
          }
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
                  Recent Sessions
                </CardTitle>
                <CardDescription>最近のセッション</CardDescription>
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
              </CardContent>
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
