import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { CallsVolumeChart } from "@/components/dashboard/charts/calls-volume-chart";
import { OpportunitiesStatusChart } from "@/components/dashboard/charts/opportunities-status-chart";
import { requireCustomerCompany } from "@/lib/auth";
import { getOverviewStats } from "@/lib/db/queries/overview";
import { getCallVolume, getOpportunityStatusCounts } from "@/lib/db/queries/analytics";

export async function AnalyticsContent() {
  const company = await requireCustomerCompany();

  const [stats, callVolume, statusCounts] = await Promise.all([
    getOverviewStats(company.id),
    getCallVolume(company.id),
    getOpportunityStatusCounts(company.id),
  ]);

  const hasCalls = stats.totalCalls > 0;
  const hasOpportunities = statusCounts.some((row) => row.count > 0);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Calls" value={stats.totalCalls.toLocaleString()} />
        <StatCard
          label="Qualified Opportunities"
          value={stats.qualifiedOpportunities.toLocaleString()}
        />
        <StatCard
          label="High-Priority Opportunities"
          value={stats.highPriorityOpportunities.toLocaleString()}
        />
        <StatCard
          label="Avg Opportunity Score"
          value={stats.avgOpportunityScore !== null ? stats.avgOpportunityScore.toString() : "—"}
          description="Out of 100"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inbound calls</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {hasCalls ? (
              <CallsVolumeChart data={callVolume} />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No calls yet. Volume will appear here once Centro answers one.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opportunities by status</CardTitle>
            <CardDescription>Current pipeline breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {hasOpportunities ? (
              <OpportunitiesStatusChart data={statusCounts} />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No opportunities yet. Trends will appear here once Centro
                qualifies a call.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
