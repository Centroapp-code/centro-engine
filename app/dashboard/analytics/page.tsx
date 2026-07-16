import { Suspense } from "react";
import { AnalyticsContent } from "@/components/dashboard/analytics-content";
import { AnalyticsSkeleton } from "@/components/dashboard/analytics-skeleton";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Call volume and opportunity trends over time.
        </p>
      </div>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}
