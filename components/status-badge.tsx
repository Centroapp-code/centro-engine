import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "info" | "neutral" | "destructive";

const TONE_STYLES: Record<StatusTone, string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  neutral: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <Badge variant="outline" className={cn("border-transparent", TONE_STYLES[tone])}>
      {label}
    </Badge>
  );
}
