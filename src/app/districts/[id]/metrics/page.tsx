import { MetricsDashboard } from "@/components/metrics-dashboard"

export default function DistrictMetricsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return (
    <div className="min-h-screen bg-black">
      {/* Neural Network Background Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 40%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)
          `
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <MetricsDashboard districtId={params.id} />
      </div>
    </div>
  )
}

