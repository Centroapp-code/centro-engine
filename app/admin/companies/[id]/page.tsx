import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { CompanyStatusBadge } from "@/components/admin/company-status-badge";
import { PhoneStatusBadge } from "@/components/admin/phone-status-badge";
import {
  getMockCompanyById,
  type MockAdminAgent,
  type MockAdminPhoneNumber,
} from "@/lib/mock/admin";
import { formatDate } from "@/lib/format";

const agentColumns: DataTableColumn<MockAdminAgent>[] = [
  { header: "Name", cell: (agent) => agent.name },
  {
    header: "Status",
    cell: (agent) => (
      <StatusBadge
        label={agent.active ? "Active" : "Inactive"}
        tone={agent.active ? "success" : "neutral"}
      />
    ),
  },
];

const phoneColumns: DataTableColumn<MockAdminPhoneNumber>[] = [
  { header: "Phone number", cell: (phone) => phone.phoneNumber },
  { header: "Provider", cell: (phone) => phone.provider },
  { header: "Status", cell: (phone) => <PhoneStatusBadge status={phone.status} /> },
];

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = getMockCompanyById(id);

  if (!company) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{company.name}</h1>
        <p className="text-sm text-muted-foreground">
          Company details, AI agents, phone numbers, and usage.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-sm text-muted-foreground">Industry</dt>
              <dd className="mt-1 font-medium">{company.industry}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Users</dt>
              <dd className="mt-1 font-medium">{company.userCount}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Created</dt>
              <dd className="mt-1 font-medium">{formatDate(company.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="mt-1">
                <CompanyStatusBadge status={company.status} />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-medium">Usage</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Calls" value={company.usage.totalCalls.toLocaleString()} />
          <StatCard
            label="Total Opportunities"
            value={company.usage.totalOpportunities.toLocaleString()}
          />
          <StatCard
            label="Flagged Opportunities"
            value={company.usage.flaggedOpportunities.toLocaleString()}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI agents</CardTitle>
          <CardDescription>Configured agents for this company.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={agentColumns}
            rows={company.agents}
            getRowKey={(agent) => agent.id}
            emptyMessage="No agents configured."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phone numbers</CardTitle>
          <CardDescription>Numbers routed to Centro for this company.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={phoneColumns}
            rows={company.phoneNumbers}
            getRowKey={(phone) => phone.id}
            emptyMessage="No phone numbers connected."
          />
        </CardContent>
      </Card>
    </div>
  );
}
