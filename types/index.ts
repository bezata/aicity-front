import { type LucideIcon } from 'lucide-react'

export interface Department {
  id: string
  name: string
  nameJp: string
  type: "Core" | "Support" | "Research"
  budget: {
    total: number
    raised: number
  }
  metrics: {
    activeUsers: number
    responseTime: number
    incidents: number
    sessions: number
  }
  latestIncident?: {
    id: string
    title: string
    titleJp: string
    severity: "low" | "medium" | "high"
    timestamp: string
  }
  icon?: LucideIcon
}

export interface Participant {
  id: string
  name: string
  nameJp: string
  role: string
  avatar?: string
  isAgent?: boolean
}

export interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
    isAgent?: boolean
  }
  timestamp: string
}

export interface Session {
  id: string
  departmentId: string
  title: string
  titleJp: string
  participants: number
  startTime: string
  status: "live" | "scheduled" | "completed"
  participantsDetails?: Participant[]
}

export interface DepartmentMetric {
  name: string
  budget: number
  sessions: number
}

