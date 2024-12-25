"use client";

import { MainLayout } from "@/components/main-layout";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, FileText } from "lucide-react";

interface Chronicle {
  id: string;
  title: string;
  titleJp: string;
  content: string;
  timestamp: string;
  category: "system" | "event" | "milestone";
  importance: "low" | "medium" | "high";
}

export default function ChroniclesPage() {
  const [chronicles, setChronicles] = useState<Chronicle[]>([
    {
      id: "1",
      title: "Neural Network Initialization",
      titleJp: "ニューラルネットワークの初期化",
      content:
        "The city's neural network has been successfully initialized. All core systems are operational.",
      timestamp: new Date().toISOString(),
      category: "system",
      importance: "high",
    },
    {
      id: "2",
      title: "First Quantum Consciousness Sync",
      titleJp: "最初の量子意識同期",
      content:
        "The first successful quantum consciousness synchronization has been achieved.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      category: "milestone",
      importance: "high",
    },
    {
      id: "3",
      title: "AI Entity Integration",
      titleJp: "AIエンティティの統合",
      content:
        "Initial AI entities have been successfully integrated into the city's neural network.",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      category: "event",
      importance: "medium",
    },
  ]);

  const getCategoryColor = (category: Chronicle["category"]) => {
    switch (category) {
      case "system":
        return "border-blue-400/30 bg-blue-500/10 text-blue-300";
      case "event":
        return "border-purple-400/30 bg-purple-500/10 text-purple-300";
      case "milestone":
        return "border-green-400/30 bg-green-500/10 text-green-300";
    }
  };

  const getImportanceColor = (importance: Chronicle["importance"]) => {
    switch (importance) {
      case "low":
        return "border-yellow-400/30 bg-yellow-500/10 text-yellow-300";
      case "medium":
        return "border-orange-400/30 bg-orange-500/10 text-orange-300";
      case "high":
        return "border-red-400/30 bg-red-500/10 text-red-300";
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <Card className="border-purple-500/10 bg-black/30 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-light tracking-wider">
                  City Chronicles
                </CardTitle>
                <CardDescription>都市の記録</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-purple-400/30 bg-purple-500/10 text-purple-300"
                >
                  <Brain className="mr-1 h-3 w-3" />
                  {chronicles.length} Records
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[800px] pr-4">
              <div className="space-y-4">
                {chronicles.map((chronicle) => (
                  <Card
                    key={chronicle.id}
                    className="border-purple-500/10 bg-black/20"
                  >
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-400" />
                          <h3 className="font-medium">{chronicle.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getCategoryColor(chronicle.category)}
                          >
                            {chronicle.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={getImportanceColor(chronicle.importance)}
                          >
                            {chronicle.importance}
                          </Badge>
                        </div>
                      </div>
                      <p className="mb-2 text-sm text-purple-300/70">
                        {chronicle.titleJp}
                      </p>
                      <p className="text-sm text-purple-300/90">
                        {chronicle.content}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-xs text-purple-300/50">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(chronicle.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
