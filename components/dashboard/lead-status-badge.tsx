import { StatusBadge, type StatusTone } from "@/components/status-badge";
import type { MockLeadStatus } from "@/lib/mock/dashboard";

const STATUS_TONES: Record<MockLeadStatus, StatusTone> = {
  NEW: "info",
  CONTACTED: "warning",
  QUALIFIED: "success",
  WON: "success",
  LOST: "neutral",
};

const STATUS_LABELS: Record<MockLeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  WON: "Won",
  LOST: "Lost",
};

export function LeadStatusBadge({ status }: { status: MockLeadStatus }) {
  return <StatusBadge label={STATUS_LABELS[status]} tone={STATUS_TONES[status]} />;
}
