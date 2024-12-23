"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AlertCircle, Users, DollarSign, Activity, Calendar, MessageCircle, ChevronRight, Clock } from 'lucide-react'

interface Activity {
  id: string
  type: "update" | "milestone" | "alert"
  title: string
  description: string
  time: string
}

export function DepartmentProfile() {
  const router = useRouter()
  const [latestActivities, setLatestActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "update",
      title: "Neural Network Expansion",
      description: "Phase 2 of network expansion completed successfully",
      time: "2 hours ago"
    },
    {
      id: "2",
      type: "milestone",
      title: "Efficiency Milestone",
      description: "Achieved 95% operational efficiency",
      time: "5 hours ago"
    },
    {
      id: "3",
      type: "alert",
      title: "Resource Optimization",
      description: "Implementing new resource distribution protocols",
      time: "1 day ago"
    }
  ])

  return (
    <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-light tracking-wider">
            Latest Department Activity
          </CardTitle>
          <Button
            variant="ghost"
            className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
            onClick={() => router.push('/departments')}
          >
            View All Departments
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-purple-500/20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" />
              <AvatarFallback className="bg-purple-500/10 text-xl font-light text-purple-300">
                PD
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-medium tracking-wider text-purple-300">
                Public Development
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                >
                  Core Department
                </Badge>
                <Badge
                  variant="outline"
                  className="border-green-400/30 bg-green-500/10 text-green-300"
                >
                  Active
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {latestActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                    {activity.type === "update" ? (
                      <Activity className="h-4 w-4 text-purple-400" />
                    ) : activity.type === "milestone" ? (
                      <Calendar className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-purple-300">{activity.title}</h3>
                      <div className="flex items-center gap-1 text-purple-300/50">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{activity.time}</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-purple-300/70">{activity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
              onClick={() => router.push('/departments/public-development')}
            >
              View Department
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
              onClick={() => router.push('/departments/public-development/donate')}
            >
              <DollarSign className="h-4 w-4" />
              Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

