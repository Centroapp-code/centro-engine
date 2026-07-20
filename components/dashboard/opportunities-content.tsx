import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { OpportunityStatusBadge } from "@/components/dashboard/opportunity-status-badge";
import { OpportunityPriorityBadge } from "@/components/dashboard/opportunity-priority-badge";
import { requireCustomerCompany } from "@/lib/auth";
import {
  getCompanyOpportunities,
  type OpportunityListItem,
} from "@/lib/db/queries/opportunities";
import { formatDate } from "@/lib/format";

const columns: DataTableColumn<OpportunityListItem>[] = [
  {
    header: "Name",
    cell: (opportunity) => opportunity.name ?? "Unknown",
  },
  {
    header: "Score",
    cell: (opportunity) => (opportunity.score !== null ? opportunity.score : "—"),
  },
  {
    header: "Priority",
    cell: (opportunity) => <OpportunityPriorityBadge priority={opportunity.priority} />,
  },
  {
    header: "Status",
    cell: (opportunity) => <OpportunityStatusBadge status={opportunity.status} />,
  },
  {
    header: "AI Recommendation",
    className: "max-w-xs whitespace-normal",
    cell: (opportunity) => (
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {opportunity.recommendedAction ?? "No recommendation yet."}
      </p>
    ),
  },
  {
    header: "Created",
    cell: (opportunity) => formatDate(opportunity.createdAt),
  },
];

export async function OpportunitiesContent() {
  const company = await requireCustomerCompany();
  const opportunities = await getCompanyOpportunities(company.id);

  return (
    <Card>
      <CardContent>
        <DataTable
          columns={columns}
          rows={opportunities}
          getRowKey={(opportunity) => opportunity.id}
          emptyMessage="No opportunities yet. Once Centro screens a call, it will show up here."
        />
      </CardContent>
    </Card>
  );
}
