import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { CallDetailsDialog } from "@/components/dashboard/call-details-dialog";
import { mockCalls, type MockCall } from "@/lib/mock/dashboard";
import { formatDate, formatDuration } from "@/lib/format";

const columns: DataTableColumn<MockCall>[] = [
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
    cell: (call) => formatDuration(call.duration),
  },
  {
    header: "Summary",
    className: "max-w-xs",
    cell: (call) => (
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {call.summary}
      </p>
    ),
  },
  {
    header: "Transcript",
    cell: (call) => <CallDetailsDialog call={call} />,
  },
];

export default function CallsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calls</h1>
        <p className="text-sm text-muted-foreground">
          Every inbound call Centro has answered, with its transcript and
          summary.
        </p>
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            rows={mockCalls}
            getRowKey={(call) => call.id}
            emptyMessage="No calls yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}
