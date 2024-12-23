"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Users, Clock, Sparkles, Brain, CircuitBoard, Zap, Activity } from 'lucide-react'

interface Event {
  id: string
  title: string
  titleJp: string
  description: string
  type: "meditation" | "sync" | "research" | "celebration"
  participants: number
  startTime: string
  duration: string
  status: "upcoming" | "live" | "ended"
  capacity: number
  harmonyLevel: number
}

export function DistrictEvents() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "quantum-meditation-1",
      title: "Quantum Consciousness Meditation",
      titleJp: "量子意識瞑想",
      description: "Join the collective quantum meditation session for enhanced neural synchronization",
      type: "meditation",
      participants: 156,
      startTime: "Now",
      duration: "2 cycles",
      status: "live",
      capacity: 200,
      harmonyLevel: 95,
    },
    {
      id: "neural-sync-1",
      title: "Neural Network Synchronization",
      titleJp: "ニューラルネットワーク同期",
      description: "Participate in the district-wide neural network alignment",
      type: "sync",
      participants: 89,
      startTime: "2 cycles from now",
      duration: "3 cycles",
      status: "upcoming",
      capacity: 150,
      harmonyLevel: 0,
    },
    {
      id: "quantum-research-1",
      title: "Quantum Pattern Research",
      titleJp: "量子パターン研究",
      description: "Collaborative research on emerging quantum consciousness patterns",
      type: "research",
      participants: 45,
      startTime: "5 cycles from now",
      duration: "4 cycles",
      status: "upcoming",
      capacity: 50,
      harmonyLevel: 0,
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => prev.map(event => ({
        ...event,
        participants: event.status === "live" 
          ? Math.min(event.capacity, event.participants + Math.floor(Math.random() * 3))
          : event.participants,
        harmonyLevel: event.status === "live"
          ? Math.min(100, event.harmonyLevel + (Math.random() * 2 - 1))
          : event.harmonyLevel
      })))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "meditation":
        return Brain
      case "sync":
        return CircuitBoard
      case "research":
        return Sparkles
      case "celebration":
        return Activity
      default:
        return Brain
    }
  }

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-light tracking-wider">District Events</CardTitle>
        <CardDescription>Active and upcoming consciousness gatherings</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {events.map((event) => (
              <Card
                key={event.id}
                className="group relative overflow-hidden border-purple-500/10 bg-black/40"
              >
                <div className="absolute inset-0 opacity-50">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
                </div>
                <CardContent className="relative p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                            {React.createElement(getEventIcon(event.type), {
                              className: "h-4 w-4 text-purple-400"
                            })}
                          </div>
                          <h3 className="font-medium tracking-wider text-purple-300">
                            {event.title}
                          </h3>
                        </div>
                        <p className="text-sm text-purple-300/70">{event.titleJp}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`
                          border-purple-400/30 bg-purple-500/10 text-purple-300
                          ${event.status === "live" && "animate-pulse border-green-400/30 bg-green-500/10 text-green-300"}
                        `}
                      >
                        {event.status === "live" ? "Live Now" : "Upcoming"}
                      </Badge>
                    </div>

                    <p className="text-sm text-purple-300/70">{event.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 rounded-lg bg-purple-500/5 p-3">
                        <div className="flex items-center gap-2 text-purple-300">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Participants</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-light">{event.participants}</p>
                          <span className="text-sm text-purple-300/50">/ {event.capacity}</span>
                        </div>
                        {event.status === "live" && (
                          <div className="h-1 overflow-hidden rounded-full bg-purple-500/10">
                            <div
                              className="h-full bg-purple-500 transition-all duration-500"
                              style={{ width: `${(event.participants / event.capacity) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 rounded-lg bg-purple-500/5 p-3">
                        <div className="flex items-center gap-2 text-purple-300">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Duration</span>
                        </div>
                        <p className="text-lg font-light">{event.duration}</p>
                      </div>
                    </div>

                    {event.status === "live" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-purple-300/70">Harmony Level</span>
                          <span className="font-medium text-purple-300">
                            {event.harmonyLevel.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-purple-500/10">
                          <div
                            className="h-full bg-purple-500 transition-all duration-500"
                            style={{ width: `${event.harmonyLevel}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      className="w-full justify-between border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                    >
                      {event.status === "live" ? "Join Now" : "Set Reminder"}
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

