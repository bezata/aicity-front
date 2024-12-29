"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "./loading-screen";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, Sparkles, Users, Star, Activity } from "lucide-react";

interface CulturalItem {
  id: string;
  type: string;
  title: string;
  description: string;
  popularity: number;
  participants: string[];
  timestamp: number;
}

interface CachedData {
  data: CulturalItem[];
  timestamp: number;
}

const CACHE_KEY = "cultural_items_cache";
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
const MAX_ITEMS = 4;

const typeIcons: { [key: string]: any } = {
  cultural_ceremony: Sparkles,
  traditional_festival: Star,
  heritage_gathering: Globe,
  ethnic_celebration: Users,
};

// Formatting utilities
const formatLine = (line: string, key: any): React.ReactNode => {
  if (!line.trim()) return null;

  // Handle bullet points
  if (line.trim().startsWith("*")) {
    return (
      <li key={key} className="text-sm text-purple-300/70 ml-4">
        {line.replace(/^\s*\*\s*/, "•").trim()}
      </li>
    );
  }

  // Handle numbered lists
  if (line.trim().match(/^\d+\./)) {
    return (
      <li key={key} className="text-sm text-purple-300/70 ml-4">
        {line.replace(/^\s*\d+\.\s*/, "").trim()}
      </li>
    );
  }

  // Regular text
  return (
    <p key={key} className="text-sm text-purple-300/70">
      {line.trim()}
    </p>
  );
};

const formatDetailedDescription = (description: string): React.ReactNode => {
  const sections = description
    .split(/\n(?=\*\*[^*]+\*\*:|###)/)
    .map((section) => {
      // Handle section headers
      if (section.startsWith("**")) {
        const [header, ...content] = section.split("\n");
        return (
          <div key={header} className="mb-6">
            <h3 className="text-sm font-medium text-purple-300 mb-2">
              {header.replace(/\*\*/g, "").replace(":", "")}
            </h3>
            <div className="space-y-2">
              {content.map((line, idx) => formatLine(line, idx))}
            </div>
          </div>
        );
      }
      // Handle ### headers
      if (section.startsWith("###")) {
        const [header, ...content] = section.split("\n");
        return (
          <div key={header} className="mb-6">
            <h3 className="text-sm font-medium text-purple-300 mb-2">
              {header.replace(/^###\s*/, "")}
            </h3>
            <div className="space-y-2">
              {content.map((line, idx) => formatLine(line, idx))}
            </div>
          </div>
        );
      }
      return formatLine(section, section);
    });

  return <div className="space-y-4">{sections}</div>;
};

const formatDescription = (description: string): string => {
  // Get first paragraph before any markdown sections
  const firstParagraph = description
    .split(/\n\*\*|\n###/)[0]
    .replace(/^\*\*[^:]+:\s*/, "") // Remove section headers like "**Cultural Context:**"
    .replace(/^###\s*/, "") // Remove ### headers
    .replace(/\*\*/g, "") // Remove any remaining **
    .replace(/##\s*/, "") // Remove ## headers
    .replace(/\"|\:/g, "")
    .trim();

  return firstParagraph;
};

const formatTitle = (title: string): string => {
  return title
    .replace(/^##\s*/, "") // Remove leading ##
    .replace(/^###\s*/, "") // Remove leading ###
    .replace(/\*\*/g, "") // Remove **
    .replace(/\"|\:/g, "")
    .replace(/Title\:/g, "")
    .trim();
};

export function CulturalShowcase() {
  const apiKey = process.env.BACKEND_API_KEY;
  const [culturalItems, setCulturalItems] = useState<CulturalItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CulturalItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkCacheValidity = (): CulturalItem[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp }: CachedData = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error checking cache:", error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  const updateCache = (data: CulturalItem[]) => {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error updating cache:", error);
    }
  };

  useEffect(() => {
    const fetchCulturalItems = async () => {
      try {
        setIsLoading(true);

        // Fetch fresh data first
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/culture/popular`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(apiKey && { "x-api-key": apiKey }),
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          updateCache(data.data);
          setCulturalItems(data.data.slice(-MAX_ITEMS));
        }

        // Only check cache if fetch fails
      } catch (error) {
        console.error("Error fetching cultural items:", error);

        // Try to get data from cache if fetch fails
        const cachedData = checkCacheValidity();
        if (cachedData) {
          setCulturalItems(cachedData.slice(-MAX_ITEMS));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCulturalItems();
  }, []);

  const gridCols = culturalItems.length <= 2 ? 1 : 2;
  const scrollHeight = culturalItems.length <= 2 ? "h-[300px]" : "h-[600px]";

  return (
    <>
      <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-2xl font-light tracking-wider text-transparent">
                Cultural Expressions
              </CardTitle>
              <p className="text-sm font-light tracking-widest text-purple-400/70">
                カルチャーエクスプレッション
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-purple-400/30 bg-purple-500/10 text-purple-300"
            >
              Latest Events
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className={`${scrollHeight} pr-4`}>
            <div
              className={`grid gap-4 ${gridCols === 1 ? "" : "md:grid-cols-2"}`}
            >
              {culturalItems.map((item) => {
                const Icon = typeIcons[item.type] || Globe;
                const title = formatTitle(item.title);
                const description = formatDescription(item.description);

                return (
                  <Card
                    key={item.id}
                    className="group relative overflow-hidden border-purple-500/10 bg-black/40 backdrop-blur-xl transition-all hover:border-purple-500/20 hover:bg-black/50"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                            <Icon className="h-4 w-4 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-purple-300">
                              {title}
                            </p>
                            <p className="text-xs text-purple-300/70">
                              {item.type.replace(/_/g, " ")}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-sm text-purple-300/70 line-clamp-2">
                            {description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-purple-300/50">
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                <span>{item.popularity}% popularity</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 w-full gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                              onClick={() => setSelectedItem(item)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="border-purple-500/10 bg-black/90 text-purple-50 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-light tracking-wider">
                  {formatTitle(selectedItem.title)}
                </DialogTitle>
                <Badge
                  variant="outline"
                  className="w-fit border-purple-400/30 bg-purple-500/10 text-purple-300"
                >
                  {selectedItem.type.replace(/_/g, " ")}
                </Badge>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {formatDetailedDescription(selectedItem.description)}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
