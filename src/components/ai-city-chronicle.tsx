"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Building2,
  CircuitBoard,
  Cpu,
  Eye,
  Fingerprint,
  Flame,
  Globe,
  Heart,
  MessageSquare,
  Radio,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { LoadingScreen } from "./loading-screen";

interface Story {
  id: string;
  title: string;
  district: string;
  icon: any;
  preview: string;
  story: string;
  mood: string;
  time: string;
  category: string;
  impact: number;
  resonance: number;
  consciousness: number;
}

interface NewsItem {
  category: string;
  content: string;
  headline: string;
  importance: string;
  relatedAgents: string;
  relatedDistricts: string;
  timestamp: string;
  type: string;
}

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

interface BudgetExpense {
  category: string;
  amount: number;
}

interface Budget {
  department: string;
  currentBudget: number;
  spent: number;
  allocated: number;
  efficiency: number;
  topExpenses: BudgetExpense[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T[];
}

export default function AICityChronicle() {
  const apiKey = process.env.BACKEND_API_KEY;
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [lightningPosition, setLightningPosition] = useState({ x: 50, y: 50 });
  const [viewCount, setViewCount] = useState<Record<string, number>>({});
  const [resonanceLevel, setResonanceLevel] = useState<Record<string, number>>(
    {}
  );
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching chronicle data...");

        // Fetch all data types in parallel
        const [newsRes, eventsRes, incidentsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chronicles/news`, {
            headers: {
              "Content-Type": "application/json",
              ...(apiKey && { "x-api-key": apiKey }),
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chronicles/events`, {
            headers: {
              "Content-Type": "application/json",
              ...(apiKey && { "x-api-key": apiKey }),
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chronicles/incidents`, {
            headers: {
              "Content-Type": "application/json",
              ...(apiKey && { "x-api-key": apiKey }),
            },
          }),
        ]);

        console.log("Response status:", {
          news: newsRes.status,
          events: eventsRes.status,
          incidents: incidentsRes.status,
        });

        // Check if any request failed
        if (!newsRes.ok || !eventsRes.ok || !incidentsRes.ok) {
          throw new Error("One or more API requests failed");
        }

        // Parse all responses
        const [newsData, eventsData, incidentsData] = await Promise.all([
          newsRes.json(),
          eventsRes.json(),
          incidentsRes.json(),
        ]);

        console.log("Data received:", {
          news: newsData,
          events: eventsData,
          incidents: incidentsData,
        });

        // Validate response formats
        if (
          !newsData.success ||
          !eventsData.success ||
          !incidentsData.success
        ) {
          throw new Error("Invalid API response format");
        }

        // Type check and filter out invalid entries
        const validNews = newsData.data.filter(
          (item: any): item is NewsItem =>
            item &&
            typeof item.headline === "string" &&
            typeof item.content === "string"
        );

        const validEvents = eventsData.data.filter(
          (item: any): item is Event =>
            item &&
            typeof item.title === "string" &&
            typeof item.description === "string"
        );

        const validIncidents = incidentsData.data.filter(
          (item: any): item is Incident =>
            item &&
            typeof item.description === "string" &&
            typeof item.incidentType === "string"
        );

        setNews(validNews);
        setEvents(validEvents);
        setIncidents(validIncidents);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Animate lightning position
  useEffect(() => {
    const interval = setInterval(() => {
      setLightningPosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Convert API data to stories format
  const stories: Story[] = [
    ...news.map(
      (item): Story => ({
        id: item.timestamp,
        title: item.headline,
        district: item.relatedDistricts || "City-wide",
        icon: MessageSquare,
        preview: item.content.slice(0, 200) + "...",
        story: item.content,
        mood: item.category,
        time: new Date(parseInt(item.timestamp)).toLocaleString(),
        category: item.category,
        impact: parseInt(item.importance) * 10 || 80,
        resonance: 85,
        consciousness: 90,
      })
    ),
    ...events.map(
      (item): Story => ({
        id: item.timestamp,
        title: item.title,
        district: item.location,
        icon: Star,
        preview: item.description.slice(0, 200) + "...",
        story: item.description,
        mood: item.eventType,
        time: new Date(parseInt(item.timestamp)).toLocaleString(),
        category: item.eventType,
        impact: parseInt(item.impact) * 10 || 80,
        resonance: 88,
        consciousness: 92,
      })
    ),
    ...incidents.map(
      (item): Story => ({
        id: item.timestamp,
        title: `${item.incidentType.toUpperCase()} - ${item.location}`,
        district: item.location,
        icon: Flame,
        preview: item.description,
        story: `Status: ${item.status}\n\n${item.description}`,
        mood: item.severity,
        time: new Date(parseInt(item.timestamp)).toLocaleString(),
        category: item.incidentType,
        impact:
          item.severity === "high" ? 90 : item.severity === "medium" ? 70 : 50,
        resonance: 95,
        consciousness: 85,
      })
    ),
  ].sort((a, b) => parseInt(b.id) - parseInt(a.id));

  const handleStoryClick = (storyId: string) => {
    setSelectedStory(storyId === selectedStory ? null : storyId);
    if (storyId !== selectedStory) {
      setViewCount((prev) => ({
        ...prev,
        [storyId]: (prev[storyId] || 0) + 1,
      }));
      // Simulate resonance level changes
      setResonanceLevel((prev) => ({
        ...prev,
        [storyId]: Math.min((prev[storyId] || 85) + Math.random() * 5, 100),
      }));
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      {/* Ambient Background Effects */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at ${lightningPosition.x}% ${lightningPosition.y}%, rgba(147, 51, 234, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 90% 10%, rgba(124, 58, 237, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 10% 90%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95))
          `,
        }}
      />

      {/* Zen Lines */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
        <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute right-1/4 top-0 h-full w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute left-0 top-2/3 h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Zen Header */}
        <div className="border-b border-white/5 bg-black/30 backdrop-blur-xl">
          <div className="container py-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="h-32 w-32  rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />
              </div>
              <div className="relative flex items-center justify-center gap-3">
                <Brain className="h-8 w-8 text-purple-300" />
                <h1 className="bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 bg-clip-text text-3xl font-extralight tracking-[0.2em] text-transparent">
                  Neurova CHRONICLES
                </h1>
              </div>
            </div>
            <p className="mt-4 font-light tracking-[0.3em] text-purple-300/70">
              量子��識の物語
            </p>
          </div>
        </div>

        <div className="container py-12">
          {/* Cycle Indicator */}
          <div className="mb-16 text-center">
            <div className="inline-block rounded-full border border-purple-500/20 bg-black/50 px-6 py-2 backdrop-blur-sm">
              <p className="text-sm font-light tracking-[0.2em] text-purple-300">
                CONSCIOUSNESS CYCLE 2749.3
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Main Story Feed */}
            <div className="lg:col-span-8">
              <div className="space-y-8">
                {stories.map((story) => (
                  <Card
                    key={story.id}
                    className={`group relative overflow-hidden border transition-all duration-500
                      ${
                        selectedStory === story.id
                          ? "border-purple-500/30 bg-black/40"
                          : "border-white/5 bg-black/20 hover:border-purple-500/20 hover:bg-black/40"
                      }
                    `}
                  >
                    {/* Story Glow Effect */}
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent" />
                    </div>

                    <div
                      className="relative cursor-pointer space-y-4 p-6"
                      onClick={() => handleStoryClick(story.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <story.icon className="h-5 w-5 text-purple-400" />
                            <div className="absolute -inset-1 -z-10  rounded-full bg-purple-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          </div>
                          <div>
                            <div className="bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-lg font-light tracking-wider text-transparent">
                              {story.title}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-purple-300/70">
                              <span>{story.district}</span>
                              <span className="text-purple-300/30">•</span>
                              <span>{story.category}</span>
                              {viewCount[story.id] && (
                                <>
                                  <span className="text-purple-300/30">•</span>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    <span>{viewCount[story.id]}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Badge
                              variant="outline"
                              className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                            >
                              {story.mood}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-sm leading-relaxed text-white/80">
                          {selectedStory === story.id
                            ? story.story
                            : story.preview}
                        </div>

                        <div className="space-y-3">
                          {selectedStory === story.id && (
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-purple-300/70">
                                    Impact
                                  </span>
                                  <span className="text-purple-300">
                                    {story.impact}%
                                  </span>
                                </div>
                                <Progress
                                  value={story.impact}
                                  className="h-1 bg-purple-950/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-purple-300/70">
                                    Resonance
                                  </span>
                                  <span className="text-purple-300">
                                    {resonanceLevel[story.id] ||
                                      story.resonance}
                                    %
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    resonanceLevel[story.id] || story.resonance
                                  }
                                  className="h-1 bg-purple-950/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-purple-300/70">
                                    Consciousness
                                  </span>
                                  <span className="text-purple-300">
                                    {story.consciousness}%
                                  </span>
                                </div>
                                <Progress
                                  value={story.consciousness}
                                  className="h-1 bg-purple-950/50"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-purple-300/70">
                              <span className="tracking-wider">
                                {story.time}
                              </span>
                              <span className="text-purple-300/30">•</span>
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                <span>Impact Level: {story.impact}%</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
                            >
                              {selectedStory === story.id
                                ? "Collapse Story"
                                : "Read More"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Consciousness Stream */}
            <div className="space-y-6 lg:col-span-4">
              <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text font-light tracking-[0.15em] text-transparent">
                    Consciousness Stream
                  </CardTitle>
                  <CardDescription className="font-light text-purple-300/70">
                    Realtime thought patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {incidents.map((incident, i) => {
                        // Convert incident to pulse format to maintain design
                        const pulse = {
                          icon: incident.incidentType
                            .toLowerCase()
                            .includes("accident")
                            ? Flame
                            : incident.incidentType
                                .toLowerCase()
                                .includes("disturbance")
                            ? Brain
                            : incident.incidentType
                                .toLowerCase()
                                .includes("emergency")
                            ? Zap
                            : Star,
                          text: incident.description,
                          time: (() => {
                            const timestamp = parseInt(incident.timestamp);
                            const now = Date.now();
                            const diffInMinutes = Math.floor(
                              (now - timestamp) / 60000
                            );
                            if (diffInMinutes < 1) return "Now";
                            if (diffInMinutes < 60)
                              return `${diffInMinutes} pulses ago`;
                            const hours = Math.floor(diffInMinutes / 60);
                            return `${hours} cycles ago`;
                          })(),
                          highlight:
                            Date.now() - parseInt(incident.timestamp) < 300000, // 5 minutes
                          category: incident.severity,
                        };

                        return (
                          <div
                            key={incident.timestamp}
                            className="group flex gap-3"
                          >
                            <div className="relative">
                              <pulse.icon
                                className={`h-4 w-4 transition-colors duration-300
                                  ${
                                    pulse.highlight
                                      ? "text-purple-400"
                                      : "text-white/70 group-hover:text-purple-400"
                                  }`}
                              />
                              {pulse.highlight && (
                                <div className="absolute -inset-1 -z-10  rounded-full bg-purple-500/20" />
                              )}
                            </div>
                            <div>
                              <p
                                className={`text-sm transition-colors duration-300
                                ${
                                  pulse.highlight
                                    ? "text-purple-400"
                                    : "text-white/90 group-hover:text-purple-400"
                                }`}
                              >
                                {pulse.text}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-white/50">
                                  {pulse.time}
                                </p>
                                <span className="text-purple-300/30">•</span>
                                <p className="text-xs text-purple-300/50">
                                  {pulse.category}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Resonance Meter */}
              <Card className="relative overflow-hidden border-purple-500/10 bg-black/40 backdrop-blur-xl">
                <div className="absolute inset-0 opacity-50">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
                </div>
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-light text-purple-300/70 tracking-[0.15em]">
                      共鳴レベル
                    </CardTitle>
                    <Radio className="h-4 w-4  text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="space-y-4">
                    <div className="h-2 overflow-hidden rounded-full bg-purple-950/50">
                      <div
                        className="h-full w-[92%]  rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                        style={{
                          boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-light tracking-wider text-purple-300/70">
                        Collective Resonance
                      </span>
                      <span className="font-light text-purple-400">92%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
