import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { AgentConfigForm } from "@/components/dashboard/agent-config-form";
import {
  mockAgentConfig,
  mockCompanyProfile,
  mockPhoneNumber,
} from "@/lib/mock/dashboard";

const PHONE_STATUS_TONE = {
  ACTIVE: "success",
  PENDING: "warning",
  INACTIVE: "neutral",
} as const;

const PHONE_STATUS_LABEL = {
  ACTIVE: "Active",
  PENDING: "Pending",
  INACTIVE: "Inactive",
} as const;

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your company profile, phone number, and AI gatekeeper
          configuration.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company profile</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Company name</dt>
              <dd className="mt-1 font-medium">{mockCompanyProfile.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Industry</dt>
              <dd className="mt-1 font-medium">{mockCompanyProfile.industry}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phone number</CardTitle>
          <CardDescription>
            The number your phone system forwards sales calls to.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-muted-foreground">Number</dt>
              <dd className="mt-1 font-medium">{mockPhoneNumber.phoneNumber}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Provider</dt>
              <dd className="mt-1 font-medium">{mockPhoneNumber.provider}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="mt-1">
                <StatusBadge
                  label={PHONE_STATUS_LABEL[mockPhoneNumber.status]}
                  tone={PHONE_STATUS_TONE[mockPhoneNumber.status]}
                />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-medium">AI gatekeeper</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure how Centro greets and qualifies inbound sales calls.
        </p>
        <div className="mt-4 max-w-2xl">
          <AgentConfigForm initial={mockAgentConfig} />
        </div>
      </div>
    </div>
  );
}
