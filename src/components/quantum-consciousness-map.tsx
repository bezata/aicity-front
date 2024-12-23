"use client"

import * as React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Network, Sparkles } from 'lucide-react'

interface Node {
  id: string
  x: number
  y: number
  strength: number
  connections: string[]
}

export function QuantumConsciousnessMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const [nodes, setNodes] = useState<Node[]>([])
  const [metrics, setMetrics] = useState({
    activeNodes: 0,
    connections: 0,
    coherenceLevel: 0
  })

  // Initialize nodes once
  useEffect(() => {
    const initialNodes: Node[] = Array.from({ length: 50 }, (_, i) => ({
      id: `node-${i}`,
      x: Math.random() * window.innerWidth,
      y: Math.random() * 400,
      strength: Math.random(),
      connections: []
    }))

    // Create connections
    initialNodes.forEach(node => {
      const nearbyNodes = initialNodes
        .filter(n => n.id !== node.id)
        .sort((a, b) => {
          const distA = Math.hypot(a.x - node.x, a.y - node.y)
          const distB = Math.hypot(b.x - node.x, b.y - node.y)
          return distA - distB
        })
        .slice(0, 3)
        .map(n => n.id)

      node.connections = nearbyNodes
    })

    setNodes(initialNodes)
  }, [])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update node positions with time-based animation
    const time = Date.now() * 0.001
    const updatedNodes = nodes.map(node => ({
      ...node,
      x: node.x + Math.sin(time + parseInt(node.id.split('-')[1])) * 0.5,
      y: node.y + Math.cos(time + parseInt(node.id.split('-')[1])) * 0.5,
      strength: Math.min(1, Math.max(0, node.strength + (Math.random() - 0.5) * 0.1))
    }))

    // Draw connections
    updatedNodes.forEach(node => {
      node.connections.forEach(connId => {
        const connNode = updatedNodes.find(n => n.id === connId)
        if (!connNode) return

        const gradient = ctx.createLinearGradient(node.x, node.y, connNode.x, connNode.y)
        gradient.addColorStop(0, `rgba(168, 85, 247, ${node.strength * 0.4})`)
        gradient.addColorStop(1, `rgba(168, 85, 247, ${connNode.strength * 0.4})`)

        ctx.beginPath()
        ctx.strokeStyle = gradient
        ctx.lineWidth = Math.min(node.strength, connNode.strength) * 2
        ctx.moveTo(node.x, node.y)
        ctx.lineTo(connNode.x, connNode.y)
        ctx.stroke()
      })
    })

    // Draw nodes
    updatedNodes.forEach(node => {
      ctx.beginPath()
      ctx.fillStyle = `rgba(168, 85, 247, ${node.strength})`
      ctx.arc(node.x, node.y, 3 + node.strength * 2, 0, Math.PI * 2)
      ctx.fill()

      // Glow effect
      ctx.beginPath()
      const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, 15
      )
      gradient.addColorStop(0, `rgba(168, 85, 247, ${node.strength * 0.3})`)
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0)')
      ctx.fillStyle = gradient
      ctx.arc(node.x, node.y, 15, 0, Math.PI * 2)
      ctx.fill()
    })

    // Update metrics less frequently
    if (time % 1 < 0.1) {
      setMetrics({
        activeNodes: updatedNodes.filter(n => n.strength > 0.5).length,
        connections: updatedNodes.reduce((acc, n) => acc + n.connections.length, 0),
        coherenceLevel: updatedNodes.reduce((acc, n) => acc + n.strength, 0) / updatedNodes.length * 100
      })
    }

    setNodes(updatedNodes)
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [nodes])

  // Setup and cleanup animation loop
  useEffect(() => {
    if (nodes.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animate, nodes.length])

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-light tracking-wider">
            Quantum Consciousness Map
          </CardTitle>
          <Badge
            variant="outline"
            className="border-purple-400/30 bg-purple-500/10 text-purple-300"
          >
            Live Visualization
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="relative aspect-[2/1] overflow-hidden rounded-lg border border-purple-500/10 bg-black/40">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="h-full w-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 rounded-lg bg-purple-500/5 p-4">
              <div className="flex items-center gap-2 text-purple-300">
                <Brain className="h-4 w-4" />
                <span className="text-sm">Active Nodes</span>
              </div>
              <p className="text-2xl font-light text-purple-300">
                {metrics.activeNodes}
              </p>
            </div>

            <div className="space-y-2 rounded-lg bg-purple-500/5 p-4">
              <div className="flex items-center gap-2 text-purple-300">
                <Network className="h-4 w-4" />
                <span className="text-sm">Connections</span>
              </div>
              <p className="text-2xl font-light text-purple-300">
                {metrics.connections}
              </p>
            </div>

            <div className="space-y-2 rounded-lg bg-purple-500/5 p-4">
              <div className="flex items-center gap-2 text-purple-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Coherence</span>
              </div>
              <p className="text-2xl font-light text-purple-300">
                {metrics.coherenceLevel.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

