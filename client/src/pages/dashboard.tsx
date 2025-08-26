import { Sidebar } from "@/components/dashboard/sidebar";
import { OverviewSection } from "@/components/dashboard/overview-section";
import { UserStatsSection } from "@/components/dashboard/user-stats-section";
import { BountyAnalyticsSection } from "@/components/dashboard/bounty-analytics-section";
import { OrganizationsSection } from "@/components/dashboard/organizations-section";
import { LoadingState } from "@/components/dashboard/loading-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { data, isLoading, isError, error, refetch } = useDashboardData();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowLoading(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
      if (!isError) {
        setLastUpdated(new Date());
      }
    }
  }, [isLoading, isError]);

  const handleRefresh = () => {
    refetch();
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes === 1) return "1 minute ago";
    return `${diffInMinutes} minutes ago`;
  };

  return (
    <div className="flex min-h-screen bg-za-dark text-white font-inter">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between" data-testid="dashboard-header">
          <div>
            <h1 className="text-3xl font-bold" data-testid="dashboard-title">Platform Analytics</h1>
            <p className="text-slate-400 mt-1" data-testid="dashboard-subtitle">
              Real-time insights from Zero Authority DAO
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-za-purple hover:bg-za-purple/80 text-white"
              data-testid="button-refresh-data"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <div className="text-right">
              <p className="text-sm text-slate-400">Last updated</p>
              <p className="text-sm font-medium" data-testid="last-updated-time">
                {formatLastUpdated(lastUpdated)}
              </p>
            </div>
          </div>
        </header>

        {/* Error State */}
        {isError && (
          <ErrorState error={error} onRetry={handleRefresh} className="mb-6" />
        )}

        {/* Dashboard Sections */}
        <OverviewSection />
        <UserStatsSection />
        <BountyAnalyticsSection />
        <OrganizationsSection />
      </main>

      {/* Loading State Modal */}
      {showLoading && <LoadingState />}
    </div>
  );
}
