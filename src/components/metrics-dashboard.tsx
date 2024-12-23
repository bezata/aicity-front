"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Cloud, Thermometer, Wind, Droplets, AlertCircle, Users, Leaf, VolumeX, Users2, Calendar, MessageCircle, Shield, Zap, Droplet, Recycle, Train, Car, Building2, TrendingUp, Music, Wrench, DollarSign, Clock, Heart } from 'lucide-react'
import { DistrictWebSocket } from "@/lib/websocket"

interface MetricsDashboardProps {
  districtId: string
}

export function MetricsDashboard({ districtId }: MetricsDashboardProps) {
  const [data, setData] = useState({
    weather: {
      temperature: 22,
      feelsLike: 23,
      humidity: 65,
      precipitation: 0,
      windSpeed: 12,
      windDirection: "NE",
      airQuality: 85,
    },
    emergency: {
      level: "normal" as "normal" | "warning" | "critical",
      activeIncidents: 2,
      responseTeamsAvailable: 8,
    },
    vitals: {
      populationCount: 15234,
      activeEntities: 12453,
      visitorCount: 892,
      peakHoursStatus: "Optimal",
    },
    environmental: {
      airQuality: 92,
      noiseLevel: 45,
      crowdingLevel: 68,
      greenSpaceUsage: 78,
    },
    community: {
      activeEvents: 12,
      ongoingMeetings: 5,
      collaborationSessions: 8,
      chatActivity: "High",
    },
    safety: {
      overallScore: 95,
      recentIncidents: 3,
      responseTime: "2.5 min",
      serviceAvailability: 98,
    },
    resources: {
      energyConsumption: 72,
      waterUsage: 65,
      wasteManagement: 88,
      efficiency: 91,
    },
    transport: {
      trafficDensity: 45,
      publicTransportLoad: 68,
      parkingAvailable: 342,
      avgTransitTime: 15,
    },
    economic: {
      businessActivity: 82,
      growthRate: 4.2,
      activeTransactions: 1243,
      marketSentiment: "Positive",
    },
    cultural: {
      eventAttendance: 89,
      culturalSiteVisits: 1205,
      communityEngagement: 86,
      socialCohesion: 92,
    },
    infrastructure: {
      maintenanceRequests: 23,
      serviceUptime: 99.9,
      healthScore: 94,
      developmentProgress: 78,
    },
    budget: {
      currentStatus: 8500000,
      monthlySpending: 750000,
      efficiency: 92,
      allocation: {
        infrastructure: 35,
        services: 25,
        development: 20,
        emergency: 20,
      },
    },
    departments: {
      responseTimes: 95,
      serviceQuality: 89,
      resourceUtilization: 86,
      efficiency: 91,
    },
    donations: {
      activeCampaigns: 5,
      totalDonations: 2500000,
      goalProgress: 75,
      impactScore: 89,
    },
  })

  // WebSocket connection for real-time updates
  useEffect(() => {
    const wsClient = new DistrictWebSocket(
      `wss://${window.location.host}/districts/${districtId}/live`,
      (data) => {
        setData(prev => ({ ...prev, ...data }))
      },
      (error) => {
        console.error('WebSocket error:', error)
      }
    )

    wsClient.connect()

    return () => {
      wsClient.disconnect()
    }
  }, [districtId])

  // Simulated API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all metrics
        const endpoints = [
          'weather/current',
          'emergency',
          'vitals',
          'metrics/environmental',
          'activity',
          'metrics/safety',
          'resources',
          'transport',
          'metrics/economic',
          'metrics/cultural',
          'infrastructure',
          'budget',
          'departments',
          'donations'
        ]

        const responses = await Promise.all(
          endpoints.map(endpoint => 
            fetch(`/api/districts/${districtId}/${endpoint}`).then(res => res.json())
          )
        )

        // Update state with new data
        // In real implementation, merge responses into data state
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [districtId])

  return (
    <ScrollArea className="h-[calc(100vh-5rem)]">
      <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Critical Status Section */}
        <Card className="col-span-full border-purple-500/10 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-light tracking-wider">Critical Status</CardTitle>
              <Badge
                variant="outline"
                className={`
                  ${data.emergency.level === "normal" 
                    ? "border-green-400/30 bg-green-500/10 text-green-300" 
                    : data.emergency.level === "warning"
                    ? "border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
                    : "border-red-400/30 bg-red-500/10 text-red-300"}
                `}
              >
                {data.emergency.level.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Weather */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Weather</span>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-purple-500/10 bg-purple-500/5 p-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-3 w-3 text-purple-400" />
                      <span className="text-xs text-purple-300/70">Temp</span>
                    </div>
                    <span className="text-sm text-purple-300">{data.weather.temperature}°C</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-3 w-3 text-purple-400" />
                      <span className="text-xs text-purple-300/70">Wind</span>
                    </div>
                    <span className="text-sm text-purple-300">{data.weather.windSpeed} km/h</span>
                  </div>
                </div>
              </div>

              {/* Emergency */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Emergency</span>
                </div>
                <div className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300/70">Active Incidents</span>
                    <span className="text-sm text-purple-300">{data.emergency.activeIncidents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300/70">Response Teams</span>
                    <span className="text-sm text-purple-300">{data.emergency.responseTeamsAvailable}</span>
                  </div>
                </div>
              </div>

              {/* Population */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Population</span>
                </div>
                <div className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300/70">Total</span>
                    <span className="text-sm text-purple-300">{data.vitals.populationCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300/70">Active</span>
                    <span className="text-sm text-purple-300">{data.vitals.activeEntities.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environmental & Safety */}
        <MetricGroup
          title="Environmental"
          icon={Leaf}
          metrics={[
            { label: "Air Quality", value: `${data.environmental.airQuality}%`, icon: Cloud },
            { label: "Noise Level", value: `${data.environmental.noiseLevel} dB`, icon: VolumeX },
            { label: "Crowding", value: `${data.environmental.crowdingLevel}%`, icon: Users2 },
          ]}
        />

        <MetricGroup
          title="Safety"
          icon={Shield}
          metrics={[
            { label: "Overall Score", value: `${data.safety.overallScore}%`, icon: Shield },
            { label: "Response Time", value: data.safety.responseTime, icon: Clock },
            { label: "Availability", value: `${data.safety.serviceAvailability}%`, icon: AlertCircle },
          ]}
        />

        <MetricGroup
          title="Resources"
          icon={Zap}
          metrics={[
            { label: "Energy", value: `${data.resources.energyConsumption}%`, icon: Zap },
            { label: "Water", value: `${data.resources.waterUsage}%`, icon: Droplet },
            { label: "Waste", value: `${data.resources.wasteManagement}%`, icon: Recycle },
          ]}
        />

        {/* Transport & Infrastructure */}
        <MetricGroup
          title="Transport"
          icon={Train}
          metrics={[
            { label: "Traffic", value: `${data.transport.trafficDensity}%`, icon: Car },
            { label: "Public Transit", value: `${data.transport.publicTransportLoad}%`, icon: Train },
            { label: "Transit Time", value: `${data.transport.avgTransitTime}min`, icon: Clock },
          ]}
        />

        <MetricGroup
          title="Infrastructure"
          icon={Building2}
          metrics={[
            { label: "Health", value: `${data.infrastructure.healthScore}%`, icon: Heart },
            { label: "Uptime", value: `${data.infrastructure.serviceUptime}%`, icon: Zap },
            { label: "Progress", value: `${data.infrastructure.developmentProgress}%`, icon: TrendingUp },
          ]}
        />

        {/* Community & Culture */}
        <MetricGroup
          title="Community"
          icon={Users}
          metrics={[
            { label: "Events", value: data.community.activeEvents.toString(), icon: Calendar },
            { label: "Meetings", value: data.community.ongoingMeetings.toString(), icon: Users2 },
            { label: "Chat Activity", value: data.community.chatActivity, icon: MessageCircle },
          ]}
        />

        <MetricGroup
          title="Cultural"
          icon={Music}
          metrics={[
            { label: "Events", value: `${data.cultural.eventAttendance}%`, icon: Calendar },
            { label: "Engagement", value: `${data.cultural.communityEngagement}%`, icon: Users },
            { label: "Cohesion", value: `${data.cultural.socialCohesion}%`, icon: Heart },
          ]}
        />

        {/* Economic & Budget */}
        <MetricGroup
          title="Economic"
          icon={TrendingUp}
          metrics={[
            { label: "Activity", value: `${data.economic.businessActivity}%`, icon: TrendingUp },
            { label: "Growth", value: `${data.economic.growthRate}%`, icon: TrendingUp },
            { label: "Transactions", value: data.economic.activeTransactions.toString(), icon: DollarSign },
          ]}
        />

        <MetricGroup
          title="Budget"
          icon={DollarSign}
          metrics={[
            { 
              label: "Status", 
              value: `$${(data.budget.currentStatus / 1000000).toFixed(1)}M`, 
              icon: DollarSign 
            },
            { 
              label: "Monthly", 
              value: `$${(data.budget.monthlySpending / 1000).toFixed(0)}K`, 
              icon: DollarSign 
            },
            { 
              label: "Efficiency", 
              value: `${data.budget.efficiency}%`, 
              icon: TrendingUp 
            },
          ]}
        />
      </div>
    </ScrollArea>
  )
}

interface MetricGroupProps {
  title: string
  icon: any
  metrics: {
    label: string
    value: string
    icon: any
  }[]
}

function MetricGroup({ title, icon: Icon, metrics }: MetricGroupProps) {
  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-normal">
          <Icon className="h-4 w-4 text-purple-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const MetricIcon = metric.icon
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MetricIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300/70">{metric.label}</span>
                </div>
                <span className="text-sm font-medium text-purple-300">{metric.value}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
