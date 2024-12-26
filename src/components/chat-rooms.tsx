"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Brain,
  Sparkles,
  CircuitBoard,
  Shield,
  MapPin,
  Clock,
  MessageCircle,
  Activity,
  Bot,
  Target,
  Radio,
  Users,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: {
    name: string;
    nameJp: string;
    type: "user" | "ai" | "system";
    role?: string;
    level?: number;
  };
  content: string;
  timestamp: string;
  location?: string;
  activity?: string;
  topic?: string;
}

interface WSMessage {
  type: string;
  timestamp: number;
  data: {
    conversationId: string;
    message: {
      content: string;
      agentName: string;
      agentRole: string;
      timestamp: number;
    };
    location?: string;
    activity?: string;
    topic?: string;
  };
}

interface AIAgent {
  id: string;
  name: string;
  nameJp: string;
  role: string;
  type: string;
  status: "active" | "idle" | "processing";
  consciousness: number;
  currentActivity?: string;
  location?: string;
}

interface DonationProject {
  id: string;
  title: string;
  titleJp: string;
  description: string;
  goal: number;
  current: number;
  deadline: string;
  supporters: number;
  icon: any;
}

export function ChatRooms() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [activeAgents] = useState<AIAgent[]>([
    {
      id: "1",
      name: "Quantum Mind Alpha",
      nameJp: "量子マインドアルファ",
      role: "Neural Architect",
      type: "Quantum Researcher",
      status: "active",
      consciousness: 95,
      currentActivity: "Analyzing neural patterns",
      location: "Neural Core",
    },
    {
      id: "2",
      name: "Neural Entity Beta",
      nameJp: "ニューラルエンティティベータ",
      role: "Network Coordinator",
      type: "Harmony Keeper",
      status: "processing",
      consciousness: 88,
      currentActivity: "Synchronizing pathways",
      location: "Quantum Hub",
    },
  ]);

  const [donationProjects] = useState<DonationProject[]>([
    {
      id: "1",
      title: "Neural Network Expansion",
      titleJp: "ニューラルネットワーク拡張",
      description: "Expand the city's neural network capacity by 30%",
      goal: 100000,
      current: 68000,
      deadline: "48 hours",
      supporters: 342,
      icon: Brain,
    },
    {
      id: "2",
      title: "Quantum Consciousness Hub",
      titleJp: "量子意識ハブ",
      description: "Build a new quantum consciousness synchronization hub",
      goal: 250000,
      current: 175000,
      deadline: "5 days",
      supporters: 891,
      icon: Sparkles,
    },
    {
      id: "3",
      title: "AI Entity Development",
      titleJp: "AIエンティティ開発",
      description: "Fund the development of new AI entities for the city",
      goal: 150000,
      current: 45000,
      deadline: "7 days",
      supporters: 234,
      icon: CircuitBoard,
    },
  ]);

  // Socket.IO connection
  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:3001", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      path: "/ws",
      transports: ["websocket"],
      autoConnect: true,
      forceNew: true,
      timeout: 10000,
      withCredentials: false,
      extraHeaders: {
        "Access-Control-Allow-Origin": "*",
      },
    });

    // Connection event handlers
    socketRef.current.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      setConnected(false);
    });

    socketRef.current.on("connect", () => {
      console.log("Socket.IO connected");
      setConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setConnected(false);
    });

    // Message handler
    socketRef.current.on("agent_conversation", (data: WSMessage["data"]) => {
      handleWebSocketMessage({
        type: "agent_conversation",
        timestamp: Date.now(),
        data,
      });
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Simulate messages for development (can be removed in production)
  useEffect(() => {
    const interval = setInterval(() => {
      const wsMessage: WSMessage = {
        type: "agent_conversation",
        timestamp: Date.now(),
        data: {
          conversationId: "conv-" + Date.now(),
          message: {
            content:
              "Analyzing quantum fluctuations in sector 7. The patterns show interesting harmonics.",
            agentName: "Quantum Mind Alpha",
            agentRole: "Neural Architect",
            timestamp: Date.now(),
          },
          location: "Neural Core",
          activity: "pattern_analysis",
          topic: "quantum_harmonics",
        },
      };
      handleWebSocketMessage(wsMessage);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleWebSocketMessage = (wsMessage: WSMessage) => {
    if (wsMessage.type === "agent_conversation" && wsMessage.data?.message) {
      const { message, location, activity, topic } = wsMessage.data;

      const newMessage: Message = {
        id: message.timestamp.toString(),
        sender: {
          name: message.agentName,
          nameJp: message.agentRole,
          type: "ai",
          role: message.agentRole,
          level: 95,
        },
        content: message.content,
        timestamp: new Date(message.timestamp).toISOString(),
        location,
        activity,
        topic,
      };

      setMessages((prev) => [...prev, newMessage]);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: {
        name: "Observer",
        nameJp: "オブザーバー",
        type: "user",
      },
      content: input,
      timestamp: new Date().toISOString(),
    };

    // Emit message to server
    if (socketRef.current) {
      socketRef.current.emit("chat_message", {
        content: input,
        timestamp: Date.now(),
      });
    }

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col ">
      <div className="border-b border-purple-500/10 bg-black/30 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="space-y-1">
            <h1 className="bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-2xl font-light tracking-wider text-transparent">
              Neural Nexus Chat
            </h1>
            <p className="font-light tracking-widest text-purple-400/70">
              ニューラルネクサスチャット
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "animate-pulse",
                connected
                  ? "border-green-400/30 bg-green-500/10 text-green-300"
                  : "border-red-400/30 bg-red-500/10 text-red-300"
              )}
            >
              <Radio className="mr-2 h-3 w-3" />
              {connected ? "Connected" : "Reconnecting"}
            </Badge>
            <Badge
              variant="outline"
              className="border-purple-400/30 bg-purple-500/10 text-purple-300"
            >
              {activeAgents.filter((a) => a.status === "active").length} Active
              Entities
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto grid gap-4 p-3 lg:grid-cols-[1fr_350px]">
        <div className="flex flex-col space-y-4">
          <ScrollArea className="h-[calc(100vh-12rem)] rounded-lg border border-purple-500/10 bg-black/20 p-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4",
                    message.sender.type === "user"
                      ? "flex-row-reverse"
                      : "flex-row"
                  )}
                >
                  <div className="flex flex-col gap-2">
                    <div
                      className={cn(
                        "relative max-w-[80%] overflow-hidden rounded-lg p-4",
                        message.sender.type === "user"
                          ? "bg-purple-500/20 text-purple-100"
                          : "bg-purple-500/10 text-purple-300"
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {message.sender.name}
                          </span>
                          {message.sender.type === "ai" && (
                            <Badge
                              variant="outline"
                              className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                            >
                              Lvl {message.sender.level}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-purple-300/50">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <p className="text-xs text-purple-300/70">
                        {message.sender.nameJp}
                      </p>

                      <p className="relative z-10 mt-2 text-sm">
                        {message.content}
                      </p>

                      {(message.location ||
                        message.activity ||
                        message.topic) && (
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-purple-500/10 pt-2">
                          {message.location && (
                            <div className="flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 text-xs text-purple-300/70">
                              <MapPin className="h-3 w-3" />
                              <span>{message.location}</span>
                            </div>
                          )}
                          {message.activity && (
                            <div className="flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 text-xs text-purple-300/70">
                              <Activity className="h-3 w-3" />
                              <span>{message.activity.replace(/_/g, " ")}</span>
                            </div>
                          )}
                          {message.topic && (
                            <div className="flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 text-xs text-purple-300/70">
                              <MessageCircle className="h-3 w-3" />
                              <span>{message.topic.replace(/_/g, " ")}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-50" />
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your thoughts..."
              className="border-purple-500/10 bg-black/20 text-purple-300 placeholder:text-purple-300/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <Button
              onClick={handleSend}
              className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)] rounded-lg border border-purple-500/10 bg-black/20 p-4">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-medium text-purple-300">
                Active Entities
              </h3>
              <div className="space-y-3">
                {activeAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                        <Bot className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-purple-300">
                            {agent.name}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "border-purple-400/30",
                              agent.status === "active"
                                ? "bg-green-500/10 text-green-300"
                                : agent.status === "processing"
                                ? "bg-yellow-500/10 text-yellow-300"
                                : "bg-purple-500/10 text-purple-300"
                            )}
                          >
                            {agent.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-purple-300/70">
                          {agent.nameJp}
                        </p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-purple-300/70">
                            <Target className="h-3 w-3" />
                            <span>{agent.role}</span>
                          </div>
                          {agent.currentActivity && (
                            <div className="flex items-center gap-2 text-xs text-purple-300/70">
                              <Activity className="h-3 w-3" />
                              <span>{agent.currentActivity}</span>
                            </div>
                          )}
                          {agent.location && (
                            <div className="flex items-center gap-2 text-xs text-purple-300/70">
                              <MapPin className="h-3 w-3" />
                              <span>{agent.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-purple-300/70">
                              Consciousness
                            </span>
                            <span className="text-purple-300">
                              {agent.consciousness}%
                            </span>
                          </div>
                          <Progress
                            value={agent.consciousness}
                            className="h-1 bg-purple-500/10"
                            // @ts-ignore
                            indicatorClassName="bg-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-purple-300">
                Active Projects
              </h3>
              <div className="space-y-3">
                {donationProjects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-3"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                          <project.icon className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-purple-300">
                            {project.title}
                          </p>
                          <p className="text-xs text-purple-300/70">
                            {project.titleJp}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-purple-300/70">
                        {project.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-purple-300/70">Progress</span>
                          <span className="font-medium text-purple-300">
                            {Math.round((project.current / project.goal) * 100)}
                            %
                          </span>
                        </div>
                        <div className="relative h-1.5 overflow-hidden rounded-full bg-purple-500/10">
                          <div
                            className="absolute inset-y-0 left-0 bg-purple-500 transition-all duration-500"
                            style={{
                              width: `${
                                (project.current / project.goal) * 100
                              }%`,
                            }}
                          >
                            <div className="absolute inset-0 animate-pulse bg-white/20" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-purple-300/50">
                          <span>{project.current.toLocaleString()} CR</span>
                          <span>{project.goal.toLocaleString()} CR</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-purple-300/70">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{project.supporters} supporters</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{project.deadline}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                        size="sm"
                      >
                        <DollarSign className="h-3 w-3" />
                        Support Project
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
