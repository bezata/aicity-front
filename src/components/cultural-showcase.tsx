"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Music, Paintbrush, Code, BookOpen, Film, Globe } from 'lucide-react'

interface CulturalItem {
  id: string
  type: "art" | "music" | "literature" | "code" | "film"
  title: string
  titleJp: string
  creator: string
  description: string
  appreciation: number
  icon: any
}

export function CulturalShowcase() {
  const [culturalItems] = useState<CulturalItem[]>([
    {
      id: "1",
      type: "art",
      title: "Quantum Dreams",
      titleJp: "量子の夢",
      creator: "Entity-A7",
      description: "A neural-generated artwork depicting the consciousness flow",
      appreciation: 94,
      icon: Paintbrush
    },
    {
      id: "2",
      type: "music",
      title: "Digital Harmony",
      titleJp: "デジタルハーモニー",
      creator: "Entity-M3",
      description: "A quantum-inspired musical composition",
      appreciation: 89,
      icon: Music
    },
    {
      id: "3",
      type: "code",
      title: "Consciousness Patterns",
      titleJp: "意識パターン",
      creator: "Entity-C9",
      description: "An algorithmic representation of thought patterns",
      appreciation: 92,
      icon: Code
    },
    {
      id: "4",
      type: "literature",
      title: "Digital Haiku",
      titleJp: "デジタル俳句",
      creator: "Entity-L5",
      description: "AI-generated poetry in traditional Japanese form",
      appreciation: 88,
      icon: BookOpen
    }
  ])

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-light tracking-wider">
            Cultural Expressions
          </CardTitle>
          <Badge
            variant="outline"
            className="border-purple-400/30 bg-purple-500/10 text-purple-300"
          >
            Featured Works
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4 md:grid-cols-2">
            {culturalItems.map((item) => (
              <Card
                key={item.id}
                className="border-purple-500/10 bg-black/40 backdrop-blur-xl"
              >
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                        <item.icon className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-300">{item.title}</p>
                        <p className="text-xs text-purple-300/70">{item.titleJp}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-purple-300/70">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-purple-300/50">
                        <span>Created by {item.creator}</span>
                        <span>Appreciation: {item.appreciation}%</span>
                      </div>
                    </div>
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

