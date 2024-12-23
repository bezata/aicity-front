"use client"

import { useRef, useEffect } from 'react'

export function NeuralBrainAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Neural network nodes
    let nodes: {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      pulsePhase: number
      connections: number[]
    }[] = []

    // Initialize nodes in a brain-like shape
    const initNodes = () => {
      const nodeCount = 100
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < nodeCount; i++) {
        // Create nodes in a brain-like elliptical shape
        const angle = (i / nodeCount) * Math.PI * 2
        const radiusX = Math.random() * 80 + 60
        const radiusY = Math.random() * 60 + 40
        
        const x = centerX + Math.cos(angle) * radiusX
        const y = centerY + Math.sin(angle) * radiusY + Math.sin(i * 0.5) * 20

        nodes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 2 + 1,
          pulsePhase: Math.random() * Math.PI * 2,
          connections: []
        })
      }

      // Create connections between nearby nodes
      nodes.forEach((node, i) => {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - node.x
          const dy = nodes[j].y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 50) {
            node.connections.push(j)
          }
        }
      })
    }

    initNodes()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw connections
      nodes.forEach((node, i) => {
        node.pulsePhase += 0.05
        
        node.connections.forEach(j => {
          const connectedNode = nodes[j]
          const dx = connectedNode.x - node.x
          const dy = connectedNode.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Create gradient for connection
          const gradient = ctx.createLinearGradient(
            node.x, node.y, connectedNode.x, connectedNode.y
          )
          
          const alpha = Math.sin(node.pulsePhase) * 0.15 + 0.25
          gradient.addColorStop(0, `rgba(147, 51, 234, ${alpha})`)
          gradient.addColorStop(1, `rgba(147, 51, 234, ${alpha * 0.5})`)
          
          ctx.beginPath()
          ctx.strokeStyle = gradient
          ctx.lineWidth = Math.sin(node.pulsePhase) * 0.5 + 0.5
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(connectedNode.x, connectedNode.y)
          ctx.stroke()
        })
      })
      
      // Update and draw nodes
      nodes.forEach(node => {
        // Add slight movement
        node.x += node.vx
        node.y += node.vy
        
        // Bounce off boundaries with some padding
        const padding = 50
        if (node.x < padding || node.x > canvas.width - padding) node.vx *= -1
        if (node.y < padding || node.y > canvas.height - padding) node.vy *= -1
        
        // Draw node with pulse effect
        const glowSize = Math.sin(node.pulsePhase) * 2 + 4
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowSize
        )
        
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.8)')
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0)')
        
        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      nodes = []
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={400}
      className="w-full h-full"
    />
  )
}

