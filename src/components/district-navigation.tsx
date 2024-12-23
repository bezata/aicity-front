"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Brain, Search, MapPin, ChevronRight, Building2, Globe, CircuitBoardIcon as Circuit, Users, MessageCircle } from 'lucide-react'

interface District {
  id: string
  name: string
  nameJp: string
  type: "quantum" | "cultural" | "research" | "residential"
  population: number
  status: "active" | "busy" | "peaceful"
  icon: any
  description: string
  chatRoomId: string
}

export function DistrictNavigation() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [districts] = useState<District[]>([
    {
      id: "quantum-district",
      name: "Quantum District",
      nameJp: "量子区",
      type: "quantum",
      population: 2749,
      status: "active",
      icon: Brain,
      description: "Center of quantum computing research",
      chatRoomId: "quantum"
    },
    {
      id: "neo-tokyo",
      name: "Neo-Tokyo Central",
      nameJp: "新東京中央",
      type: "cultural",
      population: 5231,
      status: "busy",
      icon: Building2,
      description: "Cultural and administrative hub",
      chatRoomId: "zen"
    },
    {
      id: "digital-gardens",
      name: "Digital Gardens",
      nameJp: "デジタル庭園",
      type: "residential",
      population: 1823,
      status: "peaceful",
      icon: Globe,
      description: "Harmonious living spaces",
      chatRoomId: "neural"
    },
    {
      id: "research-nexus",
      name: "Research Nexus",
      nameJp: "研究ネクサス",
      type: "research",
      population: 3102,
      status: "active",
      icon: Circuit,
      description: "Advanced research facilities",
      chatRoomId: "quantum"
    }
  ])

  const filteredDistricts = districts.filter(district =>
    district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    district.nameJp.includes(searchQuery)
  )

  const getStatusColor = (status: District["status"]) => {
    switch (status) {
      case "active":
        return "text-green-400 border-green-400/30 bg-green-500/10"
      case "busy":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-500/10"
      case "peaceful":
        return "text-blue-400 border-blue-400/30 bg-blue-500/10"
      default:
        return "text-purple-400 border-purple-400/30 bg-purple-500/10"
    }
  }

  return (
    <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300/50" />
            <Input
              placeholder="Search districts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-purple-500/10 bg-black/20 font-light text-purple-300 placeholder:text-purple-300/50"
            />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-2 pr-4">
              {filteredDistricts.map((district) => (
                <div
                  key={district.id}
                  className="group rounded-lg border border-purple-500/10 bg-black/30 p-4 transition-all hover:bg-purple-500/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                      <district.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-purple-300">{district.name}</h3>
                            <p className="text-sm text-purple-300/70">{district.nameJp}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(district.status)}
                          >
                            {district.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-purple-300/50">
                          {district.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-purple-300/70">
                          <Users className="h-4 w-4" />
                          <span>{district.population.toLocaleString()} entities</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                            onClick={() => router.push(`/chat/${district.chatRoomId}`)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            Chat
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                            onClick={() => router.push(`/districts/${district.id}`)}
                          >
                            Enter
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

