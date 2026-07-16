import { Suspense } from "react";
import { CallsContent } from "@/components/dashboard/calls-content";
import { CallsSkeleton } from "@/components/dashboard/calls-skeleton";

export default function CallsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calls</h1>
        <p className="text-sm text-muted-foreground">
          Every inbound call Centro has answered, with its transcript and
          summary.
        </p>
      </div>

      <Suspense fallback={<CallsSkeleton />}>
        <CallsContent />
      </Suspense>
    </div>
  );
}
