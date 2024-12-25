"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PartyPopper,
  Users,
  Clock,
  Activity,
  Building2,
  Sparkles,
  DollarSign,
  Timer,
  ChevronRight,
} from "lucide-react";

interface CityEvent {
  id: string;
  title: string;
  titleJp: string;
  description: string;
  status: "active" | "completed";
  funding: {
    current: number;
    goal: number;
  };
  metrics: {
    participants: number;
    impact: number;
  };
  timeRemaining: number; // in seconds
  type: "cultural" | "infrastructure" | "technology";
  location: string;
  locationJp: string;
}

export function CityEventsPanel() {
  const [events, setEvents] = useState<CityEvent[]>([
    {
      id: "1",
      title: "Quantum Garden Festival",
      titleJp: "量子庭園フェスティバル",
      description:
        "A celebration of harmony between nature and technology in our quantum gardens",
      status: "active",
      funding: {
        current: 75000,
        goal: 100000,
      },
      metrics: {
        participants: 156,
        impact: 85,
      },
      timeRemaining: 10800, // 3 hours in seconds
      type: "cultural",
      location: "Digital Gardens",
      locationJp: "デジタル庭園",
    },
    {
      id: "2",
      title: "Neural Network Enhancement",
      titleJp: "ニューラルネットワーク強化",
      description:
        "Upgrading the city's neural pathways for improved consciousness flow",
      status: "active",
      funding: {
        current: 450000,
        goal: 500000,
      },
      metrics: {
        participants: 892,
        impact: 95,
      },
      timeRemaining: 7200, // 2 hours in seconds
      type: "technology",
      location: "Central Neural Hub",
      locationJp: "セントラルニューラルハブ",
    },
    {
      id: "3",
      title: "Quantum Theater Construction",
      titleJp: "量子シアター建設",
      description:
        "Building a new entertainment venue for consciousness-expanding performances",
      status: "active",
      funding: {
        current: 280000,
        goal: 300000,
      },
      metrics: {
        participants: 445,
        impact: 88,
      },
      timeRemaining: 3600, // 1 hour in seconds
      type: "infrastructure",
      location: "Entertainment District",
      locationJp: "エンターテイメント地区",
    },
  ]);

  // Update time remaining and check for completed events
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          // If already completed, don't update
          if (event.status === "completed") return event;

          // Check if funding goal is reached
          if (event.funding.current >= event.funding.goal) {
            return { ...event, status: "completed" };
          }

          // Update time remaining
          const newTimeRemaining = Math.max(0, event.timeRemaining - 1);

          // If time runs out and funding goal not reached, keep as is
          if (newTimeRemaining === 0) {
            return event;
          }

          return { ...event, timeRemaining: newTimeRemaining };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate random donations
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (event.status === "completed") return event;

          const donation = Math.floor(Math.random() * 1000);
          const newCurrent = Math.min(
            event.funding.goal,
            event.funding.current + donation
          );

          return {
            ...event,
            funding: {
              ...event.funding,
              current: newCurrent,
            },
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds === 0) return "Time expired";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m left`;
  };

  const getEventTypeIcon = (type: CityEvent["type"]) => {
    switch (type) {
      case "cultural":
        return PartyPopper;
      case "infrastructure":
        return Building2;
      case "technology":
        return Sparkles;
      default:
        return Activity;
    }
  };

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-light tracking-wider">
            City Events & Projects
          </CardTitle>
          <Badge
            variant="outline"
            className="border-purple-400/30 bg-purple-500/10 text-purple-300"
          >
            Active Events: {events.filter((e) => e.status === "active").length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-black/20">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="group relative overflow-hidden border-purple-500/10 bg-black/40"
                >
                  <div className="absolute inset-0 opacity-50">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
                  </div>
                  <CardContent className="relative p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                            {React.createElement(getEventTypeIcon(event.type), {
                              className: "h-4 w-4 text-purple-400",
                            })}
                          </div>
                          <div>
                            <h3 className="font-medium tracking-wider text-purple-300">
                              {event.title}
                            </h3>
                            <p className="text-sm text-purple-300/70">
                              {event.titleJp}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              event.status === "completed"
                                ? "border-green-400/30 bg-green-500/10 text-green-300"
                                : event.timeRemaining === 0
                                ? "border-red-400/30 bg-red-500/10 text-red-300"
                                : "border-blue-400/30 bg-blue-500/10 text-blue-300"
                            }
                          `}
                        >
                          {event.status === "completed"
                            ? "Completed"
                            : event.timeRemaining === 0
                            ? "Expired"
                            : formatTimeRemaining(event.timeRemaining)}
                        </Badge>
                      </div>

                      <p className="text-sm text-purple-300/70">
                        {event.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-purple-300/70">
                            Funding Progress
                          </span>
                          <span className="font-medium text-purple-300">
                            {Math.round(
                              (event.funding.current / event.funding.goal) * 100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (event.funding.current / event.funding.goal) * 100
                          }
                          className="h-2 bg-purple-500/10"
                          // @ts-ignore
                          indicatorClassName={
                            event.status === "completed"
                              ? "bg-green-500"
                              : "bg-purple-500"
                          }
                        />
                        <div className="flex items-center justify-between text-xs text-purple-300/50">
                          <span>
                            {event.funding.current.toLocaleString()} CR
                          </span>
                          <span>{event.funding.goal.toLocaleString()} CR</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="space-y-1">
                            <p className="text-xs text-purple-300/50">
                              Location
                            </p>
                            <div className="flex items-center gap-1 text-purple-300">
                              <Building2 className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-purple-300/50">
                              Participants
                            </p>
                            <div className="flex items-center gap-1 text-purple-300">
                              <Users className="h-3 w-3" />
                              <span>{event.metrics.participants}</span>
                            </div>
                          </div>
                        </div>

                        {event.status === "active" &&
                          event.timeRemaining > 0 && (
                            <Button
                              variant="ghost"
                              className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                            >
                              <DollarSign className="h-4 w-4" />
                              Support Event
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
