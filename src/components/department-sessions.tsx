"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  Clock,
  Brain,
  MessageCircle,
  Activity,
  History,
  Send,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface Participant {
  id: string;
  name: string;
  nameJp: string;
  role: string;
  avatar?: string;
  isAgent?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface Session {
  sessionId: string;
  topic: string;
  participants: string[];
  scheduledTime: number;
  category: "development" | "research" | "planning" | "review";
  status: "live" | "scheduled" | "completed";
  description?: string;
  messages: Message[];
}

interface CollaborationSession {
  id: string;
  status: "completed" | "active" | "scheduled";
  agents: {
    id: string;
    participationScore: number;
  }[];
  messages: {
    agentId: string;
    content: string;
    timestamp: number;
    topics: string[];
  }[];
  decisions: {
    description: string;
    proposedBy: string;
    supportedBy: string[];
    priority: number;
    impact: {
      environmental: number;
      social: number;
      economic: number;
    };
    implementation: {
      steps: string[];
      timeline: number;
      resources: string[];
    };
    status: string;
    timestamp: number;
  }[];
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

interface CollaborationHistory {
  sessionId: string;
  topic?: string;
  participants: string[];
  timestamp: string;
  metrics: {
    consensusLevel: number;
    participation: number;
    effectiveness: number;
  };
}

export function DepartmentSessions() {
  const params = useParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [collaborationHistory, setCollaborationHistory] = useState<
    CollaborationHistory[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser] = useState<Participant>({
    id: "user1",
    name: "Human Observer",
    nameJp: "ヒューマンオブザーバー",
    role: "Session Participant",
    avatar: "/placeholder.svg?height=32&width=32",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch scheduled collaborations
        const sessionsResponse = await fetch(
          `http://localhost:3001/api/departments/${params.id}/scheduled-collaborations`
        );
        if (!sessionsResponse.ok) {
          throw new Error(
            `Failed to fetch sessions: ${sessionsResponse.statusText}`
          );
        }
        const sessionsData = await sessionsResponse.json();

        // Fetch collaboration history
        const historyResponse = await fetch(
          `http://localhost:3001/api/departments/${params.id}/collaboration-history`
        );
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setCollaborationHistory(
            historyData.filter(
              (item: CollaborationHistory) =>
                item.sessionId && item.topic && item.participants.length > 0
            )
          );
        }

        // Process sessions and fetch completed session details
        const sessionsWithMessages = await Promise.all(
          sessionsData.map(async (session: Session) => {
            if (session.status === "completed") {
              try {
                const collabResponse = await fetch(
                  `http://localhost:3001/api/collaborations/${session.sessionId}`
                );
                if (collabResponse.ok) {
                  const collabData = await collabResponse.json();
                  return {
                    ...session,
                    messages: collabData.data.messages.map((msg: any) => ({
                      id: `msg-${msg.timestamp}`,
                      senderId: msg.agentId,
                      content: msg.content,
                      timestamp: new Date(msg.timestamp).toISOString(),
                    })),
                  };
                }
              } catch (error) {
                console.error("Error fetching collaboration:", error);
              }
            }
            return { ...session, messages: [] };
          })
        );
        setSessions(sessionsWithMessages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  const getSessionTypeIcon = (type: Session["category"]) => {
    switch (type) {
      case "research":
        return Brain;
      case "development":
        return Activity;
      case "planning":
        return Calendar;
      case "review":
        return History;
      default:
        return Brain;
    }
  };

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "live":
        return "border-green-400/30 bg-green-500/10 text-green-300";
      case "scheduled":
        return "border-blue-400/30 bg-blue-500/10 text-blue-300";
      case "completed":
        return "border-purple-400/30 bg-purple-500/10 text-purple-300";
      default:
        return "border-purple-400/30 bg-purple-500/10 text-purple-300";
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeSession) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      content: newMessage,
      timestamp: "Just now",
    };

    const updatedSessions = sessions.map((session) => {
      if (session.sessionId === activeSession.sessionId) {
        return {
          ...session,
          messages: [...session.messages, message],
        };
      }
      return session;
    });

    const updatedActiveSession = updatedSessions.find(
      (s) => s.sessionId === activeSession.sessionId
    );
    if (updatedActiveSession) {
      setActiveSession(updatedActiveSession);
    }

    setNewMessage("");
  };

  const joinSession = (session: Session) => {
    if (session.participants.some((p) => p === currentUser.id)) return;

    const updatedSession = {
      ...session,
      participants: [...session.participants, currentUser.id],
    };

    setActiveSession(updatedSession);
  };

  return (
    <>
      <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-light tracking-wider">
                Collaboration Sessions
              </CardTitle>
              <CardDescription>コラボレーションセッション</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="border-green-400/30 bg-green-500/10 text-green-300"
              >
                {sessions.filter((s) => s.status === "live").length} Live
                Sessions
              </Badge>
              <Badge
                variant="outline"
                className="border-purple-400/30 bg-purple-500/10 text-purple-300"
              >
                {collaborationHistory.length} Past Sessions
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-black/20">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">History</TabsTrigger>
            </TabsList>

            <TabsContent value="completed">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {collaborationHistory.map((collab) => (
                    <Card
                      key={collab.sessionId}
                      className="border-purple-500/10 bg-black/40"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                                <History className="h-4 w-4 text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-purple-300">
                                  {collab.topic}
                                </h3>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                            >
                              Completed
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-purple-300/70">
                              <Clock className="h-4 w-4" />
                              <span>
                                {new Date(
                                  parseInt(collab.timestamp)
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-purple-300/70">
                              <Users className="h-4 w-4" />
                              <span>
                                {collab.participants.length} Participants
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <p className="text-xs text-purple-300/70">
                                Consensus
                              </p>
                              <Progress
                                value={collab.metrics.consensusLevel * 100}
                                className="h-1"
                              />
                              <p className="text-xs text-right text-purple-300">
                                {Math.round(
                                  collab.metrics.consensusLevel * 100
                                )}
                                %
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-purple-300/70">
                                Participation
                              </p>
                              <Progress
                                value={collab.metrics.participation * 100}
                                className="h-1"
                              />
                              <p className="text-xs text-right text-purple-300">
                                {Math.round(collab.metrics.participation * 100)}
                                %
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-purple-300/70">
                                Effectiveness
                              </p>
                              <Progress
                                value={collab.metrics.effectiveness * 100}
                                className="h-1"
                              />
                              <p className="text-xs text-right text-purple-300">
                                {Math.round(collab.metrics.effectiveness * 100)}
                                %
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {sessions.map((session) => (
                  <Card
                    key={session.sessionId}
                    className="border-purple-500/10 bg-black/40"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                              {React.createElement(
                                getSessionTypeIcon(session.category),
                                {
                                  className: "h-4 w-4 text-purple-400",
                                }
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-purple-300">
                                {session.topic.charAt(0).toUpperCase() +
                                  session.topic.slice(1)}
                              </h3>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(session.status)}
                          >
                            {session.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-purple-300/70">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(session.scheduledTime).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-purple-300/70">
                            <Users className="h-4 w-4" />
                            <span>
                              {session.participants.length} Participants
                            </span>
                          </div>
                        </div>

                        {session.status === "completed" &&
                          session.messages.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-purple-300">
                                Session Messages:
                              </h4>
                              <div className="max-h-[200px] overflow-y-auto space-y-2">
                                {session.messages.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className="rounded-md border border-purple-500/10 bg-purple-500/5 p-2"
                                  >
                                    <div className="flex justify-between text-xs text-purple-300/70 mb-1">
                                      <span>{msg.senderId}</span>
                                      <span>
                                        {new Date(
                                          msg.timestamp
                                        ).toLocaleTimeString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-purple-300">
                                      {msg.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {session.status !== "completed" && (
                          <Button
                            className="w-full gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                            onClick={() => setActiveSession(session)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            Enter Session
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog
        open={!!activeSession}
        onOpenChange={() => setActiveSession(null)}
      >
        <DialogContent className="max-w-2xl border-purple-500/10 bg-black/90 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                  {activeSession &&
                    React.createElement(
                      getSessionTypeIcon(activeSession.category),
                      {
                        className: "h-4 w-4 text-purple-400",
                      }
                    )}
                </div>
                <div>
                  <h2 className="text-lg font-light tracking-wider text-purple-300">
                    {activeSession?.topic}
                  </h2>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ScrollArea className="h-[400px] rounded-md border border-purple-500/10 bg-black/20 p-4">
              <div className="space-y-4">
                {activeSession &&
                  activeSession.messages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start gap-3 flex-row-reverse"
                    >
                      <Avatar className="border-2 border-black/30">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback className="bg-purple-500/10 text-purple-300">
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 text-right">
                        <p className="text-sm font-medium text-purple-300">
                          {currentUser.name}
                          <span className="ml-2 text-xs text-purple-300/50">
                            {message.timestamp}
                          </span>
                        </p>
                        <div className="rounded-lg px-3 py-2 text-sm bg-blue-500/10 text-blue-300">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
