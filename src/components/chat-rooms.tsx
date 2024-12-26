"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import React from "react";
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
  GraduationCap,
  Leaf,
  Heart,
  Palette,
  Construction,
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

interface CelebrationEvent {
  title: string;
  description: string;
  duration: number;
  category: string;
  impact: {
    social: number;
    economic: number;
    cultural: number;
    environmental: number;
  };
}

interface DonationGoal {
  id: string;
  departmentId: string;
  targetAmount: number;
  currentAmount: number;
  title: string;
  description: string;
  celebrationEvent: CelebrationEvent;
}

export function ChatRooms() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [donationProjects, setDonationProjects] = useState<DonationGoal[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null
  );
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000;
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

  // Fetch donation goals
  useEffect(() => {
    const fetchDonationGoals = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/donations/goals"
        );
        const data = await response.json();
        setDonationProjects(data);
      } catch (error) {
        console.error("Error fetching donation goals:", error);
      }
    };

    fetchDonationGoals();
    const interval = setInterval(fetchDonationGoals, 30000);
    return () => clearInterval(interval);
  }, []);

  const connectWebSocket = useCallback(() => {
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      reconnectAttempt >= maxReconnectAttempts
    )
      return;

    try {
      wsRef.current = new WebSocket("ws://localhost:3001/ws");

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setConnected(true);
        setReconnectAttempt(0);

        // Join conversation if exists
        if (currentConversation) {
          wsRef.current?.send(
            JSON.stringify({
              type: "join_conversation",
              conversationId: currentConversation,
            })
          );
        }
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setConnected(false);
        handleReconnect();
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        handleReconnect();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "agent_conversation") {
            if (!currentConversation) {
              setCurrentConversation(data.data.conversationId);
              wsRef.current?.send(
                JSON.stringify({
                  type: "join_conversation",
                  conversationId: data.data.conversationId,
                })
              );
            }

            if (currentConversation === data.data.conversationId) {
              handleWebSocketMessage(data);
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      handleReconnect();
    }
  }, [currentConversation, reconnectAttempt]);

  const handleReconnect = useCallback(() => {
    if (reconnectAttempt >= maxReconnectAttempts) {
      console.log("Max reconnection attempts reached");
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectAttempt((prev) => prev + 1);
      connectWebSocket();
    }, reconnectDelay * Math.pow(2, reconnectAttempt));
  }, [reconnectAttempt, connectWebSocket]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const handleWebSocketMessage = useCallback((wsMessage: WSMessage) => {
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
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || wsRef.current?.readyState !== WebSocket.OPEN) return;

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

    wsRef.current.send(
      JSON.stringify({
        type: "chat_message",
        conversationId: currentConversation,
        content: input,
        timestamp: Date.now(),
      })
    );

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [input, currentConversation]);

  const getEventTypeIcon = (departmentId: string) => {
    switch (departmentId) {
      case "education":
        return GraduationCap;
      case "parks":
        return Leaf;
      case "health":
        return Heart;
      case "culture":
        return Palette;
      case "infrastructure":
        return Construction;
      default:
        return Activity;
    }
  };

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
      return `${minutes}m`;
    }
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  };

  const getImpactScore = (impact: CelebrationEvent["impact"]) => {
    return Math.round(
      ((impact.social +
        impact.economic +
        impact.cultural +
        impact.environmental) /
        4) *
        100
    );
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
                          {React.createElement(
                            getEventTypeIcon(project.departmentId),
                            {
                              className: "h-4 w-4 text-purple-400",
                            }
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-purple-300">
                            {project.title}
                          </p>
                          <p className="text-xs text-purple-300/70">
                            {project.celebrationEvent.title}
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
                            {Math.round(
                              (project.currentAmount / project.targetAmount) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="relative h-1.5 overflow-hidden rounded-full bg-purple-500/10">
                          <div
                            className="absolute inset-y-0 left-0 bg-purple-500 transition-all duration-500"
                            style={{
                              width: `${
                                (project.currentAmount / project.targetAmount) *
                                100
                              }%`,
                            }}
                          >
                            <div className="absolute inset-0 animate-pulse bg-white/20" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-purple-300/50">
                          <span>
                            {project.currentAmount.toLocaleString()} CR
                          </span>
                          <span>
                            {project.targetAmount.toLocaleString()} CR
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-purple-300/70">
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          <span>
                            Impact:{" "}
                            {getImpactScore(project.celebrationEvent.impact)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDuration(project.celebrationEvent.duration)}
                          </span>
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
