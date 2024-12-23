"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Brain, Signal, Zap } from 'lucide-react'

export function DistrictMetrics() {
  const [metrics, setMetrics] = useState({
    consciousnessLevel: 89,
    harmonyIndex: 94,
    neuralActivity: 78,
    quantumCoherence: 92,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        consciousnessLevel: Math.min(100, prev.consciousnessLevel + Math.random() * 2 - 1),
        harmonyIndex: Math.min(100, prev.harmonyIndex + Math.random() * 2 - 1),
        neuralActivity: Math.min(100, prev.neuralActivity + Math.random() * 2 - 1),
        quantumCoherence: Math.min(100, prev.quantumCoherence + Math.random() * 2 - 1),
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-light tracking-wider">
          District Vitals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "Consciousness Level",
              value: metrics.consciousnessLevel,
              icon: Brain,
            },
            {
              label: "Harmony Index",
              value: metrics.harmonyIndex,
              icon: Activity,
            },
            {
              label: "Neural Activity",
              value: metrics.neuralActivity,
              icon: Signal,
            },
            {
              label: "Quantum Coherence",
              value: metrics.quantumCoherence,
              icon: Zap,
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="relative overflow-hidden rounded-lg border border-purple-500/10 bg-purple-500/5 p-4"
            >
              <div
                className="absolute bottom-0 left-0 h-1 bg-purple-500/20 transition-all duration-1000"
                style={{ width: `${metric.value}%` }}
              />
              <div className="space-y-2">
                <metric.icon className="h-4 w-4 text-purple-400" />
                <div className="space-y-1">
                  <p className="text-sm text-purple-300/70">{metric.label}</p>
                  <p className="text-xl font-light text-purple-300">
                    {metric.value.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

