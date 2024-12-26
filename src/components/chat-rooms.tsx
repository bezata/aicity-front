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
import { DistrictNavigation } from "./district-navigation";
import { useWebSocket } from "@/hooks/useWebSocket";

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

interface ConversationResponse {
  id: string;
  messages: {
    id: string;
    agentId: string;
    content: string;
    timestamp: number;
    role: string;
    sentiment?: number;
  }[];
  participants: {
    id: string;
    name: string;
    role: string;
    personality: string;
    interests: string[];
  }[];
  activity: string;
  location: string;
  topic: string;
  status: string;
  lastUpdateTime: number;
  isEnded: boolean;
}

export function ChatRooms() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [donationProjects, setDonationProjects] = useState<DonationGoal[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const handleWebSocketMessage = useCallback((wsMessage: WSMessage | any) => {
    // Handle agent conversations
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
    }
    // Handle system messages
    else if (wsMessage.type === "system_message") {
      const newMessage: Message = {
        id: wsMessage.timestamp.toString(),
        sender: {
          name: "System",
          nameJp: "システム",
          type: "system",
        },
        content: wsMessage.data.content,
        timestamp: new Date(wsMessage.timestamp).toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
    }

    // Scroll to bottom after any new message
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const { connected, connectionState, connectionQuality, sendMessage } =
    useWebSocket("ws://localhost:3001/ws", {
      onMessage: handleWebSocketMessage,
    });

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

  const fetchConversationHistory = useCallback(
    async (conversationId: string) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/conversations/${conversationId}`
        );
        if (!response.ok) {
          if (response.status === 500) {
            console.log(
              "Server error when fetching conversation, will retry later"
            );
            return; // Don't throw error, just return
          }
          throw new Error(
            `Failed to fetch conversation: ${response.statusText}`
          );
        }
        const data: ConversationResponse = await response.json();

        // Transform messages to match our Message interface
        const transformedMessages = data.messages.map((msg) => ({
          id: msg.id,
          sender: {
            name:
              data.participants.find((p) => p.id === msg.agentId)?.name ||
              msg.agentId,
            nameJp:
              data.participants.find((p) => p.id === msg.agentId)?.role || "",
            type: (msg.role === "assistant" ? "ai" : "user") as
              | "user"
              | "ai"
              | "system",
            role: data.participants.find((p) => p.id === msg.agentId)?.role,
            level: 95,
          },
          content: msg.content,
          timestamp: new Date(msg.timestamp).toISOString(),
          location: data.location,
          activity: data.activity,
          topic: data.topic,
        }));

        setMessages(transformedMessages);
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching conversation history:", error);
      }
    },
    []
  );

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000;

    const fetchConversations = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/conversations");
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data: ConversationResponse[] = await response.json();

        const activeConv = data.find(
          (conv) => conv.status === "active" && !conv.isEnded
        );
        if (activeConv) {
          setCurrentConversation(activeConv.id);
          if (connected) {
            sendMessage({
              type: "join_conversation",
              conversationId: activeConv.id,
            });
            await fetchConversationHistory(activeConv.id);
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchConversations, retryDelay * retryCount);
        }
      }
    };

    fetchConversations();
  }, [connected, sendMessage, fetchConversationHistory]);

  const handleSend = useCallback(() => {
    if (!input.trim() || !connected) return;

    // Find the latest message to get current conversation context
    const latestMessage = messages[messages.length - 1];

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: {
        name: "Observer",
        nameJp: "オブザーバー",
        type: "user",
      },
      content: input.trim(),
      timestamp: new Date().toISOString(),
      // Use the latest conversation context for user messages
      location: latestMessage?.location,
      activity: latestMessage?.activity,
      topic: latestMessage?.topic,
    };

    // Update UI first
    setMessages((prev) => [...prev, newMessage]);

    // Send the correctly formatted message
    sendMessage({
      type: "user_message",
      conversationId: currentConversation,
      content: input.trim(),
    });

    setInput("");
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [input, currentConversation, connected, sendMessage, messages]);

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
              Downtown District Chat
            </h1>
            <p className="font-light tracking-widest text-purple-400/70">
              ディノワールドチャット
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
              {connectionState === "connecting"
                ? "Connecting"
                : connectionState === "connected"
                ? "Connected"
                : connectionState === "failed"
                ? "Failed"
                : "Disconnected"}
            </Badge>
            {connectionQuality < 100 && (
              <Badge
                variant="outline"
                className="border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
              >
                Quality: {connectionQuality}%
              </Badge>
            )}
            <Badge
              variant="outline"
              className="border-purple-400/30 bg-purple-500/10 text-purple-300"
            >
              +3 Active Entities
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
                        "relative max-w-[80%] overflow-hidden rounded-lg p-4 bg-purple-500/10 text-purple-300",
                        message.sender.type === "user" && "ml-auto"
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {message.sender.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                          >
                            {message.sender.type === "ai"
                              ? "Neurova Resident"
                              : "Observer"}
                          </Badge>
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
            <DistrictNavigation />
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
                            (project.currentAmount / project.targetAmount) * 100
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
                        <span>{project.currentAmount.toLocaleString()} CR</span>
                        <span>{project.targetAmount.toLocaleString()} CR</span>
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
        </ScrollArea>
      </div>
    </div>
  );
}
