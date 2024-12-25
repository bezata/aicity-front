"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  Activity,
  Cpu,
  Network,
  Workflow,
  Radio,
  Signal,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "./main-layout";
import { LoadingScreen } from "./loading-screen";

interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  messageJp: string;
  type: "info" | "warning" | "error" | "success";
}

interface AgentActivity {
  id: string;
  timestamp: string;
  type: "process" | "analyze" | "maintain" | "optimize" | "communicate";
  description: string;
  descriptionJp: string;
  location: string;
  locationJp: string;
  metrics: {
    cpuLoad: number;
    memoryUsage: number;
    networkLatency: number;
  };
  logs: LogEntry[];
}

interface Trait {
  analyticalThinking: number;
  creativity: number;
  empathy: number;
  curiosity: number;
  enthusiasm: number;
}

interface EmotionalRange {
  min: number;
  max: number;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  personality: string;
  systemPrompt: string;
  interests: string[];
  preferredStyle: string;
  traits: Trait;
  memoryWindowSize: number;
  emotionalRange: EmotionalRange;
}

interface AgentsResponse {
  custom: AIAgent[];
  city: AIAgent[];
  management: AIAgent[];
  resident: AIAgent[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface CCTVObservation {
  narrative: string;
  timestamp: number;
  location: string;
  metrics: Record<string, any>;
  area: string;
}

const generateProcessingActivities = (
  agentName: string,
  agentNameJp: string
) => [
  {
    message: `${agentName} is analyzing neural network patterns in sector 7-G`,
    messageJp: `${agentNameJp}はセクター7-Gのニューラルネットワークパターンを分析中`,
  },
  {
    message: `${agentName} is optimizing quantum pathways in the main core`,
    messageJp: `${agentNameJp}はメインコアの量子経路を最適化中`,
  },
  {
    message: `${agentName} detected anomaly in data stream, initiating deep scan`,
    messageJp: `${agentNameJp}がデータストリームの異常を検出し、ディープスキャンを開始`,
  },
  {
    message: `${agentName} is recalibrating synaptic connections in memory bank`,
    messageJp: `${agentNameJp}はメモリーバンクのシナプス接続を再調整中`,
  },
];

const generateMaintenanceActivities = (
  agentName: string,
  agentNameJp: string
) => [
  {
    message: `${agentName} is performing routine quantum circuit maintenance`,
    messageJp: `${agentNameJp}は定期的な量子回路のメンテナンスを実行中`,
  },
  {
    message: `${agentName} is upgrading neural processing units`,
    messageJp: `${agentNameJp}はニューラル処理ユニットをアップグレード中`,
  },
  {
    message: `${agentName} is debugging quantum entanglement protocols`,
    messageJp: `${agentNameJp}は量子もつれプロトコルをデバッグ中`,
  },
];

const generateCommunicationActivities = (
  agentName: string,
  agentNameJp: string
) => [
  {
    message: `${agentName} is synchronizing data with quantum mainframe`,
    messageJp: `${agentNameJp}は量子メインフレームとデータを同期中`,
  },
  {
    message: `${agentName} established secure quantum channel with remote nodes`,
    messageJp: `${agentNameJp}はリモートノードとの安全な量子チャネルを確立`,
  },
  {
    message: `${agentName} is transmitting encrypted neural patterns`,
    messageJp: `${agentNameJp}は暗号化されたニューラルパターンを送信中`,
  },
];

const getLogTypeColor = (type: LogEntry["type"]) => {
  switch (type) {
    case "info":
      return "text-blue-300";
    case "warning":
      return "text-yellow-300";
    case "error":
      return "text-red-300";
    case "success":
      return "text-green-300";
    default:
      return "text-purple-300";
  }
};

export function AgentCCTV() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [observation, setObservation] = useState<CCTVObservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check if we need to fetch new observation
  const shouldFetchNewObservation = (agentId: string) => {
    const cached = localStorage.getItem(`observation_${agentId}`);
    if (!cached) return true;

    const { timestamp } = JSON.parse(cached);
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    return timestamp < thirtyMinutesAgo;
  };

  // Fetch agents data
  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/agents");
        const data: AgentsResponse = await response.json();

        // Combine all agents and remove duplicates
        const allAgents = [
          ...data.custom,
          ...data.city,
          ...data.management,
          ...data.resident,
        ].filter(
          (agent, index, self) =>
            index === self.findIndex((a) => a.id === agent.id)
        ) as AIAgent[];

        setAgents(allAgents);
        if (allAgents.length > 0 && !selectedAgent) {
          setSelectedAgent(allAgents[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Fetch CCTV observation data
  const fetchObservation = async (agentId: string) => {
    try {
      // Check cache first
      const cached = localStorage.getItem(`observation_${agentId}`);
      if (cached) {
        const cachedData = JSON.parse(cached);
        if (!shouldFetchNewObservation(agentId)) {
          setObservation(cachedData);
          const newLog: LogEntry = {
            id: `log-${cachedData.timestamp}`,
            timestamp: new Date(cachedData.timestamp),
            message: cachedData.narrative,
            messageJp: `エリア: ${cachedData.area} - 場所: ${
              cachedData.location || "不明"
            }`,
            type: "info",
          };
          setLogs((prev) => [newLog, ...prev].slice(0, 50));
          return;
        }
      }

      // Fetch new observation if needed
      const response = await fetch(
        `http://localhost:3001/api/cctv/observe/${agentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data: ApiResponse<CCTVObservation> = await response.json();

      if (data.success) {
        // Store in localStorage with timestamp
        localStorage.setItem(
          `observation_${agentId}`,
          JSON.stringify({
            ...data.data,
            timestamp: Date.now(),
          })
        );

        setObservation(data.data);
        const newLog: LogEntry = {
          id: `log-${data.data.timestamp}`,
          timestamp: new Date(data.data.timestamp),
          message: data.data.narrative,
          messageJp: `エリア: ${data.data.area} - 場所: ${
            data.data.location || "不明"
          }`,
          type: "info",
        };
        setLogs((prev) => [newLog, ...prev].slice(0, 50));
      }
    } catch (error) {
      console.error("Error fetching CCTV observation:", error);
      setIsConnected(false);
    }
  };

  // Initial fetch and periodic check
  useEffect(() => {
    if (selectedAgent) {
      fetchObservation(selectedAgent.id);
    }
  }, [selectedAgent]);

  // Check connection status every 5 seconds
  useEffect(() => {
    if (!selectedAgent) return;

    const interval = setInterval(() => {
      const cached = localStorage.getItem(`observation_${selectedAgent.id}`);
      if (cached) {
        setIsConnected(true);
      } else {
        fetch(`http://localhost:3001/api/cctv/observe/${selectedAgent.id}`)
          .then(() => setIsConnected(true))
          .catch(() => setIsConnected(false));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedAgent]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <MainLayout>
      <Card className="border-purple-500/10 fixed inset-0 w-full h-full bg-black/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-light tracking-wider">
                Agent Surveillance System
              </CardTitle>
              <CardDescription>エージェント監視システム</CardDescription>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "animate-pulse",
                isConnected
                  ? "border-green-400/30 bg-green-500/10 text-green-300"
                  : "border-red-400/30 bg-red-500/10 text-red-300"
              )}
            >
              <Radio className="mr-2 h-3 w-3" />
              {isConnected ? "Connected" : "Reconnecting"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select
            value={selectedAgent?.id || ""}
            onValueChange={(value) => {
              const agent = agents.find((a) => a.id === value);
              if (agent) {
                setSelectedAgent(agent);
                setLogs([]); // Clear logs when switching agents
              }
            }}
          >
            <SelectTrigger className="border-purple-500/10 bg-black/20">
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent className="border-purple-500/10 bg-black/90 backdrop-blur-xl">
              {agents.map((agent) => (
                <SelectItem
                  key={agent.id}
                  value={agent.id}
                  className="text-purple-300 focus:bg-purple-500/10 focus:text-purple-200"
                >
                  <span className="flex items-center gap-2">
                    {agent.name}
                    <Badge
                      variant="outline"
                      className={cn(
                        "ml-2",
                        "border-purple-400/30 bg-purple-500/10 text-purple-300"
                      )}
                    >
                      {agent.role}
                    </Badge>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedAgent && (
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-purple-500/10 bg-black/40">
                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-scan" />
                </div>

                {/* CCTV content */}
                <div className="relative h-full p-6">
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <Signal className="h-4 w-4 text-purple-400 animate-pulse" />
                    <span className="text-sm text-purple-300/70">
                      LIVE FEED
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="space-y-4 rounded-lg border border-purple-500/10 bg-black/60 p-4 backdrop-blur-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-purple-300">
                            {selectedAgent.name}
                          </h3>
                          <p className="text-sm text-purple-300/70">
                            {selectedAgent.role}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                        >
                          {selectedAgent.personality}
                        </Badge>
                      </div>

                      {observation && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-400" />
                            <span className="text-sm text-purple-300">
                              {observation.narrative.slice(0, 600) +
                                (observation.narrative.length > 600
                                  ? "..."
                                  : "")}
                            </span>
                          </div>
                          <p className="text-sm text-purple-300/70">
                            Area: {observation.area} - Location:{" "}
                            {observation.location || "Unknown"}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-purple-300/50">
                            Analytical Thinking
                          </p>
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-400" />
                            <span className="text-sm font-medium text-purple-300">
                              {(
                                selectedAgent.traits.analyticalThinking * 100
                              ).toFixed(0)}
                              %
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-purple-300/50">Empathy</p>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-purple-400" />
                            <span className="text-sm font-medium text-purple-300">
                              {(selectedAgent.traits.empathy * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-purple-300/50">
                            Creativity
                          </p>
                          <div className="flex items-center gap-2">
                            <Workflow className="h-4 w-4 text-purple-400" />
                            <span className="text-sm font-medium text-purple-300">
                              {(selectedAgent.traits.creativity * 100).toFixed(
                                0
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-purple-300/50">Interests</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedAgent.interests.map((interest, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-purple-500/10 bg-black/40 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="h-4 w-4 text-purple-400" />
                  <h3 className="font-medium text-purple-300">Activity Log</h3>
                </div>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-300/50">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getLogTypeColor(log.type))}
                          >
                            {log.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-purple-300">{log.message}</p>
                        <p className="text-xs text-purple-300/70">
                          {log.messageJp}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
