"use client";

import { useParams, useRouter } from "next/navigation";
import { DistrictView } from "@/components/district-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DistrictPage() {
  const router = useRouter();
  const params = useParams();
  const districtId = params.id as string;

  return (
    <div className="min-h-screen bg-black">
      {/* Neural Network Background Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.05) 0%, transparent 40%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="container py-6">
          <Button
            variant="ghost"
            className="mb-6 gap-2 text-purple-300 hover:text-purple-200"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <DistrictView districtId={districtId} />
        </div>
      </div>
    </div>
  );
}
