import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Shimmer({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

export function AnalyticsSkeleton() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Shimmer className="h-4 w-24" />
              <Shimmer className="mt-2 h-8 w-16" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Shimmer className="h-5 w-32" />
              <Shimmer className="mt-1 h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Shimmer className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
