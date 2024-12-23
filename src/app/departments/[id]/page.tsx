import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2 } from "lucide-react";
import { DepartmentPage } from "@/components/department-page";

interface Department {
  id: string;
  name: string;
  nameJp: string;
  icon: React.ElementType;
  status: string;
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
}

// In a real app, this would be fetched from an API
async function getDepartment(id: string): Promise<Department> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // This is mock data - in a real app, fetch from API
  const department = {
    id: "public-development",
    name: "Public Development",
    nameJp: "公共開発",
    type: "Core",
    description: "Oversees city infrastructure and public spaces development",
    longDescription: `The Public Development department is responsible for maintaining and expanding the city's infrastructure, ensuring optimal resource distribution, and implementing new development protocols. Working closely with quantum architects and neural engineers, the department strives to create harmonious spaces that enhance the collective consciousness of our citizens.`,
    stats: {
      staff: 125,
      activeProjects: 8,
      efficiency: 92,
      budget: {
        total: 1000000,
        raised: 680000,
      },
    },
    status: "active" as const,
    icon: Building2,
  };

  if (id !== department.id) {
    return notFound();
  }

  return department;
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
