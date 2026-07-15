import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { LeadStatusBadge } from "@/components/dashboard/lead-status-badge";
import { mockLeads, type MockLead } from "@/lib/mock/dashboard";

const columns: DataTableColumn<MockLead>[] = [
  {
    header: "Name",
    cell: (lead) => lead.name ?? "Unknown",
  },
  {
    header: "Contact",
    cell: (lead) => (
      <div>
        <p>{lead.email ?? "—"}</p>
        <p className="text-xs text-muted-foreground">{lead.phone ?? "—"}</p>
      </div>
    ),
  },
  {
    header: "Score",
    cell: (lead) => (lead.score !== null ? lead.score : "—"),
  },
  {
    header: "Status",
    cell: (lead) => <LeadStatusBadge status={lead.status} />,
  },
];

export default function LeadsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Every opportunity Centro has captured from your inbound calls.
        </p>
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            rows={mockLeads}
            getRowKey={(lead) => lead.id}
            emptyMessage="No leads yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}
