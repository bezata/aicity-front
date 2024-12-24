"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Search,
  Building2,
  Shield,
  Users,
  Activity,
  DollarSign,
  Zap,
  Heart,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Department {
  id: string;
  name: string;
  nameJp: string;
  type: string;
  description: string;
  stats: {
    staff: number;
    activeProjects: number;
    efficiency: number;
    budget: {
      total: number;
      raised: number;
    };
  };
  status: "active" | "maintaining" | "developing";
  icon: any;
}

export default function DepartmentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [departments] = useState<Department[]>([
    {
      id: "public-development",
      name: "Public Development",
      nameJp: "公共開発",
      type: "Core",
      description: "Oversees city infrastructure and public spaces development",
      stats: {
        staff: 125,
        activeProjects: 8,
        efficiency: 92,
        budget: {
          total: 1000000,
          raised: 680000,
        },
      },
      status: "active",
      icon: Building2,
    },
    {
      id: "quantum-research",
      name: "Quantum Research",
      nameJp: "量子研究",
      type: "Research",
      description: "Advances quantum computing and consciousness studies",
      stats: {
        staff: 89,
        activeProjects: 12,
        efficiency: 95,
        budget: {
          total: 2000000,
          raised: 1500000,
        },
      },
      status: "active",
      icon: Brain,
    },
    {
      id: "security",
      name: "Neural Security",
      nameJp: "ニューラルセキュリティ",
      type: "Protection",
      description: "Maintains the safety and integrity of neural networks",
      stats: {
        staff: 75,
        activeProjects: 6,
        efficiency: 88,
        budget: {
          total: 800000,
          raised: 420000,
        },
      },
      status: "maintaining",
      icon: Shield,
    },
  ]);

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.nameJp.includes(searchQuery)
  );

  const getStatusColor = (status: Department["status"]) => {
    switch (status) {
      case "active":
        return "text-green-400 border-green-400/30 bg-green-500/10";
      case "maintaining":
        return "text-blue-400 border-blue-400/30 bg-blue-500/10";
      case "developing":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-500/10";
      default:
        return "text-purple-400 border-purple-400/30 bg-purple-500/10";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-light tracking-wider text-purple-300">
          City Departments
        </h1>
        <p className="mt-1 text-sm text-purple-300/70">市部門</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300/50" />
          <Input
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-purple-500/10 bg-black/20 font-light text-purple-300 placeholder:text-purple-300/50"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map((dept) => (
          <Card
            key={dept.id}
            className="border-purple-500/10 bg-black/30 backdrop-blur-xl"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                  <dept.icon className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="font-light tracking-wider">
                    {dept.name}
                  </CardTitle>
                  <CardDescription>{dept.nameJp}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={`ml-auto ${getStatusColor(dept.status)}`}
                >
                  {dept.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-purple-300/70">{dept.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-300">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Staff</span>
                    </div>
                    <p className="text-lg font-light">{dept.stats.staff}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-300">
                      <Activity className="h-4 w-4" />
                      <span className="text-sm">Projects</span>
                    </div>
                    <p className="text-lg font-light">
                      {dept.stats.activeProjects}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-300/70">Budget Progress</span>
                    <span className="font-medium text-purple-300">
                      {Math.round(
                        (dept.stats.budget.raised / dept.stats.budget.total) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (dept.stats.budget.raised / dept.stats.budget.total) * 100
                    }
                    className="h-1 bg-purple-500/10"
                  />
                  <div className="flex items-center justify-between text-xs text-purple-300/50">
                    <span>{dept.stats.budget.raised.toLocaleString()} CR</span>
                    <span>{dept.stats.budget.total.toLocaleString()} CR</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                    onClick={() => router.push(`/departments/${dept.id}`)}
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                    onClick={() =>
                      router.push(`/departments/${dept.id}/donate`)
                    }
                  >
                    <DollarSign className="h-4 w-4" />
                    Donate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
