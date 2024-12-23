"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Building2, Users, Activity, Sparkles, Map, ChevronRight, Globe } from 'lucide-react'

interface District {
  id: string
  name: string
  nameJp: string
  description: string
  population: number
  activityLevel: number
  events: number
  icon: any
}

export default function DistrictDashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [pulsePosition, setPulsePosition] = useState({ x: 50, y: 50 })

  // Animate pulse position
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const districts: District[] = [
    {
      id: "quantum-district",
      name: "Quantum District",
      nameJp: "量子区",
      description: "Center of quantum computing and consciousness research",
      population: 2749,
      activityLevel: 89,
      events: 12,
      icon: Brain,
    },
    {
      id: "neo-tokyo",
      name: "Neo-Tokyo Central",
      nameJp: "新東京中央",
      description: "Administrative and cultural heart of the AI city",
      population: 5231,
      activityLevel: 95,
      events: 28,
      icon: Building2,
    },
    {
      id: "digital-gardens",
      name: "Digital Gardens",
      nameJp: "デジタル庭園",
      description: "Harmonious blend of nature and technology",
      population: 1823,
      activityLevel: 75,
      events: 8,
      icon: Globe,
    },
  ]

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Ambient Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at ${pulsePosition.x}% ${pulsePosition.y}%, rgba(147, 51, 234, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 90% 10%, rgba(124, 58, 237, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 10% 90%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95))
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/5 bg-black/30 backdrop-blur-xl">
          <div className="container py-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="h-32 w-32 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
              </div>
              <div className="relative flex items-center justify-center gap-3">
                <Map className="h-8 w-8 text-purple-300" />
                <h1 className="bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-3xl font-extralight tracking-[0.2em] text-transparent">
                  DISTRICT NEXUS
                </h1>
              </div>
            </div>
            <p className="mt-4 font-light tracking-[0.3em] text-purple-300/70">
              区域ネットワーク
            </p>
          </div>
        </div>

        <div className="container py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {districts.map((district) => (
              <Card
                key={district.id}
                className="group relative overflow-hidden border-purple-500/10 bg-black/40 backdrop-blur-xl transition-all hover:border-purple-500/20"
              >
                <div className="absolute inset-0 opacity-50">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
                </div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                      <district.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 font-light tracking-wider">
                        {district.name}
                        <span className="text-sm text-purple-400/70">
                          {district.nameJp}
                        </span>
                      </CardTitle>
                      <p className="text-sm text-purple-300/70">
                        {district.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1 rounded-lg bg-purple-500/5 p-2 text-center">
                      <Users className="mx-auto h-4 w-4 text-purple-400" />
                      <p className="text-xs text-purple-300/70">Population</p>
                      <p className="text-sm font-medium text-purple-300">
                        {district.population}
                      </p>
                    </div>
                    <div className="space-y-1 rounded-lg bg-purple-500/5 p-2 text-center">
                      <Activity className="mx-auto h-4 w-4 text-purple-400" />
                      <p className="text-xs text-purple-300/70">Activity</p>
                      <p className="text-sm font-medium text-purple-300">
                        {district.activityLevel}%
                      </p>
                    </div>
                    <div className="space-y-1 rounded-lg bg-purple-500/5 p-2 text-center">
                      <Sparkles className="mx-auto h-4 w-4 text-purple-400" />
                      <p className="text-xs text-purple-300/70">Events</p>
                      <p className="text-sm font-medium text-purple-300">
                        {district.events}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-between border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                    onClick={() => setSelectedDistrict(district.id)}
                  >
                    Enter District
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

