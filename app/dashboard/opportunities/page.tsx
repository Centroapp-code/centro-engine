import { Suspense } from "react";
import { OpportunitiesContent } from "@/components/dashboard/opportunities-content";
import { OpportunitiesSkeleton } from "@/components/dashboard/opportunities-skeleton";

export default function OpportunitiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Opportunities</h1>
        <p className="text-sm text-muted-foreground">
          Every business opportunity Centro has identified and scored from
          your inbound vendor calls.
        </p>
      </div>

      <Suspense fallback={<OpportunitiesSkeleton />}>
        <OpportunitiesContent />
      </Suspense>
    </div>
  );
}
