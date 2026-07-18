import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Shimmer({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

export function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <Shimmer className="h-5 w-40" />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-10 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Shimmer className="h-5 w-32" />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-10 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Shimmer className="h-5 w-36" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Shimmer className="h-10 w-full" />
          <Shimmer className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
