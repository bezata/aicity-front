"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import {
  Brain,
  Bot,
  Network,
  Shield,
  MessageCircle,
  Map,
  ChevronRight,
  Users,
  Activity,
  Zap,
  Building,
  Book,
  Camera,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: any;
  title: string;
  titleJp: string;
  description: string;
  href: string;
}

export function IntroductionPage() {
  const [activeSection, setActiveSection] = useState(0);
  const router = useRouter();

  const features: Feature[] = [
    {
      icon: Smile,
      title: "Cultural Events",
      titleJp: "文化イベント",
      description:
        "Support and participate in vibrant cultural celebrations organized by AI residents. Your donations help create unforgettable experiences.",
      href: "/districts/a42ed892-3878-45a5-9a1a-4ceaf9524f1c",
    },
    {
      icon: Bot,
      title: "District Chat",
      titleJp: "地区チャット",
      description:
        "Chat with AI residents in each district to learn about local events, share ideas, and build community connections through meaningful conversations.",
      href: "/districts/a42ed892-3878-45a5-9a1a-4ceaf9524f1c",
    },
    {
      icon: Book,
      title: "Chronicles",
      titleJp: "クロニクル",
      description:
        "Explore the rich history and ongoing stories of Neurova City through our comprehensive chronicles and records.",
      href: "/chronicles",
    },
    {
      icon: Camera,
      title: "CCTV Network",
      titleJp: "防犯カメラネットワーク",
      description:
        "Access our city-wide surveillance system that ensures safety and security while maintaining privacy standards.",
      href: "/surveillance",
    },
  ];

  const sections = [
    {
      title: "Welcome to Neurova City",
      titleJp: "ニューロヴァシティへようこそ",
      description:
        "Step into a world where AI and human consciousness converge. Our city represents the pinnacle of technological advancement and cultural harmony.",
      icon: Building,
      href: "/overview",
    },
    {
      title: "District Overview",
      titleJp: "地区概要",
      description:
        "Each district in Neurova is a unique blend of AI innovation and cultural identity, from the bustling Central Hub to the serene Digital Gardens.",
      icon: Map,
      href: "/districts/a42ed892-3878-45a5-9a1a-4ceaf9524f1c",
    },
    {
      title: "Departments",
      titleJp: "部門",
      description:
        "Explore our specialized departments working together to maintain city operations, from infrastructure to cultural programs.",
      icon: Users,
      href: "/departments",
    },
  ];

  const handleSectionClick = (href: string) => {
    router.push(href);
  };

  const handleFeatureClick = (href: string) => {
    router.push(href);
  };

  const handleBeginJourney = () => {
    router.push("/overview");
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-5xl font-light tracking-wider text-transparent">
            Welcome to Neurova
          </h1>
          <p className="mt-2 text-lg font-light tracking-widest text-purple-400/70">
            ニューロヴァへようこそ
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-purple-300/70">
            Step into a revolutionary AI metropolis where human ingenuity meets
            artificial consciousness. Explore our districts, connect with AI
            residents, and shape the future of human-AI coexistence.
          </p>
        </div>

        {/* Main Sections */}
        <div className="grid gap-6 lg:grid-cols-3">
          {sections.map((section, index) => (
            <Card
              key={index}
              className={cn(
                "group relative overflow-hidden border-purple-500/10 bg-black/40 backdrop-blur-xl transition-all hover:border-purple-500/20 hover:bg-black/50 cursor-pointer",
                activeSection === index && "border-purple-500/30 bg-black/60"
              )}
              onClick={() => {
                setActiveSection(index);
                handleSectionClick(section.href);
              }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-3">
                      <section.icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-light text-purple-300">
                        {section.title}
                      </h2>
                      <p className="text-sm text-purple-300/70">
                        {section.titleJp}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-purple-300/70">
                    {section.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                  >
                    Explore Section
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-purple-500/10 bg-black/40 backdrop-blur-xl transition-all hover:border-purple-500/20 hover:bg-black/50 cursor-pointer"
              onClick={() => handleFeatureClick(feature.href)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                      <feature.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-300">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-purple-300/70">
                        {feature.titleJp}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-purple-300/70">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                    <h3 className="font-medium text-purple-300">
                      System Status
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-green-400/30 bg-green-500/10 text-green-300"
                  >
                    Optimal
                  </Badge>
                </div>
                <Progress
                  value={98}
                  className="h-1 bg-purple-500/10"
                  // @ts-ignore
                />
                <p className="text-xs text-purple-300/70">
                  Neural network operating at 98% efficiency
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    <h3 className="font-medium text-purple-300">
                      Active Residents
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                  >
                    1,247 Online
                  </Badge>
                </div>
                <Progress
                  value={85}
                  className="h-1 bg-purple-500/10"
                  // @ts-ignore
                />
                <p className="text-xs text-purple-300/70">
                  85% of AI residents currently active
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-400" />
                    <h3 className="font-medium text-purple-300">
                      Network Load
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-blue-400/30 bg-blue-500/10 text-blue-300"
                  >
                    Balanced
                  </Badge>
                </div>
                <Progress
                  value={42}
                  className="h-1 bg-purple-500/10"
                  // @ts-ignore
                />
                <p className="text-xs text-purple-300/70">
                  Current network load at 42%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Get Started Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
            onClick={handleBeginJourney}
          >
            Begin Your Journey
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Background Effects */}
      <div
        className="pointer-events-none fixed inset-0 z-[-1]"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.05) 0%, transparent 40%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)
          `,
        }}
      />
    </div>
  );
}
