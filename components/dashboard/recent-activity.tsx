import { Phone, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OverviewActivityItem } from "@/lib/db/queries/overview";
import { formatDate } from "@/lib/format";

const ICONS = {
  call: Phone,
  opportunity: Target,
  score: TrendingUp,
} as const;

export function RecentActivity({ items }: { items: OverviewActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {items.map((item) => {
              const Icon = ICONS[item.type];
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm">{item.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No recent activity yet. It will appear here as calls come in.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
