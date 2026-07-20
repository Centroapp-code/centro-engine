"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OverviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="font-medium">Couldn&apos;t load your overview</p>
        <p className="text-sm text-muted-foreground">
          Something went wrong while fetching your dashboard summary.
        </p>
        <Button variant="outline" size="sm" onClick={() => reset()}>
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
