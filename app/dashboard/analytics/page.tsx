import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CallsVolumeChart } from "@/components/dashboard/charts/calls-volume-chart";
import { OpportunitiesStatusChart } from "@/components/dashboard/charts/opportunities-status-chart";
import { mockCallVolume, getOpportunityStatusCounts } from "@/lib/mock/dashboard";

export default function AnalyticsPage() {
  const statusCounts = getOpportunityStatusCounts();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Call volume and opportunity trends over time.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inbound calls</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <CallsVolumeChart data={mockCallVolume} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opportunities by status</CardTitle>
            <CardDescription>Current pipeline breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <OpportunitiesStatusChart data={statusCounts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
