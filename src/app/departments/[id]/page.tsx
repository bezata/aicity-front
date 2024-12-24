import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, Shield, Brain, Users, Activity } from "lucide-react";
import { DepartmentPage } from "@/components/department-page";

function getIcon(type: string) {
  switch (type.toLowerCase()) {
    case "core":
      return Building2;
    case "security":
      return Shield;
    case "research":
      return Brain;
    case "community":
      return Users;
    default:
      return Activity;
  }
}

interface Department {
  id: string;
  name: string;
  nameJp: string;
  type: string;
  description: string;
  longDescription: string;
  stats: {
    staff: number;
    activeProjects: number;
    efficiency: number;
    budget: {
      total: number;
      raised: number;
      remaining: number;
    };
  };
  status: string;
  icon: any;
}

async function getDepartment(id: string): Promise<Department> {
  try {
    const response = await fetch(`http://localhost:3001/api/departments/${id}`);
    const { data } = await response.json();

    const department = {
      id: id,
      name: data.name,
      nameJp: data.nameJp,
      type: data.type,
      description: data.description,
      longDescription: data.longDescription,
      stats: {
        staff: data.stats.staff,
        activeProjects: data.stats.activeProjects,
        efficiency: data.stats.efficiency,
        budget: {
          total: data.stats.budget.total,
          raised: data.stats.budget.raised,
          remaining: data.stats.budget.total - data.stats.budget.raised,
        },
      },
      status: "active",
      icon: getIcon(data.type),
    };

    return department;
  } catch (error) {
    console.error("Error fetching department:", error);
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const department = await getDepartment(params.id);

  return {
    title: `${department.name} - AI City Departments`,
    description: department.description,
    openGraph: {
      title: `${department.name} - AI City Departments`,
      description: department.description,
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const department = await getDepartment(params.id);

  return <DepartmentPage department={department} />;
}
