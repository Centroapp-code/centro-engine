import { StatCard } from "@/components/stat-card";
import { RecentCalls } from "@/components/dashboard/recent-calls";
import { AIRecommendations } from "@/components/dashboard/ai-recommendations";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { requireCustomerCompany } from "@/lib/auth";
import {
  getOverviewStats,
  getRecentCalls,
  getRecentActivity,
} from "@/lib/db/queries/overview";
import { mockRecommendations } from "@/lib/mock/dashboard";

export async function OverviewContent() {
  const company = await requireCustomerCompany();

  const [stats, recentCalls, recentActivity] = await Promise.all([
    getOverviewStats(company.id),
    getRecentCalls(company.id),
    getRecentActivity(company.id),
  ]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Inbound Calls" value={stats.totalCalls.toLocaleString()} />
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
        <RecentCalls calls={recentCalls} />
        <AIRecommendations items={mockRecommendations} />
      </div>

      <RecentActivity items={recentActivity} />
    </>
  );
}
