"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Activity, DollarSign } from "lucide-react";
import { DepartmentSessions } from "./department-sessions";
import React from "react";

interface DepartmentPageProps {
  department: {
    id: string;
    name: string;
    type: string;
    description: string;
    assignedAgents: string[];
    activeChats: any[];
    currentProjects: any[];
    metrics: {
      efficiency: number;
      responseTime: number;
      successRate: number;
      collaborationScore: number;
    };
    budget: {
      total: number;
      allocated: number;
      spent: number;
      donations: number;
      expenses: any[];
      donations_history: any[];
    };
    status?: string;
    icon?: React.ElementType;
  };
}

export function DepartmentPage({ department }: DepartmentPageProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-6 gap-2 text-purple-300 hover:text-purple-200"
        onClick={() => router.push("/departments")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Departments
      </Button>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                  {department.icon &&
                    React.createElement(department.icon, {
                      className: "h-6 w-6 text-purple-400",
                    })}
                </div>
                <div>
                  <CardTitle className="text-2xl font-light tracking-wider">
                    {department.name}
                  </CardTitle>
                  <CardDescription>{department.description}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="ml-auto border-green-400/30 bg-green-500/10 text-green-300"
                >
                  {department.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-purple-500/10 bg-black/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        <h3 className="font-medium text-purple-300">Staff</h3>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-2xl font-light text-purple-300">
                          {department.assignedAgents.length}
                        </p>
                        <Badge
                          variant="outline"
                          className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                        >
                          Active Members
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-500/10 bg-black/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-400" />
                        <h3 className="font-medium text-purple-300">
                          Projects
                        </h3>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-2xl font-light text-purple-300">
                          {department.currentProjects.length}
                        </p>
                        <Badge
                          variant="outline"
                          className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                        >
                          In Progress
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-300/70">
                      Department Efficiency
                    </span>
                    <span className="font-medium text-purple-300">
                      {Math.round(department.metrics.efficiency * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={department.metrics.efficiency * 100}
                    className="h-1 bg-purple-500/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-light tracking-wider">
                Support Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-300/70">Budget Progress</span>
                    <span className="font-medium text-purple-300">
                      {Math.round(
                        (department.budget.allocated /
                          department.budget.total) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (department.budget.allocated / department.budget.total) *
                      100
                    }
                    className="h-2 bg-purple-500/10"
                  />
                  <div className="flex items-center justify-between text-sm text-purple-300/50">
                    <span>
                      {department.budget.allocated.toLocaleString()} CR
                      allocated
                    </span>
                    <span>
                      {department.budget.total.toLocaleString()} CR total
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                  onClick={() =>
                    router.push(`/departments/${department.id}/donate`)
                  }
                >
                  <DollarSign className="h-4 w-4" />
                  Support Department
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <DepartmentSessions />
      </div>
    </div>
  );
}
