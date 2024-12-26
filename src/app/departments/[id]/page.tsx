"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { Building2, Shield, Brain, Users, Activity } from "lucide-react";
import { DepartmentPage } from "@/components/department-page";
import { LoadingScreen } from "@/components/loading-screen";
import { MainLayout } from "@/components/main-layout";

function getIcon(type: string) {
  switch (type.toLowerCase()) {
    case "economy":
      return Building2;
    case "emergency_response":
      return Shield;
    case "law_enforcement":
      return Shield;
    default:
      return Activity;
  }
}

interface Department {
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
  icon?: any;
}

export default function Page() {
  const params = useParams();
  const [department, setDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartment() {
      try {
        const response = await fetch("http://localhost:3001/api/departments");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch departments: ${response.statusText}`
          );
        }

        const departments = await response.json();
        const dept = departments.find((d: Department) => d.id === params.id);

        if (!dept) {
          notFound();
          return;
        }

        setDepartment({
          ...dept,
          status: "active",
          icon: getIcon(dept.type),
        });
      } catch (error) {
        console.error("Error fetching department:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }

    fetchDepartment();
  }, [params.id]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!department) {
    return null;
  }

  return (
    <MainLayout>
      <DepartmentPage department={department} />
    </MainLayout>
  );
}
