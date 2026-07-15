import { StatusBadge, type StatusTone } from "@/components/status-badge";
import type { MockAdminPhoneNumber } from "@/lib/mock/admin";

type Status = MockAdminPhoneNumber["status"];

const STATUS_TONES: Record<Status, StatusTone> = {
  ACTIVE: "success",
  PENDING: "warning",
  INACTIVE: "neutral",
};

const STATUS_LABELS: Record<Status, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  INACTIVE: "Inactive",
};

export function PhoneStatusBadge({ status }: { status: Status }) {
  return <StatusBadge label={STATUS_LABELS[status]} tone={STATUS_TONES[status]} />;
}
