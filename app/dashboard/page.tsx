import { Suspense } from "react";
import { OverviewContent } from "@/components/dashboard/overview-content";
import { OverviewSkeleton } from "@/components/dashboard/overview-skeleton";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of how Centro is screening inbound sales calls for your
          business.
        </p>
      </div>

      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewContent />
      </Suspense>
    </div>
  );
}
