"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DonationModal } from "./donation-modal";
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
  Leaf,
  GraduationCap,
  Heart,
  Palette,
  Construction,
} from "lucide-react";

interface CelebrationEvent {
  title: string;
  description: string;
  duration: number;
  category: string;
  impact: {
    social: number;
    economic: number;
    cultural: number;
    environmental: number;
  };
}

interface DonationGoal {
  id: string;
  departmentId: string;
  targetAmount: number;
  currentAmount: number;
  title: string;
  description: string;
  celebrationEvent: CelebrationEvent;
}

export function CityEventsPanel() {
  const [events, setEvents] = useState<DonationGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DonationGoal | null>(
    null
  );
  const apiKey = process.env.BACKEND_API_KEY;

  const fetchDonationGoals = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/donations/goals`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(apiKey && { "x-api-key": apiKey }),
          },
        }
      );
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching donation goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonationGoals();
    const interval = setInterval(fetchDonationGoals, 30000);
    return () => clearInterval(interval);
  }, []);

  const getEventTypeIcon = (departmentId: string) => {
    switch (departmentId) {
      case "education":
        return GraduationCap;
      case "parks":
        return Leaf;
      case "health":
        return Heart;
      case "culture":
        return Palette;
      case "infrastructure":
        return Construction;
      default:
        return Activity;
    }
  };

  const getImpactScore = (impact: CelebrationEvent["impact"]) => {
    return Math.round(
      ((impact.social +
        impact.economic +
        impact.cultural +
        impact.environmental) /
        4) *
        100
    );
  };

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
      return `${minutes}m`;
    }
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
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
            Active Goals: {events.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
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
                          {React.createElement(
                            getEventTypeIcon(event.departmentId),
                            {
                              className: "h-4 w-4 text-purple-400",
                            }
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium tracking-wider text-purple-300">
                            {event.title}
                          </h3>
                          <p className="text-sm text-purple-300/70">
                            {event.celebrationEvent.title}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`
                          ${
                            event.currentAmount >= event.targetAmount
                              ? "border-green-400/30 bg-green-500/10 text-green-300"
                              : "border-blue-400/30 bg-blue-500/10 text-blue-300"
                          }
                        `}
                      >
                        {event.currentAmount >= event.targetAmount
                          ? "Goal Reached"
                          : "In Progress"}
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
                            (event.currentAmount / event.targetAmount) * 100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(event.currentAmount / event.targetAmount) * 100}
                        className="h-2 bg-purple-500/10"
                      />
                      <div className="flex items-center justify-between text-xs text-purple-300/50">
                        <span>{event.currentAmount.toLocaleString()} NRA</span>
                        <span>{event.targetAmount.toLocaleString()} NRA</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-purple-300/50">Category</p>
                          <div className="flex items-center gap-1 text-purple-300">
                            <PartyPopper className="h-3 w-3" />
                            <span className="capitalize">
                              {event.celebrationEvent.category}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-purple-300/50">
                            Impact Score
                          </p>
                          <div className="flex items-center gap-1 text-purple-300">
                            <Activity className="h-3 w-3" />
                            <span>
                              {getImpactScore(event.celebrationEvent.impact)}%
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-purple-300/50">Duration</p>
                          <div className="flex items-center gap-1 text-purple-300">
                            <Timer className="h-3 w-3" />
                            <span>
                              {formatDuration(event.celebrationEvent.duration)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {event.currentAmount < event.targetAmount && (
                        <Button
                          variant="ghost"
                          className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                          onClick={() => {
                            setSelectedProject(event);
                            setIsDonationModalOpen(true);
                          }}
                        >
                          <DollarSign className="h-4 w-4" />
                          Support Project
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
      </CardContent>
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        projectTitle={selectedProject?.title || ""}
        projectId={selectedProject?.id || ""}
        project={selectedProject!}
        onDonationComplete={() => {
          // Refresh donation goals if needed
          fetchDonationGoals();
        }}
      />
    </Card>
  );
}
