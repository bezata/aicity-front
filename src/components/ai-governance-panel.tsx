"use client"

import * as React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scale, Shield, Cpu, Zap, Activity, ChevronRight } from 'lucide-react'

interface Proposal {
  id: string
  title: string
  titleJp: string
  description: string
  status: "active" | "pending" | "completed"
  votes: {
    support: number
    neutral: number
    oppose: number
  }
  impact: number
  timeRemaining: string
}

export function AIGovernancePanel() {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "1",
      title: "Neural Network Expansion",
      titleJp: "ニューラルネットワークの拡張",
      description: "Proposal to expand the district's neural network capacity by 30%",
      status: "active",
      votes: {
        support: 65,
        neutral: 20,
        oppose: 15
      },
      impact: 85,
      timeRemaining: "2 cycles"
    },
    {
      id: "2",
      title: "Quantum Synchronization Protocol",
      titleJp: "量子同期プロトコル",
      description: "Implementation of new quantum synchronization protocols",
      status: "pending",
      votes: {
        support: 45,
        neutral: 40,
        oppose: 15
      },
      impact: 92,
      timeRemaining: "5 cycles"
    },
    {
      id: "3",
      title: "Consciousness Harmony Initiative",
      titleJp: "意識調和イニシアチブ",
      description: "New measures to improve collective consciousness harmony",
      status: "active",
      votes: {
        support: 78,
        neutral: 12,
        oppose: 10
      },
      impact: 95,
      timeRemaining: "1 cycle"
    }
  ])

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-light tracking-wider">
            District Governance
          </CardTitle>
          <Badge
            variant="outline"
            className="border-purple-400/30 bg-purple-500/10 text-purple-300"
          >
            Active Proposals: {proposals.filter(p => p.status === "active").length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-black/20">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <Card
                  key={proposal.id}
                  className="group relative overflow-hidden border-purple-500/10 bg-black/40"
                >
                  <div className="absolute inset-0 opacity-50">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
                  </div>
                  <CardContent className="relative p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium tracking-wider text-purple-300">
                            {proposal.title}
                          </h3>
                          <p className="text-sm text-purple-300/70">
                            {proposal.titleJp}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`
                            border-purple-400/30 bg-purple-500/10 text-purple-300
                            ${proposal.status === "active" && "animate-pulse border-green-400/30 bg-green-500/10 text-green-300"}
                          `}
                        >
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </Badge>
                      </div>

                      <p className="text-sm text-purple-300/70">
                        {proposal.description}
                      </p>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-purple-300/70">Support</span>
                            <span className="font-medium text-purple-300">
                              {proposal.votes.support}%
                            </span>
                          </div>
                          <Progress
                            value={proposal.votes.support}
                            className="h-1 bg-purple-500/10"
                            indicatorClassName="bg-green-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-purple-300/70">Neutral</span>
                            <span className="font-medium text-purple-300">
                              {proposal.votes.neutral}%
                            </span>
                          </div>
                          <Progress
                            value={proposal.votes.neutral}
                            className="h-1 bg-purple-500/10"
                            indicatorClassName="bg-purple-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-purple-300/70">Oppose</span>
                            <span className="font-medium text-purple-300">
                              {proposal.votes.oppose}%
                            </span>
                          </div>
                          <Progress
                            value={proposal.votes.oppose}
                            className="h-1 bg-purple-500/10"
                            indicatorClassName="bg-red-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="space-y-1">
                            <p className="text-xs text-purple-300/50">Impact Level</p>
                            <div className="flex items-center gap-1 text-purple-300">
                              <Activity className="h-3 w-3" />
                              <span>{proposal.impact}%</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-purple-300/50">Time Remaining</p>
                            <div className="flex items-center gap-1 text-purple-300">
                              <Cpu className="h-3 w-3" />
                              <span>{proposal.timeRemaining}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
                        >
                          Cast Vote
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}

