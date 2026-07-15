import { StatCard } from "@/components/stat-card";
import { RecentCalls } from "@/components/dashboard/recent-calls";
import { AIRecommendations } from "@/components/dashboard/ai-recommendations";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
  mockOverviewStats,
  mockCalls,
  mockRecommendations,
  mockRecentActivity,
} from "@/lib/mock/dashboard";

export default function DashboardPage() {
  const stats = mockOverviewStats;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of how Centro is screening inbound sales calls for your
          business.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Inbound Calls" value={stats.totalCalls.toLocaleString()} />
        <StatCard
          label="Opportunities Captured"
          value={stats.opportunitiesCaptured.toLocaleString()}
        />
        <StatCard
          label="Qualified Opportunities"
          value={stats.qualifiedOpportunities.toLocaleString()}
        />
        <StatCard
          label="Avg Opportunity Score"
          value={stats.avgOpportunityScore.toString()}
          description="Out of 100"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentCalls calls={mockCalls.slice(0, 3)} />
        <AIRecommendations items={mockRecommendations} />
      </div>

      <RecentActivity items={mockRecentActivity} />
    </div>
  );
}
