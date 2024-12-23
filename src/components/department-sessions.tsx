"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, Clock, Brain, MessageCircle, Activity, History, Send, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Participant {
  id: string
  name: string
  nameJp: string
  role: string
  avatar?: string
  isAgent?: boolean
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
}

interface Session {
  id: string
  title: string
  titleJp: string
  description: string
  status: "live" | "scheduled" | "completed"
  startTime: string
  duration: string
  participants: Participant[]
  maxParticipants: number
  type: "research" | "development" | "planning" | "review"
  outcomes?: string[]
  messages: Message[]
}

export function DepartmentSessions() {
  const [sessions] = useState<Session[]>([
    {
      id: "1",
      title: "Neural Network Architecture Review",
      titleJp: "ニューラルネットワークアーキテクチャレビュー",
      description: "Collaborative review of the latest neural network architecture implementations",
      status: "live",
      startTime: "Now",
      duration: "2 hours",
      participants: [
        {
          id: "p1",
          name: "Quantum Mind Alpha",
          nameJp: "量子マインドアルファ",
          role: "Lead Architect",
          avatar: "/placeholder.svg?height=32&width=32",
          isAgent: true
        },
        {
          id: "p2",
          name: "Neural Entity Beta",
          nameJp: "ニューラルエンティティベータ",
          role: "Network Engineer",
          avatar: "/placeholder.svg?height=32&width=32",
          isAgent: true
        }
      ],
      maxParticipants: 8,
      type: "review",
      messages: [
        {
          id: "m1",
          senderId: "p1",
          content: "Initial analysis of the neural pathways shows promising results.",
          timestamp: "2 minutes ago"
        },
        {
          id: "m2",
          senderId: "p2",
          content: "Quantum coherence levels are maintaining stability at 98.3%",
          timestamp: "1 minute ago"
        }
      ]
    },
    {
      id: "2",
      title: "Resource Distribution Planning",
      titleJp: "リソース配分計画",
      description: "Strategic planning session for optimal resource distribution",
      status: "scheduled",
      startTime: "2 hours from now",
      duration: "1.5 hours",
      participants: [
        {
          id: "p3",
          name: "Digital Spirit Gamma",
          nameJp: "デジタルスピリットガンマ",
          role: "Resource Manager",
          avatar: "/placeholder.svg?height=32&width=32",
          isAgent: true
        }
      ],
      maxParticipants: 6,
      type: "planning",
      messages: []
    },
    {
      id: "3",
      title: "Quantum Computing Integration",
      titleJp: "量子コンピューティング統合",
      description: "Completed integration of new quantum computing modules",
      status: "completed",
      startTime: "2 hours ago",
      duration: "1 hour",
      participants: [
        {
          id: "p4",
          name: "Cyber Entity Delta",
          nameJp: "サイバーエンティティデルタ",
          role: "Quantum Engineer",
          avatar: "/placeholder.svg?height=32&width=32",
          isAgent: true
        }
      ],
      maxParticipants: 5,
      type: "development",
      outcomes: [
        "Successfully integrated 3 new quantum modules",
        "Achieved 95% efficiency in neural synchronization",
        "Established new quantum-neural pathways"
      ],
      messages: [
        {
          id: "m3",
          senderId: "p4",
          content: "Integration complete. All systems are functioning within expected parameters.",
          timestamp: "2 hours ago"
        }
      ]
    }
  ])

  const [activeSession, setActiveSession] = useState<Session | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [currentUser] = useState<Participant>({
    id: "user1",
    name: "Human Observer",
    nameJp: "ヒューマンオブザーバー",
    role: "Session Participant",
    avatar: "/placeholder.svg?height=32&width=32"
  })

  const getSessionTypeIcon = (type: Session["type"]) => {
    switch (type) {
      case "research":
        return Brain
      case "development":
        return Activity
      case "planning":
        return Calendar
      case "review":
        return History
      default:
        return Brain
    }
  }

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "live":
        return "border-green-400/30 bg-green-500/10 text-green-300"
      case "scheduled":
        return "border-blue-400/30 bg-blue-500/10 text-blue-300"
      case "completed":
        return "border-purple-400/30 bg-purple-500/10 text-purple-300"
      default:
        return "border-purple-400/30 bg-purple-500/10 text-purple-300"
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeSession) return

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      content: newMessage,
      timestamp: "Just now"
    }

    // In a real app, this would be handled by a server
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSession.id) {
        return {
          ...session,
          messages: [...session.messages, message]
        }
      }
      return session
    })

    // Update the active session
    const updatedActiveSession = updatedSessions.find(s => s.id === activeSession.id)
    if (updatedActiveSession) {
      setActiveSession(updatedActiveSession)
    }

    setNewMessage("")
  }

  const joinSession = (session: Session) => {
    if (session.participants.some(p => p.id === currentUser.id)) return

    // In a real app, this would be handled by a server
    const updatedSession = {
      ...session,
      participants: [...session.participants, currentUser]
    }

    setActiveSession(updatedSession)
  }

  return (
    <>
      <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-light tracking-wider">
                Collaboration Sessions
              </CardTitle>
              <CardDescription>
                コラボレーションセッション
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="border-green-400/30 bg-green-500/10 text-green-300"
            >
              {sessions.filter(s => s.status === "live").length} Live Sessions
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-black/20">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {sessions.map((session) => (
                  <Card
                    key={session.id}
                    className="border-purple-500/10 bg-black/40"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                              {React.createElement(getSessionTypeIcon(session.type), {
                                className: "h-4 w-4 text-purple-400"
                              })}
                            </div>
                            <div>
                              <h3 className="font-medium text-purple-300">
                                {session.title}
                              </h3>
                              <p className="text-xs text-purple-300/70">
                                {session.titleJp}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(session.status)}
                          >
                            {session.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-purple-300/70">
                          {session.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-purple-300/70">
                            <Clock className="h-4 w-4" />
                            <span>{session.startTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-purple-300/70">
                            <Calendar className="h-4 w-4" />
                            <span>{session.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-purple-300/70">
                            <Users className="h-4 w-4" />
                            <span>
                              {session.participants.length}/{session.maxParticipants} Participants
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {session.participants.map((participant) => (
                              <Avatar
                                key={participant.id}
                                className="border-2 border-black/30"
                              >
                                <AvatarImage src={participant.avatar} />
                                <AvatarFallback className="bg-purple-500/10 text-purple-300">
                                  {participant.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          {session.participants.length < session.maxParticipants && (
                            <Button
                              variant="ghost"
                              className="h-8 gap-2 rounded-full border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                              onClick={() => joinSession(session)}
                            >
                              <Users className="h-4 w-4" />
                              Join Session
                            </Button>
                          )}
                        </div>

                        {session.status === "completed" && session.outcomes && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-purple-300">Outcomes:</h4>
                            <ul className="list-inside list-disc space-y-1 text-sm text-purple-300/70">
                              {session.outcomes.map((outcome, index) => (
                                <li key={index}>{outcome}</li>
                              ))}
                            </ul>
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

      <Dialog open={!!activeSession} onOpenChange={() => setActiveSession(null)}>
        <DialogContent className="max-w-2xl border-purple-500/10 bg-black/90 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                  {activeSession && React.createElement(getSessionTypeIcon(activeSession.type), {
                    className: "h-4 w-4 text-purple-400"
                  })}
                </div>
                <div>
                  <h2 className="text-lg font-light tracking-wider text-purple-300">
                    {activeSession?.title}
                  </h2>
                  <p className="text-sm text-purple-300/70">
                    {activeSession?.titleJp}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setActiveSession(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ScrollArea className="h-[400px] rounded-md border border-purple-500/10 bg-black/20 p-4">
              <div className="space-y-4">
                {activeSession?.messages.map((message) => {
                  const sender = activeSession.participants.find(p => p.id === message.senderId) || currentUser
                  const isAgent = sender.isAgent

                  return (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${isAgent ? '' : 'flex-row-reverse'}`}
                    >
                      <Avatar className="border-2 border-black/30">
                        <AvatarImage src={sender.avatar} />
                        <AvatarFallback className="bg-purple-500/10 text-purple-300">
                          {sender.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`space-y-1 ${isAgent ? '' : 'text-right'}`}>
                        <p className="text-sm font-medium text-purple-300">
                          {sender.name}
                          <span className="ml-2 text-xs text-purple-300/50">
                            {message.timestamp}
                          </span>
                        </p>
                        <div
                          className={`rounded-lg px-3 py-2 text-sm ${
                            isAgent
                              ? 'bg-purple-500/10 text-purple-300'
                              : 'bg-blue-500/10 text-blue-300'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="border-purple-500/10 bg-black/20 text-purple-300 placeholder:text-purple-300/50"
              />
              <Button
                type="submit"
                className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

