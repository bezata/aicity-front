"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, AlertCircle, ArrowRight, Brain, Building2, Cloud, Globe, Heart, Shield, Sparkles, Users } from 'lucide-react'
import { useState, useEffect } from "react"
import { NeuralBrainAnimation } from "./neural-brain-animation"
import { CityVitals } from "./city-vitals"
import { MetricsDashboard } from "./metrics-dashboard"
import { DistrictWebSocket } from "@/lib/websocket"

export function MainDashboard() {
  const router = useRouter()
  const [systemStatus, setSystemStatus] = useState<"normal" | "warning" | "critical">("normal")
  const [cityMetrics, setCityMetrics] = useState({
    consciousness: 95,
    harmony: 92,
    energy: 88,
    activity: 90,
    population: 15234,
    activeEntities: 12453,
    emergencyLevel: "low",
    incidents: 2,
    safetyScore: 95,
  })

  // Initialize WebSocket connection
  useEffect(() => {
    const wsClient = new DistrictWebSocket(
      `wss://${window.location.host}/api/districts/main/live`,
      (data) => {
        setCityMetrics(prev => ({ ...prev, ...data }))
        setSystemStatus(data.systemStatus || "normal")
      },
      (error) => {
        console.error('WebSocket error:', error)
        setSystemStatus("warning")
      }
    )

    wsClient.connect()

    return () => {
      wsClient.disconnect()
    }
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCityMetrics(prev => ({
        ...prev,
        consciousness: Math.min(100, Math.max(0, prev.consciousness + (Math.random() - 0.5) * 2)),
        harmony: Math.min(100, Math.max(0, prev.harmony + (Math.random() - 0.5) * 2)),
        energy: Math.min(100, Math.max(0, prev.energy + (Math.random() - 0.5) * 2)),
        activity: Math.min(100, Math.max(0, prev.activity + (Math.random() - 0.5) * 2)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 40%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)
          `
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="border-b border-purple-500/10 bg-black/30 backdrop-blur-xl">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-light tracking-wider text-purple-300">
                  AI City Interface
                </h1>
                <p className="mt-1 text-sm text-purple-300/70">
                  量子意識ネットワーク
                </p>
              </div>
              <Badge
                variant="outline"
                className={`
                  ${systemStatus === "normal" 
                    ? "border-green-400/30 bg-green-500/10 text-green-300" 
                    : systemStatus === "warning"
                    ? "border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
                    : "border-red-400/30 bg-red-500/10 text-red-300"}
                `}
              >
                System Status: {systemStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="container py-6">
          <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
            {/* Left Column - Brain and Vitals */}
            <div className="space-y-6">
              {/* Neural Brain Visualization */}
              <Card className="relative border-purple-500/10 bg-black/40 backdrop-blur-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-light tracking-wider">Neural Network</CardTitle>
                  <CardDescription>Active Consciousness Field</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <NeuralBrainAnimation />
                  </div>
                </CardContent>
              </Card>

              {/* City Vitals */}
              <CityVitals {...cityMetrics} />

              {/* Emergency Status */}
              <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="font-light tracking-wider flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Safety Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-purple-300/70">Safety Score</p>
                      <p className="text-2xl font-light text-purple-300">{cityMetrics.safetyScore}%</p>
                      <Progress value={cityMetrics.safetyScore} className="h-1" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-purple-300/70">Active Incidents</p>
                      <p className="text-2xl font-light text-purple-300">{cityMetrics.incidents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Districts and Metrics */}
            <div className="space-y-6">
              {/* Districts Grid */}
              <div className="grid gap-4 md:grid-cols-3">
                {districts.map((district) => (
                  <Card
                    key={district.id}
                    className="group relative overflow-hidden border-purple-500/10 bg-black/40 backdrop-blur-xl transition-all hover:border-purple-500/20"
                  >
                    <CardHeader>
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
                          <CardDescription>
                            {district.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-purple-300/70">Harmony</span>
                          <span className="font-medium text-purple-300">
                            {district.stats.harmony}%
                          </span>
                        </div>
                        <Progress
                          value={district.stats.harmony}
                          className="h-1 bg-purple-500/10"
                          indicatorClassName="bg-purple-500"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-between border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                        onClick={() => router.push(`/districts/${district.id}`)}
                      >
                        Enter District
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  icon={Users}
                  title="Population"
                  value={cityMetrics.population.toLocaleString()}
                  subValue={`${cityMetrics.activeEntities.toLocaleString()} Active`}
                />
                <MetricCard
                  icon={Activity}
                  title="System Load"
                  value="92%"
                  subValue="Optimal"
                />
                <MetricCard
                  icon={Heart}
                  title="City Health"
                  value="95%"
                  subValue="Excellent"
                />
              </div>
                    <div className="mt-6">
            <MetricsDashboard districtId="main" />
          </div>
            </div>
          </div>

          {/* Metrics Dashboard - Moved below the main grid */}
    
        </div>
      </div>
    </div>
  )
}

function MetricCard({ 
  icon: Icon, 
  title, 
  value, 
  subValue 
}: { 
  icon: any
  title: string
  value: string
  subValue: string
}) {
  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-normal">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-light text-purple-300">{value}</div>
        <p className="text-sm text-purple-300/70">{subValue}</p>
      </CardContent>
    </Card>
  )
}

const districts = [
  {
    id: "quantum-nexus",
    name: "Quantum Nexus",
    nameJp: "量子中枢",
    description: "Advanced quantum computing research district",
    icon: Brain,
    stats: {
      harmony: 92,
    }
  },
  {
    id: "neo-shibuya",
    name: "Neo-Shibuya",
    nameJp: "新渋谷区",
    description: "Cultural and entertainment hub",
    icon: Building2,
    stats: {
      harmony: 94,
    }
  },
  {
    id: "cyber-gardens",
    name: "Cyber Gardens",
    nameJp: "電脳庭園",
    description: "Digital ecosystem and meditation space",
    icon: Globe,
    stats: {
      harmony: 96,
    }
  }
]

