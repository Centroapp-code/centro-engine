import { Card, CardContent } from "@/components/ui/card";

function Shimmer({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

export function CallsSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-4 w-12" />
              <Shimmer className="h-4 flex-1" />
              <Shimmer className="h-8 w-16 shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
