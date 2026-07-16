import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { CallDetailsDialog } from "@/components/dashboard/call-details-dialog";
import { requireCustomerCompany } from "@/lib/auth";
import { getCompanyCalls, type CallListItem } from "@/lib/db/queries/calls";
import { formatDate, formatDuration } from "@/lib/format";

const columns: DataTableColumn<CallListItem>[] = [
  {
    header: "Caller",
    cell: (call) => (
      <div>
        <p className="font-medium">{call.callerName ?? "Unknown"}</p>
        <p className="text-xs text-muted-foreground">{call.callerPhone}</p>
      </div>
    ),
  },
  {
    header: "Date",
    cell: (call) => formatDate(call.date),
  },
  {
    header: "Duration",
    cell: (call) => (call.duration !== null ? formatDuration(call.duration) : "—"),
  },
  {
    header: "Summary",
    className: "max-w-xs whitespace-normal",
    cell: (call) => (
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {call.summary ?? "AI analysis pending."}
      </p>
    ),
  },
  {
    header: "Transcript",
    cell: (call) => <CallDetailsDialog call={call} />,
  },
];

export async function CallsContent() {
  const company = await requireCustomerCompany();
  const calls = await getCompanyCalls(company.id);

  return (
    <Card>
      <CardContent>
        <DataTable
          columns={columns}
          rows={calls}
          getRowKey={(call) => call.id}
          emptyMessage="No calls yet. Once Centro answers an inbound call, it will show up here."
        />
      </CardContent>
    </Card>
  );
}
