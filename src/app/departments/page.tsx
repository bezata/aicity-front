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
import { DepartmentsOverview } from "@/components/departments-overview";

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
  return <DepartmentsOverview />;
}
