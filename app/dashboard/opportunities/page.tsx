import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { OpportunityStatusBadge } from "@/components/dashboard/opportunity-status-badge";
import { mockOpportunities, type MockOpportunity } from "@/lib/mock/dashboard";

const columns: DataTableColumn<MockOpportunity>[] = [
  {
    header: "Name",
    cell: (opportunity) => opportunity.name ?? "Unknown",
  },
  {
    header: "Contact",
    cell: (opportunity) => (
      <div>
        <p>{opportunity.email ?? "—"}</p>
        <p className="text-xs text-muted-foreground">{opportunity.phone ?? "—"}</p>
      </div>
    ),
  },
  {
    header: "Score",
    cell: (opportunity) => (opportunity.score !== null ? opportunity.score : "—"),
  },
  {
    header: "Status",
    cell: (opportunity) => <OpportunityStatusBadge status={opportunity.status} />,
  },
];

export default function OpportunitiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Opportunities</h1>
        <p className="text-sm text-muted-foreground">
          Every sales opportunity Centro has qualified and scored from your
          inbound calls.
        </p>
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            rows={mockOpportunities}
            getRowKey={(opportunity) => opportunity.id}
            emptyMessage="No opportunities yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}
