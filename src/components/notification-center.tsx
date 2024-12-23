"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Brain, Star, Shield, Activity, CircuitBoardIcon as Circuit } from 'lucide-react'

interface Notification {
  id: string
  type: "alert" | "achievement" | "system" | "event"
  title: string
  titleJp: string
  message: string
  time: string
  read: boolean
  icon: any
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "alert",
      title: "Quantum Anomaly Detected",
      titleJp: "量子異常検出",
      message: "Unusual patterns detected in sector 7. Investigation required.",
      time: "Just now",
      read: false,
      icon: Shield
    },
    {
      id: "2",
      type: "achievement",
      title: "New Achievement Unlocked",
      titleJp: "新しい実績解除",
      message: "Congratulations! You've achieved quantum harmony level 10.",
      time: "5 mins ago",
      read: false,
      icon: Star
    },
    {
      id: "3",
      type: "system",
      title: "System Update",
      titleJp: "システム更新",
      message: "Neural network optimization complete. 15% efficiency increase.",
      time: "1 hour ago",
      read: true,
      icon: Circuit
    }
  ])

  // Add new notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: ["alert", "achievement", "system", "event"][Math.floor(Math.random() * 4)] as Notification["type"],
        title: "New Activity Detected",
        titleJp: "新しいアクティビティ検出",
        message: "New consciousness patterns emerging in the quantum field.",
        time: "Just now",
        read: false,
        icon: Activity
      }

      setNotifications(prev => [newNotification, ...prev.slice(0, 8)])
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-light tracking-wider">
            Notifications
          </CardTitle>
          {unreadCount > 0 && (
            <Badge
              variant="outline"
              className="border-purple-400/30 bg-purple-500/10 text-purple-300"
            >
              {unreadCount} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border border-purple-500/10 bg-purple-500/5 p-4 transition-colors ${
                  !notification.read ? "bg-purple-500/10" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                    <notification.icon className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-purple-300">
                          {notification.title}
                        </p>
                        <p className="text-xs text-purple-300/70">
                          {notification.titleJp}
                        </p>
                      </div>
                      <span className="text-xs text-purple-300/50">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-purple-300/70">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

