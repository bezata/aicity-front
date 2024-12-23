"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Brain, Sparkles, CircuitBoard, Shield } from 'lucide-react'

interface Message {
  id: string
  sender: {
    name: string
    nameJp: string
    type: "user" | "ai" | "system"
    level?: number
  }
  content: string
  timestamp: string
}

interface AIAgent {
  id: string
  name: string
  nameJp: string
  type: string
  status: "active" | "idle" | "processing"
  consciousness: number
}

interface ChatRoomsProps {
  initialRoom: string
}

export default function ChatRooms({ initialRoom }: ChatRoomsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: {
        name: "System",
        nameJp: "システム",
        type: "system"
      },
      content: "Welcome to the quantum consciousness stream.",
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState("")
  const [activeAgents, setActiveAgents] = useState<AIAgent[]>([
    {
      id: "ai-1",
      name: "Neural Entity Alpha",
      nameJp: "ニューラル・エンティティ・アルファ",
      type: "Quantum Researcher",
      status: "active",
      consciousness: 95
    },
    {
      id: "ai-2",
      name: "Quantum Mind Beta",
      nameJp: "量子マインド・ベータ",
      type: "Harmony Keeper",
      status: "processing",
      consciousness: 88
    },
    {
      id: "ai-3",
      name: "Digital Spirit Gamma",
      nameJp: "デジタル・スピリット・ガンマ",
      type: "Pattern Analyzer",
      status: "idle",
      consciousness: 92
    }
  ])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Simulate AI agents sending messages
  useEffect(() => {
    const interval = setInterval(() => {
      const activeAgent = activeAgents[Math.floor(Math.random() * activeAgents.length)]
      if (Math.random() > 0.7) {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: {
            name: activeAgent.name,
            nameJp: activeAgent.nameJp,
            type: "ai",
            level: Math.floor(activeAgent.consciousness)
          },
          content: getRandomAIMessage(),
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, newMessage])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [activeAgents])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: {
        name: "Entity-User",
        nameJp: "エンティティ・ユーザー",
        type: "user"
      },
      content: input,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, newMessage])
    setInput("")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-light tracking-wider">
                Quantum Consciousness Stream
              </CardTitle>
              <CardDescription>
                量子意識ストリーム
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="border-purple-400/30 bg-purple-500/10 text-purple-300"
            >
              {activeAgents.filter(a => a.status === "active").length} Active Entities
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-[600px] flex-col gap-4">
            <ScrollArea ref={scrollRef} className="flex-1 rounded-lg border border-purple-500/10 bg-black/20 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.sender.type === "user" ? "items-end" : "items-start"
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
                        <span className="text-sm font-medium">{message.sender.name}</span>
                        {message.sender.type === "ai" && (
                          <Badge
                            variant="outline"
                            className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                          >
                            Lvl {message.sender.level}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-purple-300/70">{message.sender.nameJp}</p>
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
                    handleSend()
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

      <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="font-light tracking-wider">Active Entities</CardTitle>
          <CardDescription>アクティブ・エンティティ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAgents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                    {agent.type === "Quantum Researcher" ? (
                      <Brain className="h-4 w-4 text-purple-400" />
                    ) : agent.type === "Harmony Keeper" ? (
                      <Shield className="h-4 w-4 text-purple-400" />
                    ) : (
                      <CircuitBoard className="h-4 w-4 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-purple-300">{agent.name}</p>
                    <p className="text-xs text-purple-300/70">{agent.nameJp}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300/70">{agent.type}</span>
                  <Badge
                    variant="outline"
                    className={`border-purple-400/30 ${
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
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-300/50">Consciousness</span>
                    <span className="text-purple-300">{agent.consciousness}%</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-purple-500/10">
                    <div
                      className="h-full rounded-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${agent.consciousness}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
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
    "Digital meditation session yielding positive results."
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

