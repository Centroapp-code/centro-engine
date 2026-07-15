import { StatusBadge, type StatusTone } from "@/components/status-badge";
import type { MockOpportunityStatus } from "@/lib/mock/dashboard";

const STATUS_TONES: Record<MockOpportunityStatus, StatusTone> = {
  NEW: "info",
  CONTACTED: "warning",
  QUALIFIED: "success",
  WON: "success",
  LOST: "neutral",
};

const STATUS_LABELS: Record<MockOpportunityStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  WON: "Won",
  LOST: "Lost",
};

export function OpportunityStatusBadge({ status }: { status: MockOpportunityStatus }) {
  return <StatusBadge label={STATUS_LABELS[status]} tone={STATUS_TONES[status]} />;
}
