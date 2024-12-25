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

interface AIAgent {
  id: string;
  name: string;
  nameJp: string;
  role: string;
  roleJp: string;
  status: "active" | "idle" | "maintenance";
  avatar: string;
  currentActivity: AgentActivity;
}

// Activity generation functions
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

const agents: AIAgent[] = [
  {
    id: "qa1",
    name: "Quantum Alpha",
    nameJp: "クァンタムアルファ",
    role: "Neural Network Architect",
    roleJp: "ニューラルネットワークアーキテクト",
    status: "active",
    avatar: "/placeholder.svg?height=100&width=100",
    currentActivity: {
      id: "act1",
      timestamp: new Date().toISOString(),
      type: "analyze",
      description: "Optimizing neural pathways in sector 7",
      descriptionJp: "セクター7のニューラルパスウェイを最適化",
      location: "Neural Core Chamber",
      locationJp: "ニューラルコアチャンバー",
      metrics: {
        cpuLoad: 87,
        memoryUsage: 92,
        networkLatency: 5,
      },
      logs: [],
    },
  },
  {
    id: "qb2",
    name: "Quantum Beta",
    nameJp: "クァンタムベータ",
    role: "Resource Distributor",
    roleJp: "リソースディストリビューター",
    status: "active",
    avatar: "/placeholder.svg?height=100&width=100",
    currentActivity: {
      id: "act2",
      timestamp: new Date().toISOString(),
      type: "process",
      description: "Balancing power distribution in district 3",
      descriptionJp: "地区3の電力分配を調整中",
      location: "Power Distribution Hub",
      locationJp: "電力分配ハブ",
      metrics: {
        cpuLoad: 65,
        memoryUsage: 78,
        networkLatency: 8,
      },
      logs: [],
    },
  },
  {
    id: "qg3",
    name: "Quantum Gamma",
    nameJp: "クァンタムガンマ",
    role: "System Maintainer",
    roleJp: "システムメンテナー",
    status: "maintenance",
    avatar: "/placeholder.svg?height=100&width=100",
    currentActivity: {
      id: "act3",
      timestamp: new Date().toISOString(),
      type: "maintain",
      description: "Performing quantum circuit maintenance",
      descriptionJp: "量子回路のメンテナンスを実行中",
      location: "Quantum Maintenance Bay",
      locationJp: "量子メンテナンスベイ",
      metrics: {
        cpuLoad: 45,
        memoryUsage: 62,
        networkLatency: 12,
      },
      logs: [],
    },
  },
];

const getActivityIcon = (type: AgentActivity["type"]) => {
  switch (type) {
    case "process":
      return Cpu;
    case "analyze":
      return Brain;
    case "maintain":
      return Activity;
    case "optimize":
      return Workflow;
    case "communicate":
      return Network;
    default:
      return Brain;
  }
};

const getStatusColor = (status: AIAgent["status"]) => {
  switch (status) {
    case "active":
      return "border-green-400/30 bg-green-500/10 text-green-300";
    case "idle":
      return "border-yellow-400/30 bg-yellow-500/10 text-yellow-300";
    case "maintenance":
      return "border-purple-400/30 bg-purple-500/10 text-purple-300";
    default:
      return "border-purple-400/30 bg-purple-500/10 text-purple-300";
  }
};

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
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(agents[0]);
  const [isConnected, setIsConnected] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Generate a new log entry
  const generateLog = (agent: AIAgent) => {
    const activities = [
      ...generateProcessingActivities(agent.name, agent.nameJp),
      ...generateMaintenanceActivities(agent.name, agent.nameJp),
      ...generateCommunicationActivities(agent.name, agent.nameJp),
    ];

    const activity = activities[Math.floor(Math.random() * activities.length)];
    const types: LogEntry["type"][] = ["info", "warning", "success"];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      message: activity.message,
      messageJp: activity.messageJp,
      type,
    };
  };

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = generateLog(selectedAgent);
      setLogs((prev) => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs

      // Update agent metrics
      const variation = Math.random() * 10 - 5; // -5 to +5
      selectedAgent.currentActivity.metrics.cpuLoad = Math.min(
        100,
        Math.max(0, selectedAgent.currentActivity.metrics.cpuLoad + variation)
      );
      selectedAgent.currentActivity.metrics.memoryUsage = Math.min(
        100,
        Math.max(
          0,
          selectedAgent.currentActivity.metrics.memoryUsage + variation
        )
      );
      selectedAgent.currentActivity.metrics.networkLatency = Math.min(
        100,
        Math.max(
          1,
          selectedAgent.currentActivity.metrics.networkLatency + variation / 2
        )
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedAgent]);

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            value={selectedAgent.id}
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
                      className={cn("ml-2", getStatusColor(agent.status))}
                    >
                      {agent.status}
                    </Badge>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
                  <span className="text-sm text-purple-300/70">LIVE FEED</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="space-y-4 rounded-lg border border-purple-500/10 bg-black/60 p-4 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-purple-300">
                          {selectedAgent.name}
                        </h3>
                        <p className="text-sm text-purple-300/70">
                          {selectedAgent.nameJp}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={getStatusColor(selectedAgent.status)}
                      >
                        {selectedAgent.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {/* @ts-ignore */}
                        {React.createElement(
                          getActivityIcon(selectedAgent.currentActivity.type),
                          {
                            className: "h-4 w-4 text-purple-400",
                          }
                        )}
                        <span className="text-sm text-purple-300">
                          {selectedAgent.currentActivity.description}
                        </span>
                      </div>
                      <p className="text-sm text-purple-300/70">
                        {selectedAgent.currentActivity.descriptionJp}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-purple-300/50">CPU Load</p>
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium text-purple-300">
                            {Math.round(
                              selectedAgent.currentActivity.metrics.cpuLoad
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-purple-300/50">Memory</p>
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium text-purple-300">
                            {Math.round(
                              selectedAgent.currentActivity.metrics.memoryUsage
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-purple-300/50">Latency</p>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium text-purple-300">
                            {Math.round(
                              selectedAgent.currentActivity.metrics
                                .networkLatency
                            )}
                            ms
                          </span>
                        </div>
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
        </CardContent>
      </Card>
    </MainLayout>
  );
}
