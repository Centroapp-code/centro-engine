import { StatusBadge, type StatusTone } from "@/components/status-badge";
import type { OpportunityPriority } from "@/lib/db/generated/enums";

const PRIORITY_TONES: Record<OpportunityPriority, StatusTone> = {
  LOW: "neutral",
  MEDIUM: "info",
  HIGH: "warning",
};

const PRIORITY_LABELS: Record<OpportunityPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export function OpportunityPriorityBadge({ priority }: { priority: OpportunityPriority }) {
  return <StatusBadge label={PRIORITY_LABELS[priority]} tone={PRIORITY_TONES[priority]} />;
}
