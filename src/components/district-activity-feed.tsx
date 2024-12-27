"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingScreen } from "./loading-screen";
import {
  Sparkles,
  PartyPopper,
  CalendarDays,
  Activity,
  MapPin,
  Clock,
} from "lucide-react";

interface Event {
  description: string;
  eventType: string;
  impact: string;
  location: string;
  participants: string;
  timestamp: string;
  title: string;
  type: string;
}

export function DistrictActivityFeed() {
  const apiKey = process.env.BACKEND_API_KEY;
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.BACKEND_API_URL}api/chronicles/events`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(apiKey && { "x-api-key": apiKey }),
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          // Sort by timestamp in descending order (newest first)
          const sortedEvents = [...data.data].sort(
            (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
          );
          setEvents(sortedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]); // Clear events on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();

    // Refresh every 30 seconds
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "celebration":
        return PartyPopper;
      case "festival":
        return Sparkles;
      default:
        return CalendarDays;
    }
  };

  const getTypeColor = (impact: string) => {
    const impactNum = parseInt(impact);
    if (impactNum >= 8) return "text-purple-400";
    if (impactNum >= 6) return "text-blue-400";
    if (impactNum >= 4) return "text-green-400";
    return "text-yellow-400";
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp));
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Unknown time";
    }
  };

  const formatDescription = (description: string) => {
    const cleanDesc = description
      .replace(/Description:|Would you like.*$|\(Note:.*$|\n/g, "")
      .trim();
    if (cleanDesc.length <= 200) return cleanDesc;
    return cleanDesc.substring(0, 200) + "...";
  };

  const formatTitle = (title: string) => {
    return title
      .replace(/\"|\"/g, "") // Remove both types of quotes
      .replace(/\*\*/g, "") // Remove markdown bold
      .replace(/Title\:/g, "")
      .trim();
  };

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-2xl font-light tracking-wider text-transparent">
              District Activity
            </CardTitle>
            <p className="text-sm font-light tracking-widest text-purple-400/70">
              ディストリクトアクティビティ
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-purple-400/30 bg-purple-500/10 text-purple-300"
          >
            Live Feed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {events.map((event, index) => {
              const Icon = getEventIcon(event.eventType);
              return (
                <div
                  key={event.timestamp + index}
                  className="relative rounded-lg border border-purple-500/10 bg-purple-500/5 p-4 hover:bg-purple-500/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                      <Icon
                        className={`h-4 w-4 ${getTypeColor(event.impact)}`}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-purple-300">
                            {formatTitle(event.title)}
                          </p>
                          <p className="text-xs text-purple-300/70">
                            Type: {event.eventType}
                          </p>
                        </div>
                        <span className="text-xs text-purple-300/50">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-purple-300/70 min-h-[60px]">
                        {formatDescription(event.description)}
                      </p>
                      {event.location && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-purple-400" />
                            <span className="text-xs text-purple-300/50">
                              {event.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3 text-purple-400" />
                            <span className="text-xs text-purple-300/50">
                              Impact: {event.impact}/10
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
