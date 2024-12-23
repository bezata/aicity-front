"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Heart, Zap, Activity } from 'lucide-react'

interface CityVitalsProps {
  consciousness: number
  harmony: number
  energy: number
  activity: number
}

export function CityVitals({
  consciousness = 95,
  harmony = 92,
  energy = 88,
  activity = 90
}: CityVitalsProps) {
  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-light tracking-wider">City Vitals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300/70">Consciousness</span>
            </div>
            <span className="text-sm font-medium text-purple-300">{consciousness}%</span>
          </div>
          <Progress value={consciousness} className="h-1 bg-purple-500/10" indicatorClassName="bg-purple-500" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300/70">Harmony</span>
            </div>
            <span className="text-sm font-medium text-purple-300">{harmony}%</span>
          </div>
          <Progress value={harmony} className="h-1 bg-purple-500/10" indicatorClassName="bg-green-500" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300/70">Energy Flow</span>
            </div>
            <span className="text-sm font-medium text-purple-300">{energy}%</span>
          </div>
          <Progress value={energy} className="h-1 bg-purple-500/10" indicatorClassName="bg-blue-500" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-purple-300/70">Activity Level</span>
            </div>
            <span className="text-sm font-medium text-purple-300">{activity}%</span>
          </div>
          <Progress value={activity} className="h-1 bg-purple-500/10" indicatorClassName="bg-yellow-500" />
        </div>
      </CardContent>
    </Card>
  )
}

