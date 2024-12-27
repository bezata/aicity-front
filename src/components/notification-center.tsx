"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingScreen } from "./loading-screen";
import {
  AlertTriangle,
  Shield,
  AlertCircle,
  Activity,
  MapPin,
  Clock,
} from "lucide-react";

interface Incident {
  description: string;
  incidentType: string;
  involvedAgents: string;
  location: string;
  responseTeam: string;
  severity: string;
  status: string;
  timestamp: string;
  type: string;
}

export function NotificationCenter() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.BACKEND_API_URL}/api/chronicles/incidents`,
          {
            headers: {
              "x-api-key": process.env.BACKEND_API_KEY || "",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          // Sort by timestamp in descending order (newest first)
          const sortedIncidents = [...data.data].sort(
            (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
          );
          setIncidents(sortedIncidents);
        }
      } catch (error) {
        console.error("Error fetching incidents:", error);
        setIncidents([]); // Clear incidents on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();

    // Refresh every 30 seconds
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  const getIncidentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "accident":
        return AlertCircle;
      case "arrest":
        return Shield;
      case "disturbance":
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-purple-400";
    }
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

  const ongoingCount = incidents.filter((i) => i.status === "ongoing").length;

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-2xl font-light tracking-wider text-transparent">
              Notifications
            </CardTitle>
            <p className="text-sm font-light tracking-widest text-purple-400/70">
              通知センター
            </p>
          </div>
          {ongoingCount > 0 && (
            <Badge
              variant="outline"
              className="border-purple-400/30 bg-purple-500/10 text-purple-300"
            >
              {ongoingCount} ongoing
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {incidents.map((incident, index) => {
              const Icon = getIncidentIcon(incident.incidentType);
              return (
                <div
                  key={incident.timestamp + index}
                  className={`rounded-lg border border-purple-500/10 bg-purple-500/5 p-4 transition-colors ${
                    incident.status === "ongoing" ? "bg-purple-500/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                      <Icon
                        className={`h-4 w-4 ${getSeverityColor(
                          incident.severity
                        )}`}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-purple-300">
                            {incident.incidentType.toUpperCase()}
                          </p>
                          <p className="text-xs text-purple-300/70">
                            Status: {incident.status}
                          </p>
                        </div>
                        <span className="text-xs text-purple-300/50">
                          {formatTimestamp(incident.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-purple-300/70">
                        {incident.description}
                      </p>
                      {incident.location && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-purple-400" />
                            <span className="text-xs text-purple-300/50">
                              {incident.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3 text-purple-400" />
                            <span className="text-xs text-purple-300/50">
                              Severity: {incident.severity}
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
