import { type LucideIcon } from 'lucide-react'

export interface DepartmentStats {
  staff: number
  activeProjects: number
  efficiency: number
  budget: {
    total: number
    raised: number
  }
}

export interface Department {
  id: string
  name: string
  nameJp: string
  type: "Core" | "Support" | "Research" | "Development"
  description: string
  longDescription: string
  stats: DepartmentStats
  status: "active" | "inactive" | "maintenance"
  icon: LucideIcon
}

