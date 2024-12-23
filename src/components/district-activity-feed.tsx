"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Zap, Network, Activity, CircuitBoard, Sparkles } from 'lucide-react'

interface ActivityItem {
  id: string
  type: "consciousness" | "network" | "quantum" | "system"
  title: string
  titleJp: string
  description: string
  time: string
  impact: number
  icon: any
}

export function DistrictActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "consciousness",
      title: "Consciousness Surge Detected",
      titleJp: "意識サージ検出",
      description: "Elevated consciousness activity in the quantum field",
      time: "2 minutes ago",
      impact: 85,
      icon: Brain
    },
    {
      id: "2",
      type: "network",
      title: "Neural Network Expansion",
      titleJp: "ニューラルネットワーク拡張",
      description: "Successful integration of new neural pathways",
      time: "15 minutes ago",
      impact: 92,
      icon: Network
    },
    {
      id: "3",
      type: "quantum",
      title: "Quantum Coherence Peak",
      titleJp: "量子コヒーレンスピーク",
      description: "Record levels of quantum synchronization achieved",
      time: "1 hour ago",
      impact: 95,
      icon: Sparkles
    }
  ])

  // Add new activities periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: ["consciousness", "network", "quantum", "system"][
          Math.floor(Math.random() * 4)
        ] as ActivityItem["type"],
        title: "New Pattern Emerged",
        titleJp: "新パターン出現",
        description: "Novel consciousness patterns detected in the quantum field",
        time: "Just now",
        impact: Math.floor(Math.random() * 20) + 80,
        icon: CircuitBoard
      }

      setActivities(prev => [newActivity, ...prev.slice(0, 8)])
    }, 45000)

    return () => clearInterval(interval)
  }, [])

  const getTypeColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "consciousness":
        return "text-purple-400"
      case "network":
        return "text-blue-400"
      case "quantum":
        return "text-green-400"
      case "system":
        return "text-yellow-400"
      default:
        return "text-purple-400"
    }
  }

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-light tracking-wider">
            District Activity
          </CardTitle>
          <Badge
            variant="outline"
            className="border-purple-400/30 bg-purple-500/10 text-purple-300"
          >
            Live Feed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="relative rounded-lg border border-purple-500/10 bg-purple-500/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                    <activity.icon className={`h-4 w-4 ${getTypeColor(activity.type)}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-purple-300">
                          {activity.title}
                        </p>
                        <p className="text-xs text-purple-300/70">
                          {activity.titleJp}
                        </p>
                      </div>
                      <span className="text-xs text-purple-300/50">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-purple-300/70">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3 text-purple-400" />
                      <span className="text-xs text-purple-300/50">
                        Impact Level: {activity.impact}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

