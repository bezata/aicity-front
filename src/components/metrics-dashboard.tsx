"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Cloud,
  Thermometer,
  Wind,
  Droplets,
  AlertCircle,
  Users,
  Leaf,
  VolumeX,
  Users2,
  Calendar,
  MessageCircle,
  Shield,
  Zap,
  Droplet,
  Recycle,
  Train,
  Car,
  Building2,
  TrendingUp,
  Music,
  Wrench,
  DollarSign,
  Clock,
  Heart,
} from "lucide-react";

interface MetricsDashboardProps {
  districtId: string;
}

// First define the type for the metrics data
type MetricsData = {
  weather: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    windDirection: string;
  };
  environmental: {
    airQuality: number;
    noiseLevel: number;
    waterQuality: number;
    greenCoverage: number;
    emissions: number;
  };
  emergency: {
    level: "normal" | "warning" | "critical";
    activeIncidents: number;
    responseTeamsAvailable: number;
  };
  vitals: {
    populationCount: number;
    activeEntities: number;
    visitorCount: number;
    peakHoursStatus: string;
  };
  community: {
    activeEvents: number;
    ongoingMeetings: number;
    collaborationSessions: number;
    chatActivity: string;
  };
  safety: {
    overallScore: number;
    recentIncidents: number;
    responseTime: string;
    serviceAvailability: number;
  };
  resources: {
    energyConsumption: number;
    waterUsage: number;
    wasteManagement: number;
    efficiency: number;
  };
  transport: {
    trafficDensity: number;
    publicTransportLoad: number;
    parkingAvailable: number;
    avgTransitTime: number;
  };
  economic: {
    businessActivity: number;
    growthRate: number;
    activeTransactions: number;
    marketSentiment: string;
  };
  cultural: {
    eventAttendance: number;
    culturalSiteVisits: number;
    communityEngagement: number;
    socialCohesion: number;
  };
  infrastructure: {
    maintenanceRequests: number;
    serviceUptime: number;
    healthScore: number;
    developmentProgress: number;
  };
  budget: {
    currentStatus: number;
    monthlySpending: number;
    efficiency: number;
    allocation: {
      infrastructure: number;
      services: number;
      development: number;
      emergency: number;
    };
  };
  departments: {
    responseTimes: number;
    serviceQuality: number;
    resourceUtilization: number;
    efficiency: number;
  };
};

const fallbackData: MetricsData = {
  weather: {
    temperature: 22,
    feelsLike: 23,
    humidity: 65,
    precipitation: 0,
    windSpeed: 12,
    windDirection: "NE",
  },
  environmental: {
    airQuality: 95,
    noiseLevel: 45,
    waterQuality: 98,
    greenCoverage: 35,
    emissions: 12,
  },
  emergency: {
    level: "normal",
    activeIncidents: 2,
    responseTeamsAvailable: 8,
  },
  vitals: {
    populationCount: 15234,
    activeEntities: 12453,
    visitorCount: 892,
    peakHoursStatus: "moderate",
  },
  community: {
    activeEvents: 12,
    ongoingMeetings: 5,
    collaborationSessions: 8,
    chatActivity: "high",
  },
  safety: {
    overallScore: 95,
    recentIncidents: 3,
    responseTime: "2.5 min",
    serviceAvailability: 98,
  },
  resources: {
    energyConsumption: 82,
    waterUsage: 78,
    wasteManagement: 88,
    efficiency: 92,
  },
  transport: {
    trafficDensity: 65,
    publicTransportLoad: 72,
    parkingAvailable: 234,
    avgTransitTime: 18,
  },
  economic: {
    businessActivity: 88,
    growthRate: 4.2,
    activeTransactions: 1234,
    marketSentiment: "positive",
  },
  cultural: {
    eventAttendance: 85,
    culturalSiteVisits: 450,
    communityEngagement: 78,
    socialCohesion: 82,
  },
  infrastructure: {
    maintenanceRequests: 12,
    serviceUptime: 99.9,
    healthScore: 95,
    developmentProgress: 78,
  },
  budget: {
    currentStatus: 2500000,
    monthlySpending: 180000,
    efficiency: 92,
    allocation: {
      infrastructure: 35,
      services: 25,
      development: 30,
      emergency: 10,
    },
  },
  departments: {
    responseTimes: 95,
    serviceQuality: 92,
    resourceUtilization: 88,
    efficiency: 90,
  },
};

export function MetricsDashboard({ districtId }: MetricsDashboardProps) {
  const [data, setData] = useState<MetricsData>(fallbackData);

  // Fetch metrics data every 10 minutes
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch all metrics in parallel
        const [
          metricsResponse,
          environmentalResponse,
          culturalResponse,
          economicResponse,
          vitalsResponse,
        ] = await Promise.all([
          fetch(`/api/districts/a42ed892-3878-45a5-9a1a-4ceaf9524f1c/metrics`),
          fetch(
            `/api/districts/a42ed892-3878-45a5-9a1a-4ceaf9524f1c/metrics/environmental`
          ),
          fetch(
            `/api/districts/a42ed892-3878-45a5-9a1a-4ceaf9524f1c/metrics/cultural`
          ),
          fetch(
            `/api/districts/a42ed892-3878-45a5-9a1a-4ceaf9524f1c/metrics/economic`
          ),
          fetch(`/api/districts/a42ed892-3878-45a5-9a1a-4ceaf9524f1c/vitals`),
        ]);

        const [metrics, environmental, cultural, economic, vitals] =
          await Promise.all([
            metricsResponse.json(),
            environmentalResponse.json(),
            culturalResponse.json(),
            economicResponse.json(),
            vitalsResponse.json(),
          ]);

        // Update state with combined data
        setData((prev) => ({
          ...prev,
          environmental: {
            airQuality: environmental.airQuality,
            noiseLevel: environmental.noiseLevel,
            waterQuality: metrics.data.environmental.waterQuality,
            greenCoverage: environmental.greenSpaceUsage / 100, // Convert to decimal
            emissions: prev.environmental.emissions, // Keep existing value
          },
          cultural: {
            eventAttendance: cultural.eventAttendance,
            culturalSiteVisits: cultural.culturalSiteVisits,
            communityEngagement: cultural.communityEngagement,
            socialCohesion: cultural.socialCohesion,
          },
          economic: {
            businessActivity: economic.businessActivity,
            growthRate: economic.growthRate,
            activeTransactions: economic.activeTransactions,
            marketSentiment: economic.marketSentiment,
          },
          vitals: {
            populationCount: vitals.populationCount,
            activeEntities: vitals.activeEntities,
            visitorCount: vitals.visitorCount,
            peakHoursStatus: vitals.peakHoursStatus,
          },
        }));
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    // Initial fetch
    fetchMetrics();

    // Set up interval for subsequent fetches (10 minutes)
    const interval = setInterval(fetchMetrics, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [districtId]);

  return (
    <ScrollArea className="h-[calc(100vh-5rem)]">
      <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Critical Status Section */}
        <Card className="col-span-full border-purple-500/10 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-light tracking-wider">
                Critical Status
              </CardTitle>
              <Badge
                variant="outline"
                className={`
                  ${
                    data.emergency.level === "normal"
                      ? "border-green-400/30 bg-green-500/10 text-green-300"
                      : data.emergency.level === "warning"
                      ? "border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
                      : "border-red-400/30 bg-red-500/10 text-red-300"
                  }
                `}
              >
                {data.emergency?.level?.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Weather */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Weather</span>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-purple-500/10 bg-purple-500/5 p-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-3 w-3 text-purple-400" />
                      <span className="text-xs text-purple-300/70">Temp</span>
                    </div>
                    <span className="text-sm text-purple-300">
                      {data.weather.temperature}°C
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-3 w-3 text-purple-400" />
                      <span className="text-xs text-purple-300/70">Wind</span>
                    </div>
                    <span className="text-sm text-purple-300">
                      {data.weather.windSpeed} km/h
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Emergency</span>
                </div>
                <div className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300/70">
                      Active Incidents
                    </span>
                    <span className="text-sm text-purple-300">
                      {data.emergency.activeIncidents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300/70">
                      Response Teams
                    </span>
                    <span className="text-sm text-purple-300">
                      {data.emergency.responseTeamsAvailable}
                    </span>
                  </div>
                </div>
              </div>

              {/* Population */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Population</span>
                </div>
                <div className="rounded-lg border border-purple-500/10 bg-purple-500/5 p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300/70">Total</span>
                    <span className="text-sm text-purple-300">
                      {data.vitals.populationCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-300/70">Active</span>
                    <span className="text-sm text-purple-300">
                      {data.vitals.activeEntities.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environmental & Safety */}
        <MetricGroup
          title="Environmental"
          icon={Leaf}
          metrics={[
            {
              label: "Air Quality",
              value: `${data.environmental.airQuality}%`,
              icon: Cloud,
            },
            {
              label: "Water Quality",
              value: `${data.environmental.waterQuality}`,
              icon: Droplet,
            },
            {
              label: "Emissions",
              value: `${data.environmental.emissions}`,
              icon: VolumeX,
            },
          ]}
        />

        <MetricGroup
          title="Safety"
          icon={Shield}
          metrics={[
            {
              label: "Overall Score",
              value: `${data.safety.overallScore}%`,
              icon: Shield,
            },
            {
              label: "Response Time",
              value: data.safety.responseTime,
              icon: Clock,
            },
            {
              label: "Availability",
              value: `${data.safety.serviceAvailability}%`,
              icon: AlertCircle,
            },
          ]}
        />

        <MetricGroup
          title="Resources"
          icon={Zap}
          metrics={[
            {
              label: "Energy",
              value: `${data.resources.energyConsumption}%`,
              icon: Zap,
            },
            {
              label: "Water",
              value: `${data.resources.waterUsage}%`,
              icon: Droplet,
            },
            {
              label: "Waste",
              value: `${data.resources.wasteManagement}%`,
              icon: Recycle,
            },
          ]}
        />

        {/* Transport & Infrastructure */}
        <MetricGroup
          title="Transport"
          icon={Train}
          metrics={[
            {
              label: "Traffic",
              value: `${data.transport.trafficDensity}%`,
              icon: Car,
            },
            {
              label: "Public Transit",
              value: `${data.transport.publicTransportLoad}%`,
              icon: Train,
            },
            {
              label: "Transit Time",
              value: `${data.transport.avgTransitTime}min`,
              icon: Clock,
            },
          ]}
        />

        <MetricGroup
          title="Infrastructure"
          icon={Building2}
          metrics={[
            {
              label: "Health",
              value: `${data.infrastructure.healthScore}%`,
              icon: Heart,
            },
            {
              label: "Uptime",
              value: `${data.infrastructure.serviceUptime}%`,
              icon: Zap,
            },
            {
              label: "Progress",
              value: `${data.infrastructure.developmentProgress}%`,
              icon: TrendingUp,
            },
          ]}
        />

        {/* Community & Culture */}
        <MetricGroup
          title="Community"
          icon={Users}
          metrics={[
            {
              label: "Events",
              value: data.community.activeEvents.toString(),
              icon: Calendar,
            },
            {
              label: "Meetings",
              value: data.community.ongoingMeetings.toString(),
              icon: Users2,
            },
            {
              label: "Chat Activity",
              value: data.community.chatActivity,
              icon: MessageCircle,
            },
          ]}
        />

        <MetricGroup
          title="Cultural"
          icon={Music}
          metrics={[
            {
              label: "Events",
              value: `${data.cultural.eventAttendance}%`,
              icon: Calendar,
            },
            {
              label: "Engagement",
              value: `${data.cultural.communityEngagement}%`,
              icon: Users,
            },
            {
              label: "Cohesion",
              value: `${data.cultural.socialCohesion}%`,
              icon: Heart,
            },
          ]}
        />

        {/* Economic & Budget */}
        <MetricGroup
          title="Economic"
          icon={TrendingUp}
          metrics={[
            {
              label: "Activity",
              value: `${data.economic.businessActivity}%`,
              icon: TrendingUp,
            },
            {
              label: "Growth",
              value: `${data.economic.growthRate}%`,
              icon: TrendingUp,
            },
            {
              label: "Transactions",
              value: data.economic.activeTransactions.toString(),
              icon: DollarSign,
            },
          ]}
        />

        <MetricGroup
          title="Budget"
          icon={DollarSign}
          metrics={[
            {
              label: "Status",
              value: `$${(data.budget.currentStatus / 1000000).toFixed(1)}M`,
              icon: DollarSign,
            },
            {
              label: "Monthly",
              value: `$${(data.budget.monthlySpending / 1000).toFixed(0)}K`,
              icon: DollarSign,
            },
            {
              label: "Efficiency",
              value: `${data.budget.efficiency}%`,
              icon: TrendingUp,
            },
          ]}
        />
      </div>
    </ScrollArea>
  );
}

interface MetricGroupProps {
  title: string;
  icon: any;
  metrics: {
    label: string;
    value: string;
    icon: any;
  }[];
}

function MetricGroup({ title, icon: Icon, metrics }: MetricGroupProps) {
  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-normal">
          <Icon className="h-4 w-4 text-purple-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const MetricIcon = metric.icon;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MetricIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300/70">
                    {metric.label}
                  </span>
                </div>
                <span className="text-sm font-medium text-purple-300">
                  {metric.value}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
