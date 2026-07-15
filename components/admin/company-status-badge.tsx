import { StatusBadge, type StatusTone } from "@/components/status-badge";
import type { MockCompanyStatus } from "@/lib/mock/admin";

const STATUS_TONES: Record<MockCompanyStatus, StatusTone> = {
  ACTIVE: "success",
  TRIAL: "info",
  SUSPENDED: "destructive",
};

const STATUS_LABELS: Record<MockCompanyStatus, string> = {
  ACTIVE: "Active",
  TRIAL: "Trial",
  SUSPENDED: "Suspended",
};

export function CompanyStatusBadge({ status }: { status: MockCompanyStatus }) {
  return <StatusBadge label={STATUS_LABELS[status]} tone={STATUS_TONES[status]} />;
}
