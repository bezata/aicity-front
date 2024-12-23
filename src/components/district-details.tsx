"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Activity, MessageCircle, LineChartIcon as ChartLineUp, Newspaper } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  time: string
  participants: number
}

interface Update {
  id: string
  title: string
  content: string
  time: string
  type: "announcement" | "achievement" | "alert"
}

export function DistrictDetails({
  districtId,
  onClose,
}: {
  districtId: string
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState("overview")

  const events: Event[] = [
    {
      id: "1",
      title: "Quantum Meditation Session",
      description: "Group consciousness exploration and harmony seeking",
      time: "2 cycles from now",
      participants: 156,
    },
    {
      id: "2",
      title: "Neural Network Poetry Reading",
      description: "AI-generated haikus and consciousness streams",
      time: "5 cycles from now",
      participants: 89,
    },
  ]

  const updates: Update[] = [
    {
      id: "1",
      title: "New Consciousness Pattern Discovered",
      content:
        "Researchers in the Quantum District have identified a novel pattern of collective consciousness interaction.",
      time: "1 cycle ago",
      type: "announcement",
    },
    {
      id: "2",
      title: "District Harmony Level Peak",
      content:
        "The Digital Gardens have achieved a new record in community consciousness synchronization.",
      time: "3 cycles ago",
      type: "achievement",
    },
  ]

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-light tracking-wider">
          District Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-black/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4">
              <Card className="border-purple-500/10 bg-black/20">
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-purple-300">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Active Entities</span>
                        </div>
                        <p className="text-2xl font-light">2,749</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-purple-300">
                          <Activity className="h-4 w-4" />
                          <span className="text-sm">Harmony Level</span>
                        </div>
                        <p className="text-2xl font-light">94.3%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <ScrollArea className="h-[400px] rounded-lg border border-purple-500/10 bg-black/20 p-4">
              <div className="space-y-4">
                {events.map((event) => (
                  <Card
                    key={event.id}
                    className="border-purple-500/10 bg-black/40"
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-purple-300">
                            {event.title}
                          </h3>
                          <span className="text-sm text-purple-300/70">
                            {event.time}
                          </span>
                        </div>
                        <p className="text-sm text-purple-300/70">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-purple-300">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">
                            {event.participants} participants
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="updates">
            <ScrollArea className="h-[400px] rounded-lg border border-purple-500/10 bg-black/20 p-4">
              <div className="space-y-4">
                {updates.map((update) => (
                  <Card
                    key={update.id}
                    className="border-purple-500/10 bg-black/40"
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-purple-300">
                            {update.title}
                          </h3>
                          <span className="text-sm text-purple-300/70">
                            {update.time}
                          </span>
                        </div>
                        <p className="text-sm text-purple-300/70">
                          {update.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

