"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AlertCircle, Users, DollarSign, Activity, Calendar, MessageSquare, ChevronRight } from 'lucide-react'

interface DepartmentMetrics {
  budget: {
    total: number
    spent: number
    remaining: number
  }
  staffCount: number
  activeProjects: number
  emergencyResponseTime: number
  collaborationScore: number
}

interface Meeting {
  id: string
  title: string
  status: "scheduled" | "live" | "completed"
  participants: number
  startTime: string
  chatRoomId: string
}

interface EmergencyStatus {
  level: "none" | "low" | "medium" | "high"
  activeIncidents: number
  responseTeamStatus: "ready" | "deployed" | "standby"
}

export function DepartmentProfile() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<DepartmentMetrics>({
    budget: {
      total: 1000000,
      spent: 680000,
      remaining: 320000,
    },
    staffCount: 125,
    activeProjects: 8,
    emergencyResponseTime: 92,
    collaborationScore: 88,
  })

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "District Safety Review",
      status: "live",
      participants: 12,
      startTime: "10:00 AM",
      chatRoomId: "safety-review"
    },
    {
      id: "2",
      title: "Budget Planning",
      status: "scheduled",
      participants: 8,
      startTime: "2:00 PM",
      chatRoomId: "budget-planning"
    },
  ])

  const [emergency, setEmergency] = useState<EmergencyStatus>({
    level: "low",
    activeIncidents: 2,
    responseTeamStatus: "standby",
  })

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getEmergencyColor = (level: EmergencyStatus["level"]) => {
    switch (level) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-orange-500"
      case "low":
        return "text-yellow-500"
      default:
        return "text-green-500"
    }
  }

  return (
    <Card className="border-blue-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-light tracking-wider">
          Department Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-blue-500/20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" />
              <AvatarFallback className="bg-blue-500/10 text-xl font-light text-blue-300">
                PD
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-medium tracking-wider text-blue-300">
                Public Development
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-blue-400/30 bg-blue-500/10 text-blue-300"
                >
                  Core Department
                </Badge>
                <Badge
                  variant="outline"
                  className={`border-${getEmergencyColor(emergency.level)}/30 bg-${getEmergencyColor(emergency.level)}/10 ${getEmergencyColor(emergency.level)}`}
                >
                  {emergency.activeIncidents} Active Incidents
                </Badge>
              </div>
            </div>
          </div>

          {/* Budget Analytics */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-blue-300">
              Budget Analytics
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-300/70">Budget Utilization</span>
                <span className="font-medium text-blue-300">
                  {formatBudget(metrics.budget.spent)} /{" "}
                  {formatBudget(metrics.budget.total)}
                </span>
              </div>
              <Progress
                value={(metrics.budget.spent / metrics.budget.total) * 100}
                className="h-1 bg-blue-500/10"
                indicatorClassName="bg-blue-500"
              />
            </div>
          </div>

          {/* Department Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">Staff</span>
              </div>
              <p className="mt-2 text-xl font-medium text-blue-300">
                {metrics.staffCount}
              </p>
            </div>
            <div className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">Projects</span>
              </div>
              <p className="mt-2 text-xl font-medium text-blue-300">
                {metrics.activeProjects}
              </p>
            </div>
          </div>

          {/* Active Meetings & Collaborations */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-blue-300">
              Active Sessions
            </h3>
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between rounded-lg border border-blue-500/10 bg-blue-500/5 p-3"
                >
                  <div className="flex items-center gap-3">
                    {meeting.status === "live" ? (
                      <div className="relative">
                        <MessageSquare className="h-5 w-5 text-red-400" />
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
                      </div>
                    ) : (
                      <Calendar className="h-5 w-5 text-blue-400" />
                    )}
                    <div>
                      <p className="font-medium text-blue-300">
                        {meeting.title}
                      </p>
                      <p className="text-xs text-blue-300/70">
                        {meeting.participants} participants • {meeting.startTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        meeting.status === "live"
                          ? "border-red-400/30 bg-red-500/10 text-red-300"
                          : "border-blue-400/30 bg-blue-500/10 text-blue-300"
                      }
                    >
                      {meeting.status.toUpperCase()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 border border-blue-500/10 bg-blue-500/5 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200"
                      onClick={() => router.push(`/chat/${meeting.chatRoomId}`)}
                    >
                      Join
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Response Status */}
          <div className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle
                  className={`h-5 w-5 ${getEmergencyColor(emergency.level)}`}
                />
                <h3 className="font-medium text-blue-300">
                  Emergency Response
                </h3>
              </div>
              <Badge
                variant="outline"
                className={`border-${getEmergencyColor(emergency.level)}/30 
                  bg-${getEmergencyColor(emergency.level)}/10 
                  ${getEmergencyColor(emergency.level)}`}
              >
                {emergency.responseTeamStatus.toUpperCase()}
              </Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-300/70">Response Time</p>
                <p className="text-lg font-medium text-blue-300">
                  {metrics.emergencyResponseTime}%
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-300/70">Collaboration Score</p>
                <p className="text-lg font-medium text-blue-300">
                  {metrics.collaborationScore}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

