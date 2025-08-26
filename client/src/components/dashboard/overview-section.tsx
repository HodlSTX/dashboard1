import { MetricCard } from "./metric-card";
import { ActivityChart } from "./activity-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Briefcase, DollarSign } from "lucide-react";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useEffect, useRef } from "react";

export function OverviewSection() {
  const { data, isLoading, isError } = useDashboardData();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  // Mock data for demonstration - will be replaced with real API data
  const mockUserActivity = [65, 78, 85, 92, 88, 95, 102];
  const mockActivityLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    if (!canvasRef.current) return;

    import("chart.js/auto").then((Chart) => {
      const ctx = canvasRef.current!.getContext("2d");
      if (!ctx) return;

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart.default(ctx, {
        type: "doughnut",
        data: {
          labels: ["Development", "Design", "Writing", "Marketing"],
          datasets: [
            {
              data: [42, 28, 19, 12],
              backgroundColor: [
                "hsl(243, 75%, 59%)",
                "hsl(186, 100%, 44%)",
                "hsl(262, 83%, 58%)",
                "hsl(154, 70%, 50%)",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "hsl(210, 40%, 98%)",
                padding: 15,
              },
            },
          },
        },
      });
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <section id="overview" className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-za-card border-za-border rounded-xl p-6 animate-pulse">
              <div className="h-20 bg-za-secondary rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="overview" className="space-y-6 animate-fade-in" data-testid="overview-section">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={data.userStats?.totalUsers ?? "Loading..."}
          change="+12.5%"
          changeType="positive"
          icon={<Users className="text-za-purple text-xl" />}
          iconBg="bg-za-purple/20"
        />
        <MetricCard
          title="Active Bounties"
          value={Array.isArray(data.bounties) ? data.bounties.filter(b => b.status === 'active').length : "Loading..."}
          change="+8.2%"
          changeType="positive"
          icon={<Trophy className="text-za-cyan text-xl" />}
          iconBg="bg-za-cyan/20"
        />
        <MetricCard
          title="Total Gigs"
          value={data.gigStats?.totalGigs ?? "Loading..."}
          change="+15.7%"
          changeType="positive"
          icon={<Briefcase className="text-purple-400 text-xl" />}
          iconBg="bg-purple-500/20"
        />
        <MetricCard
          title="Total Value"
          value={data.gigStats?.totalValue ?? "Loading..."}
          change="+23.1%"
          changeType="positive"
          icon={<DollarSign className="text-green-400 text-xl" />}
          iconBg="bg-green-500/20"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart
          title="User Activity"
          data={mockUserActivity}
          labels={mockActivityLabels}
        />

        {/* Bounty Distribution Chart */}
        <Card className="bg-za-card border-za-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold" data-testid="bounty-distribution-title">
              Bounty Distribution
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-za-purple rounded-full" />
              <span className="text-sm text-slate-400">Categories</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <canvas ref={canvasRef} data-testid="bounty-distribution-chart" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
