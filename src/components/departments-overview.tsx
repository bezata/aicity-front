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
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAppKitAccount } from "@reown/appkit/react";

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

interface EmergencyMessage {
  type: "system_message";
  timestamp: number;
  data: {
    content: string;
    activity: string;
    agents: {
      id: string;
      name: string;
    }[];
  };
}

export function DepartmentsOverview() {
  const router = useRouter();
  const { address } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedSession, setSelectedSession] = useState<
    | (Session & {
        participantsDetails: NonNullable<Session["participantsDetails"]>;
      })
    | null
  >(null);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);

  const handleWebSocketMessage = useCallback(
    (wsMessage: any) => {
      if (
        wsMessage.type === "system_message" &&
        wsMessage.data.activity === "emergency"
      ) {
        // Create a new session from emergency message
        const emergencySession: Session = {
          id: `emergency-${wsMessage.timestamp}`,
          departmentId: wsMessage.data.departmentId || "emergency",
          title: wsMessage.data.content,
          titleJp: wsMessage.data.content,
          participants: wsMessage.data.agents.length,
          startTime: new Date(wsMessage.timestamp).toISOString(),
          status: "live",
          participantsDetails: wsMessage.data.agents.map((agent: any) => ({
            id: agent.id,
            name: agent.name,
            nameJp: `エージェント`,
            role: "Emergency Responder",
            avatar: "/placeholder.svg?height=40&width=40",
            isAgent: true,
          })),
        };

        setActiveSessions((prev) => {
          // Check if this emergency session already exists
          if (prev.some((s) => s.id === emergencySession.id)) {
            return prev;
          }
          return [emergencySession, ...prev];
        });
      } else if (wsMessage.type === "agent_conversation") {
        const { message, conversationId } = wsMessage.data;
        if (selectedSession?.id === conversationId) {
          setSelectedSession((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              participantsDetails: [...prev.participantsDetails],
            };
          });
        }
      }
    },
    [selectedSession]
  );

  const { connected, connectionState, sendMessage } = useWebSocket(
    "ws://localhost:3001/ws",
    {
      onMessage: handleWebSocketMessage,
    }
  );

  useEffect(() => {
    const fetchActiveSessions = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/sessions/active"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch active sessions");
        }
        const data = await response.json();
        setActiveSessions(data);
      } catch (error) {
        console.error("Error fetching active sessions:", error);
      }
    };

    fetchActiveSessions();
    // Fetch active sessions every 30 seconds
    const interval = setInterval(fetchActiveSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (connected && selectedSession) {
      sendMessage({
        type: "join_conversation",
        conversationId: selectedSession.id,
      });
    }
  }, [connected, selectedSession, sendMessage]);

  const handleJoinSession = useCallback(
    (session: Session) => {
      if (!connected || !address) return;

      // Send join session message via WebSocket
      sendMessage({
        type: "join_conversation",
        conversationId: session.id,
      });

      // Ensure participantsDetails is defined
      setSelectedSession({
        ...session,
        participantsDetails: session.participantsDetails || [],
      });
    },
    [connected, address, sendMessage]
  );

  const departmentMetrics = departments.map((dept) => ({
    name: dept.name,
    budget: dept.budget.allocated / 1000000,
    sessions: dept.assignedAgents.length,
  }));

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/departments");
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-light tracking-wider">
                    Live Sessions
                  </CardTitle>
                  <CardDescription>最近のセッション</CardDescription>
                </div>
                {connected ? (
                  <Badge
                    variant="outline"
                    className="border-green-400/30 bg-green-500/10 text-green-300"
                  >
                    Connected
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
                  >
                    Connecting...
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start justify-between rounded-lg border border-purple-500/10 bg-black/20 p-3 hover:bg-black/30 transition-colors cursor-pointer"
                      onClick={() => handleJoinSession(session)}
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
                              <span className="text-yellow-400">Emergency</span>
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
