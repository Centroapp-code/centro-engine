import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { OverviewRecentCall } from "@/lib/db/queries/overview";
import { formatDate } from "@/lib/format";

export function RecentCalls({ calls }: { calls: OverviewRecentCall[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent calls</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/dashboard/calls" />}>
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {calls.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {calls.map((call) => (
              <li key={call.id} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-medium">{call.callerName ?? "Unknown caller"}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(call.date)}</p>
                </div>
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  {call.summary ?? "No summary yet."}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No calls yet. Once Centro answers an inbound call, it will show up here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
