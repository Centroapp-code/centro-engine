import { StatusBadge, type StatusTone } from "@/components/status-badge";
import type { OpportunityStatus } from "@/lib/db/generated/enums";

const STATUS_TONES: Record<OpportunityStatus, StatusTone> = {
  NEW: "info",
  CONTACTED: "warning",
  QUALIFIED: "success",
  WON: "success",
  LOST: "neutral",
};

const STATUS_LABELS: Record<OpportunityStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  WON: "Won",
  LOST: "Lost",
};

export function OpportunityStatusBadge({ status }: { status: OpportunityStatus }) {
  return <StatusBadge label={STATUS_LABELS[status]} tone={STATUS_TONES[status]} />;
}
