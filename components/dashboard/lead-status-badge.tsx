import { Badge } from "@/components/ui/badge";
import type { MockLeadStatus } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<MockLeadStatus, string> = {
  NEW: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  CONTACTED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  QUALIFIED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  WON: "bg-primary/10 text-primary",
  LOST: "bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<MockLeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  WON: "Won",
  LOST: "Lost",
};

export function LeadStatusBadge({ status }: { status: MockLeadStatus }) {
  return (
    <Badge variant="outline" className={cn("border-transparent", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
