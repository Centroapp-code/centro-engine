import { StatusBadge, type StatusTone } from "@/components/status-badge";
import type { OpportunityStatus } from "@/lib/db/generated/enums";

const STATUS_TONES: Record<OpportunityStatus, StatusTone> = {
  NEW: "info",
  REVIEWED: "neutral",
  FLAGGED: "warning",
  DISMISSED: "neutral",
};

const STATUS_LABELS: Record<OpportunityStatus, string> = {
  NEW: "New",
  REVIEWED: "Reviewed",
  FLAGGED: "Flagged",
  DISMISSED: "Dismissed",
};

export function OpportunityStatusBadge({ status }: { status: OpportunityStatus }) {
  return <StatusBadge label={STATUS_LABELS[status]} tone={STATUS_TONES[status]} />;
}
