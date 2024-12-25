import * as React from "react";
import { DistrictDetailedMetrics } from "./district-detailed-metrics";
import { DistrictEvents } from "./district-events";
import { DistrictActivityFeed } from "./district-activity-feed";
import { CulturalShowcase } from "./cultural-showcase";
import { QuantumConsciousnessMap } from "./quantum-consciousness-map";
import { CityEventsPanel } from "./ai-governance-panel";
import { DistrictNavigation } from "./district-navigation";
import { DepartmentProfile } from "./department-profile";
import { NotificationCenter } from "./notification-center";

export function DistrictView({ districtId }: { districtId: string }) {
  return (
    <div className="relative">
      {/* Neural Network Background Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.05) 0%, transparent 40%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)
          `,
        }}
      />

      {/* Content */}
      <div className="container max-w-7xl mx-auto py-6">
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <div className="rounded-lg border border-blue-500/10 bg-black/30 backdrop-blur-xl p-6">
              <QuantumConsciousnessMap />
            </div>
            <div className="rounded-lg border border-blue-500/10 bg-black/30 backdrop-blur-xl p-6">
              <CityEventsPanel />
            </div>
            <div className="rounded-lg border border-blue-500/10 bg-black/30 backdrop-blur-xl p-6">
              <DistrictActivityFeed />
            </div>
            <div className="rounded-lg border border-blue-500/10 bg-black/30 backdrop-blur-xl p-6">
              <CulturalShowcase />
            </div>
            <div className="rounded-lg border border-blue-500/10 bg-black/30 backdrop-blur-xl p-6">
              <DistrictDetailedMetrics />
            </div>
          </div>
          <div className="space-y-6">
            <DepartmentProfile />
            <div className="rounded-lg border border-blue-500/10 bg-black/30 backdrop-blur-xl p-6">
              <DistrictNavigation />
            </div>
            <div className="rounded-lg border border-blue-500/10 bg-black/30 backdrop-blur-xl p-6">
              <NotificationCenter />
            </div>
            <div className="rounded-lg border border-blue-500/10 bg-black/30 backdrop-blur-xl p-6">
              <DistrictEvents />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DistrictView;
