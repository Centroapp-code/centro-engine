import { StatCard } from "@/components/stat-card";
import { mockOverviewStats } from "@/lib/mock/dashboard";

export default function DashboardPage() {
  const stats = mockOverviewStats;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of how Centro is performing for your business.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Calls" value={stats.totalCalls.toLocaleString()} />
        <StatCard
          label="Leads Generated"
          value={stats.leadsGenerated.toLocaleString()}
        />
        <StatCard
          label="Qualified Leads"
          value={stats.qualifiedLeads.toLocaleString()}
        />
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversionRate}%`}
          description="Qualified leads / total calls"
        />
      </div>
    </div>
  );
}
