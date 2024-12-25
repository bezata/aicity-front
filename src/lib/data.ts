import { Building2, Brain, Shield } from 'lucide-react'

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
}

export interface Session {
  id: string
  departmentId: string
  title: string
  titleJp: string
  participants: number
  startTime: string
  status: "live" | "scheduled" | "completed"
}

export const departments: Department[] = [
  {
    id: "neural-ops",
    name: "Neural Operations",
    nameJp: "ニューラル運営",
    type: "Core",
    budget: {
      total: 1000000,
      raised: 750000
    },
    metrics: {
      activeUsers: 1250,
      responseTime: 45,
      incidents: 2,
      sessions: 15
    },
    latestIncident: {
      id: "inc-1",
      title: "Minor neural pathway disruption in Sector 7",
      titleJp: "セクター7での軽度なニューラル経路の混乱",
      severity: "low",
      timestamp: "2 hours ago"
    }
  },
  {
    id: "quantum-research",
    name: "Quantum Research",
    nameJp: "量子研究",
    type: "Research",
    budget: {
      total: 2000000,
      raised: 1200000
    },
    metrics: {
      activeUsers: 850,
      responseTime: 65,
      incidents: 1,
      sessions: 8
    }
  },
  {
    id: "cyber-security",
    name: "Cyber Security",
    nameJp: "サイバーセキュリティ",
    type: "Core",
    budget: {
      total: 1500000,
      raised: 1100000
    },
    metrics: {
      activeUsers: 950,
      responseTime: 30,
      incidents: 5,
      sessions: 12
    },
    latestIncident: {
      id: "inc-2",
      title: "Attempted unauthorized access detected",
      titleJp: "不正アクセスの試みを検出",
      severity: "medium",
      timestamp: "1 hour ago"
    }
  }
]

export const recentSessions: Session[] = [
  {
    id: "session-1",
    departmentId: "neural-ops",
    title: "Neural Network Optimization",
    titleJp: "ニューラルネットワークの最適化",
    participants: 8,
    startTime: "10 minutes ago",
    status: "live"
  },
  {
    id: "session-2",
    departmentId: "quantum-research",
    title: "Quantum Entanglement Study",
    titleJp: "量子もつれ研究",
    participants: 5,
    startTime: "2 hours ago",
    status: "completed"
  },
  {
    id: "session-3",
    departmentId: "cyber-security",
    title: "Security Protocol Review",
    titleJp: "セキュリティプロトコルレビュー",
    participants: 6,
    startTime: "in 30 minutes",
    status: "scheduled"
  }
]

