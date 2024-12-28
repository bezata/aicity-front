"use client";

import { useRouter } from "next/navigation";
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

import {
  Activity,
  AlertCircle,
  ArrowRight,
  Brain,
  Building2,
  Cloud,
  Globe,
  Heart,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { NeuralBrainAnimation } from "./neural-brain-animation";
import { CityVitals } from "./city-vitals";
import { MetricsDashboard } from "./metrics-dashboard";
import { LoadingScreen } from "./loading-screen";

interface District {
  id: string;
  name: string;
  type: string;
  population: number;
  metrics: {
    safety: number;
    cleanliness: number;
    noise: number;
    crowding: number;
    ambiance: number;
    education: number;
    healthcare: number;
    environment: number;
    economicGrowth: number;
    propertyValues: number;
    businessActivity: number;
    infrastructureQuality: number;
    publicServiceAccess: number;
    transportEfficiency: number;
    culturalVibrancy: number;
    communityWellbeing: number;
    socialCohesion: number;
    energyEfficiency: number;
    greenSpaceCoverage: number;
    environmentalHealth: number;
  };
  socialMetrics: {
    communityEngagement: number;
    culturalDiversity: number;
    socialCohesion: number;
    publicServices: number;
    index: number;
  };
  amenities: {
    schools: number;
    hospitals: number;
    parks: number;
    shops: number;
  };
}

interface CityMetrics {
  consciousness: number;
  harmony: number;
  energy: number;
  activity: number;
  population: number;
  activeEntities: number;
  emergencyLevel: string;
  incidents: number;
  safetyScore: number;
  responseTime: string;
  serviceAvailability: number;
}

export function MainDashboard() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const [systemStatus, setSystemStatus] = useState<
    "normal" | "warning" | "critical"
  >("normal");
  const [cityMetrics, setCityMetrics] = useState<CityMetrics>({
    consciousness: 95,
    harmony: 92,
    energy: 88,
    activity: 90,
    population: 15234,
    activeEntities: 12453,
    emergencyLevel: "low",
    incidents: 2,
    safetyScore: 95,
    responseTime: "N/A",
    serviceAvailability: 0,
  });
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data every 10 minutes
  useEffect(() => {
    const districtId = "a42ed892-3878-45a5-9a1a-4ceaf9524f1c";

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch districts
        const districtsResponse = await fetch(`/api/districts/`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY || "",
          },
        });
        const districtsData = await districtsResponse.json();
        if (districtsData.success && districtsData.data) {
          console.log("Districts data:", districtsData.data); // Debug log
          setDistricts(districtsData.data);
        }

        // Fetch metrics in parallel
        const [metricsResponse, vitalsResponse, safetyResponse] =
          await Promise.all([
            fetch(`/api/districts/${districtId}/metrics`, {
              headers: {
                "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY || "",
              },
            }),
            fetch(`/api/districts/${districtId}/vitals`, {
              headers: {
                "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY || "",
              },
            }),
            fetch(`/api/districts/${districtId}/metrics/safety`, {
              headers: {
                "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY || "",
              },
            }),
          ]);

        const [metrics, vitals, safety] = await Promise.all([
          metricsResponse.json(),
          vitalsResponse.json(),
          safetyResponse.json(),
        ]);

        console.log("Safety metrics received:", safety); // Debug log

        // Update all metrics in a single state update
        setCityMetrics((prev) => {
          const newState = {
            ...prev,
            // Safety metrics from dedicated endpoint
            safetyScore: safety.overallScore,
            incidents: safety.recentIncidents,
            responseTime: safety.responseTime,
            serviceAvailability: safety.serviceAvailability,
            // Population metrics
            population: vitals.populationCount,
            activeEntities: vitals.activeEntities,
            // Map other metrics
            consciousness: Math.round(
              (metrics.data.communityWellbeing + metrics.data.socialCohesion) *
                50
            ),
            harmony: Math.round(metrics.data.socialCohesion * 100),
            energy: Math.round(metrics.data.energyEfficiency * 100),
            activity: Math.round(metrics.data.businessActivity * 100),
          };
          console.log("Updated city metrics:", newState); // Debug log
          return newState;
        });

        // Update system status based on metrics
        const overallHealth =
          (safety.overallScore / 100 + // Convert percentage to decimal
            metrics.data.environmentalHealth +
            metrics.data.infrastructureQuality) /
          3;

        setSystemStatus(
          overallHealth > 0.7
            ? "normal"
            : overallHealth > 0.4
            ? "warning"
            : "critical"
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    // Initial fetch
    fetchData();

    // Set up interval for subsequent fetches (10 minutes)
    const interval = setInterval(fetchData, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []); // Single effect for all data fetching

  // Add debug log for districts state
  useEffect(() => {
    console.log("Current districts:", districts);
  }, [districts]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 40%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="border-b border-purple-500/10 bg-black/30 backdrop-blur-xl">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-light tracking-wider text-purple-300">
                  AI City Interface
                </h1>
                <p className="mt-1 text-sm text-purple-300/70">
                  量子意識ネットワーク
                </p>
              </div>
              <Badge
                variant="outline"
                className={`
                  ${
                    systemStatus === "normal"
                      ? "border-green-400/30 bg-green-500/10 text-green-300"
                      : systemStatus === "warning"
                      ? "border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
                      : "border-red-400/30 bg-red-500/10 text-red-300"
                  }
                `}
              >
                System Status: {systemStatus?.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="container py-6">
          <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
            {/* Left Column - Brain and Vitals */}
            <div className="space-y-6">
              {/* Neural Brain Visualization */}
              <Card className="relative border-purple-500/10 bg-black/40 backdrop-blur-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-light tracking-wider">
                    Neural Network
                  </CardTitle>
                  <CardDescription>Active Consciousness Field</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <NeuralBrainAnimation />
                  </div>
                </CardContent>
              </Card>

              {/* City Vitals */}
              <CityVitals {...cityMetrics} />

              {/* Emergency Status */}
              <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="font-light tracking-wider flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Safety Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-purple-300/70">Safety Score</p>
                      <p className="text-2xl font-light text-purple-300">
                        {cityMetrics.safetyScore}%
                      </p>
                      <Progress
                        value={cityMetrics.safetyScore}
                        className="h-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-purple-300/70">
                        Active Incidents
                      </p>
                      <p className="text-2xl font-light text-purple-300">
                        {cityMetrics.incidents}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Districts and Metrics */}
            <div className="space-y-6">
              {/* Districts Grid */}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {districts.map((district) => (
                  <Card
                    key={district.id}
                    className="border-purple-500/10 bg-black/40 backdrop-blur-xl"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                          {district.type === "commercial" ? (
                            <Building2 className="h-5 w-5 text-purple-400" />
                          ) : district.type === "residential" ? (
                            <Users className="h-5 w-5 text-purple-400" />
                          ) : district.type === "industrial" ? (
                            <Activity className="h-5 w-5 text-purple-400" />
                          ) : (
                            <Globe className="h-5 w-5 text-purple-400" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2 font-light tracking-wider">
                            {district.name}
                            <Badge
                              variant="outline"
                              className="text-xs font-normal capitalize text-purple-400/70"
                            >
                              {district.type}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            Population: {district.population.toLocaleString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-purple-300/70">
                            Social Harmony
                          </span>
                          <span className="font-medium text-purple-300">
                            {`${(
                              district.socialMetrics.socialCohesion * 100
                            ).toFixed(0)}%`}
                          </span>
                        </div>
                        <Progress
                          value={district.socialMetrics.socialCohesion * 100}
                          className="h-1 bg-purple-500/10"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-between border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                        onClick={() => router.push(`/districts/${district.id}`)}
                      >
                        Enter District
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  icon={Users}
                  title="Population"
                  value={cityMetrics.population.toLocaleString()}
                  subValue={`${cityMetrics.activeEntities.toLocaleString()} Active`}
                />
                <MetricCard
                  icon={Activity}
                  title="System Load"
                  value="92%"
                  subValue="Optimal"
                />
                <MetricCard
                  icon={Heart}
                  title="City Health"
                  value="95%"
                  subValue="Excellent"
                />
              </div>
              <div className="mt-6">
                <MetricsDashboard districtId="main" />
              </div>
            </div>
          </div>

          {/* Metrics Dashboard - Moved below the main grid */}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  subValue,
}: {
  icon: any;
  title: string;
  value: string;
  subValue: string;
}) {
  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-normal">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-light text-purple-300">{value}</div>
        <p className="text-sm text-purple-300/70">{subValue}</p>
      </CardContent>
    </Card>
  );
}
