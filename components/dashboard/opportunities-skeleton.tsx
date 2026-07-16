import { Card, CardContent } from "@/components/ui/card";

function Shimmer({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

export function OpportunitiesSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Shimmer className="h-4 w-28" />
              <Shimmer className="h-4 w-10" />
              <Shimmer className="h-5 w-16 rounded-full" />
              <Shimmer className="h-5 w-20 rounded-full" />
              <Shimmer className="h-4 flex-1" />
              <Shimmer className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
