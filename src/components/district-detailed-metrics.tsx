"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Trees as Tree,
  Music,
  Building2,
  DollarSign,
  PartyPopper,
  Building,
  Train,
  Zap,
  Wifi,
  Wrench,
  ShieldCheck,
  TrendingUp,
  Wallet,
  LineChart,
  Sparkles,
  Shield,
  Heart,
  Globe,
  Activity,
  Recycle,
} from "lucide-react";

interface MetricCategory {
  id: string;
  name: string;
  nameJp: string;
  icon: any;
  metrics: {
    id: string;
    name: string;
    value: number;
    trend: "up" | "down" | "stable";
    icon: any;
  }[];
}

interface ApiError {
  message: string;
  status: number;
}

const DISTRICT_ID = "a42ed892-3878-45a5-9a1a-4ceaf9524f1c";

export function DistrictDetailedMetrics() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [data, setData] = useState<MetricCategory[]>([]);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/districts/${DISTRICT_ID}/metrics`);
      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }
      const metricsData = await response.json();
      setData(metricsData);
      setError(null);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "An error occurred",
        status: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading metrics...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">Error: {error.message}</div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        defaultValue="overview"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((category) => (
              <Card key={category.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {category.name}
                  </CardTitle>
                  {category.icon && (
                    <category.icon className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {category.metrics.map((metric) => (
                      <div key={metric.id} className="mb-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {metric.icon && <metric.icon className="h-4 w-4" />}
                            <span className="text-sm font-medium">
                              {metric.name}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {metric.value}%
                          </span>
                        </div>
                        <Progress value={metric.value} />
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="detailed">
          <div className="grid gap-4">
            {data.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {category.metrics.map((metric) => (
                      <div key={metric.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          {metric.icon && <metric.icon className="h-4 w-4" />}
                          <span className="font-medium">{metric.name}</span>
                        </div>
                        <Progress value={metric.value} />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{metric.value}%</span>
                          <span>
                            {metric.trend === "up" && "↑"}
                            {metric.trend === "down" && "↓"}
                            {metric.trend === "stable" && "→"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
