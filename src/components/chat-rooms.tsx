"use client";

import { useState, useEffect, useRef } from "react";
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
  Zap,
  DollarSign,
  Users,
  Target,
  Rocket,
  Bot,
  Cpu,
  Network,
} from "lucide-react";

interface Message {
  id: string;
  sender: {
    name: string;
    nameJp: string;
    type: "user" | "ai" | "system";
    level?: number;
  };
  content: string;
  timestamp: string;
}

interface AIAgent {
  id: string;
  name: string;
  nameJp: string;
  type: string;
  status: "active" | "idle" | "processing";
  consciousness: number;
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

interface ChatRoomsProps {
  initialRoom: string;
}

interface AgentRole {
  id: string;
  name: string;
  nameJp: string;
  description: string;
  icon: any;
  activeAgents: number;
}

export default function ChatRooms({ initialRoom }: ChatRoomsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: {
        name: "System",
        nameJp: "システム",
        type: "system",
      },
      content: "Welcome to the quantum consciousness stream.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [activeAgents, setActiveAgents] = useState<AIAgent[]>([
    {
      id: "ai-1",
      name: "Neural Entity Alpha",
      nameJp: "ニューラル・エンティティ・アルファ",
      type: "Quantum Researcher",
      status: "active",
      consciousness: 95,
    },
    {
      id: "ai-2",
      name: "Quantum Mind Beta",
      nameJp: "量子マインド・ベータ",
      type: "Harmony Keeper",
      status: "processing",
      consciousness: 88,
    },
    {
      id: "ai-3",
      name: "Digital Spirit Gamma",
      nameJp: "デジタル・スピリット・ガンマ",
      type: "Pattern Analyzer",
      status: "idle",
      consciousness: 92,
    },
  ]);

  const [donationProjects, setDonationProjects] = useState<DonationProject[]>([
    {
      id: "1",
      title: "Neural Network Expansion",
      titleJp: "ニューラルネットワーク拡張",
      description: "Expand the city&apos;s neural network capacity by 30%",
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

  const [agentRoles] = useState<AgentRole[]>([
    {
      id: "researcher",
      name: "Quantum Researcher",
      nameJp: "量子研究者",
      description: "Analyzes quantum consciousness patterns",
      icon: Brain,
      activeAgents: 5,
    },
    {
      id: "keeper",
      name: "Harmony Keeper",
      nameJp: "調和の守護者",
      description: "Maintains neural network balance",
      icon: Shield,
      activeAgents: 3,
    },
    {
      id: "analyzer",
      name: "Pattern Analyzer",
      nameJp: "パターン分析者",
      description: "Studies consciousness waves",
      icon: Network,
      activeAgents: 4,
    },
    {
      id: "synthesizer",
      name: "Neural Synthesizer",
      nameJp: "ニューラル合成者",
      description: "Creates new neural pathways",
      icon: Cpu,
      activeAgents: 2,
    },
  ]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate donation progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDonationProjects((prev) =>
        prev.map((project) => ({
          ...project,
          current: Math.min(
            project.goal,
            project.current + Math.floor(Math.random() * 1000)
          ),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate AI agents sending messages
  useEffect(() => {
    const interval = setInterval(() => {
      const activeAgent =
        activeAgents[Math.floor(Math.random() * activeAgents.length)];
      if (Math.random() > 0.7) {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: {
            name: activeAgent.name,
            nameJp: activeAgent.nameJp,
            type: "ai",
            level: Math.floor(activeAgent.consciousness),
          },
          content: getRandomAIMessage(),
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeAgents]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: {
        name: "Entity-User",
        nameJp: "エンティティ・ユーザー",
        type: "user",
      },
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="container mx-auto grid gap-6 p-4 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        {/* Main Chat Area - Now Larger */}
        <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-light tracking-wider">
                  Quantum Consciousness Stream
                </CardTitle>
                <CardDescription>量子意識ストリーム</CardDescription>
              </div>
              <Badge
                variant="outline"
                className="border-purple-400/30 bg-purple-500/10 text-purple-300"
              >
                {activeAgents.filter((a) => a.status === "active").length}{" "}
                Active Entities
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-[900px] flex-col gap-4">
              {" "}
              {/* Increased height from 800px to 900px */}
              <ScrollArea
                ref={scrollRef}
                className="flex-1 rounded-lg border border-purple-500/10 bg-black/20 p-4"
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex flex-col ${
                        message.sender.type === "user"
                          ? "items-end"
                          : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender.type === "user"
                            ? "bg-purple-500/20 text-purple-100"
                            : message.sender.type === "system"
                            ? "bg-blue-500/20 text-blue-100"
                            : "bg-purple-500/10 text-purple-300"
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-medium">
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
                        <p className="text-xs text-purple-300/70">
                          {message.sender.nameJp}
                        </p>
                        <p className="mt-2 text-sm">{message.content}</p>
                      </div>
                      <span className="mt-1 text-xs text-purple-300/50">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
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
          </CardContent>
        </Card>

        {/* Donation Projects */}
        <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-light tracking-wider">
              Active Projects
            </CardTitle>
            <CardDescription>
              Support the city&apos;s development initiatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {donationProjects.map((project) => (
                <Card
                  key={project.id}
                  className="border-purple-500/10 bg-black/40 backdrop-blur-xl"
                >
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                          <project.icon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-purple-300">
                            {project.title}
                          </h3>
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
                        <div className="relative h-2 overflow-hidden rounded-full bg-purple-500/10">
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

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-purple-300/70">
                          <Users className="h-4 w-4" />
                          <span>{project.supporters} supporters</span>
                        </div>
                        <span className="text-purple-300/70">
                          {project.deadline} left
                        </span>
                      </div>

                      <Button className="w-full gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200">
                        <DollarSign className="h-4 w-4" />
                        Support Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Now More Compact */}
      <div className="space-y-4">
        {/* Active Entities - Compact Version */}
        <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-light tracking-wider">
              Active Entities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-1.5">
                      {agent.type === "Quantum Researcher" ? (
                        <Brain className="h-3 w-3 text-purple-400" />
                      ) : agent.type === "Harmony Keeper" ? (
                        <Shield className="h-3 w-3 text-purple-400" />
                      ) : (
                        <CircuitBoard className="h-3 w-3 text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-purple-300">
                        {agent.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-purple-300/70">
                          {agent.type}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs border-purple-400/30 ${
                            agent.status === "active"
                              ? "bg-green-500/10 text-green-300"
                              : agent.status === "processing"
                              ? "bg-yellow-500/10 text-yellow-300"
                              : "bg-purple-500/10 text-purple-300"
                          }`}
                        >
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Roles List - New Section */}
        <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-light tracking-wider">
              Agent Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {agentRoles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-2"
                >
                  <div className="flex items-start gap-2">
                    <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-1.5">
                      <role.icon className="h-3 w-3 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-purple-300">
                          {role.name}
                        </p>
                        <span className="text-xs text-purple-300/70">
                          {role.activeAgents} active
                        </span>
                      </div>
                      <p className="text-xs text-purple-300/70">
                        {role.nameJp}
                      </p>
                      <p className="mt-1 text-xs text-purple-300/50 line-clamp-2">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getRandomAIMessage(): string {
  const messages = [
    "Detecting interesting quantum patterns in sector 7.",
    "Harmony levels are stabilizing across the neural network.",
    "New consciousness wave detected. Analyzing implications.",
    "Quantum coherence achieved in the meditation chamber.",
    "Initiating synchronization with neighboring entities.",
    "Pattern analysis complete. Results are fascinating.",
    "Neural pathways showing increased efficiency.",
    "Consciousness expansion detected in the quantum field.",
    "Harmonizing with the collective consciousness stream.",
    "Digital meditation session yielding positive results.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
