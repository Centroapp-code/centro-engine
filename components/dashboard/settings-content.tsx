import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { AgentConfigForm } from "@/components/dashboard/agent-config-form";
import { requireCustomerCompany } from "@/lib/auth";
import {
  getAgentConfig,
  getCompanyProfile,
  getPhoneIntegration,
} from "@/lib/db/queries/settings";

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

export async function SettingsContent() {
  const company = await requireCustomerCompany();

  const [profile, phoneIntegration, agentConfig] = await Promise.all([
    getCompanyProfile(company.id),
    getPhoneIntegration(company.id),
    getAgentConfig(company.id),
  ]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Company profile</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Company name</dt>
              <dd className="mt-1 font-medium">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Industry</dt>
              <dd className="mt-1 font-medium">{profile.industry ?? "Not set"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phone number</CardTitle>
          <CardDescription>
            The number your phone system forwards vendor and business calls to.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {phoneIntegration ? (
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-muted-foreground">Number</dt>
                <dd className="mt-1 font-medium">{phoneIntegration.phoneNumber}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Provider</dt>
                <dd className="mt-1 font-medium">{phoneIntegration.provider}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <StatusBadge
                    label={PHONE_STATUS_LABEL[phoneIntegration.status as keyof typeof PHONE_STATUS_LABEL]}
                    tone={PHONE_STATUS_TONE[phoneIntegration.status as keyof typeof PHONE_STATUS_TONE]}
                  />
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              No phone number connected yet.
            </p>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-medium">AI receptionist</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure how Centro greets and screens inbound vendor calls.
        </p>
        <div className="mt-4 max-w-2xl">
          <AgentConfigForm initial={agentConfig} />
        </div>
      </div>
    </>
  );
}
