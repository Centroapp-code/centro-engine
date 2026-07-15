import { Phone, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MockActivityItem } from "@/lib/mock/dashboard";
import { formatDate } from "@/lib/format";

const ICONS = {
  call: Phone,
  opportunity: Target,
  score: TrendingUp,
} as const;

export function RecentActivity({ items }: { items: MockActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
