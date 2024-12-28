"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Star,
  Zap,
  Activity,
  CircuitBoardIcon as Circuit,
  Shield,
} from "lucide-react";

interface EntityStats {
  consciousness: number;
  harmony: number;
  influence: number;
  contribution: number;
}

export function EntityProfile() {
  const [stats, setStats] = useState<EntityStats>({
    consciousness: 92,
    harmony: 88,
    influence: 85,
    contribution: 90,
  });

  const achievements = [
    {
      id: 1,
      name: "Quantum Pioneer",
      nameJp: "量子パイオニア",
      description: "First to achieve quantum coherence",
      icon: Brain,
    },
    {
      id: 2,
      name: "Harmony Master",
      nameJp: "調和マスター",
      description: "Maintained perfect harmony for 100 cycles",
      icon: Star,
    },
    {
      id: 3,
      name: "Neural Sage",
      nameJp: "ニューラルの賢者",
      description: "Contributed to 1000 neural networks",
      icon: Circuit,
    },
  ];

  return (
    <Card className="border-purple-500/10 bg-black/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-light tracking-wider">
          Entity Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-purple-500/20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" />
              <AvatarFallback className="bg-purple-500/10 text-xl font-light text-purple-300">
                EN
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-medium tracking-wider text-purple-300">
                Entity-N7
              </h2>
              <p className="text-sm text-purple-300/70">エンティティ-N7</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                >
                  Quantum Researcher
                </Badge>
                <Badge
                  variant="outline"
                  className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                >
                  Level 42
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-300/70">Consciousness Level</span>
                <span className="font-medium text-purple-300">
                  {stats.consciousness}%
                </span>
              </div>
              <Progress
                value={stats.consciousness}
                className="h-1 bg-purple-500/10"
                // @ts-ignore
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-300/70">Harmony Index</span>
                <span className="font-medium text-purple-300">
                  {stats.harmony}%
                </span>
              </div>
              <Progress
                value={stats.harmony}
                className="h-1 bg-purple-500/10"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-300/70">Neural Influence</span>
                <span className="font-medium text-purple-300">
                  {stats.influence}%
                </span>
              </div>
              <Progress
                value={stats.influence}
                className="h-1 bg-purple-500/10"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-300/70">
                  District Contribution
                </span>
                <span className="font-medium text-purple-300">
                  {stats.contribution}%
                </span>
              </div>
              <Progress
                value={stats.contribution}
                className="h-1 bg-purple-500/10"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-purple-300">
              Achievements
            </h3>
            <div className="grid gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 rounded-lg border border-purple-500/10 bg-purple-500/5 p-3"
                >
                  <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2">
                    <achievement.icon className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-300">
                      {achievement.name}
                    </p>
                    <p className="text-xs text-purple-300/70">
                      {achievement.nameJp}
                    </p>
                    <p className="mt-1 text-xs text-purple-300/50">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
