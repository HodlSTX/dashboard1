import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActivityChartProps {
  title: string;
  data?: number[];
  labels?: string[];
  className?: string;
}

export function ActivityChart({ title, data, labels, className }: ActivityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || !labels) return;

    // Dynamically import Chart.js to avoid SSR issues
    import("chart.js/auto").then((Chart) => {
      const ctx = canvasRef.current!.getContext("2d");
      if (!ctx) return;

      // Destroy existing chart
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart.default(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Active Users",
              data: data,
              borderColor: "hsl(243, 75%, 59%)",
              backgroundColor: "hsla(243, 75%, 59%, 0.1)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "hsl(243, 75%, 59%)",
              pointBorderColor: "hsl(243, 75%, 59%)",
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "hsl(217, 32%, 20%)",
              },
              ticks: {
                color: "hsl(215, 20%, 65%)",
              },
            },
            x: {
              grid: {
                color: "hsl(217, 32%, 20%)",
              },
              ticks: {
                color: "hsl(215, 20%, 65%)",
              },
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
        },
      });
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, labels]);

  return (
    <Card className={`bg-za-card border-za-border ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold" data-testid="chart-title">
          {title}
        </CardTitle>
        <Select defaultValue="7d" data-testid="select-timeframe">
          <SelectTrigger className="w-32 bg-za-secondary border-za-border">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <canvas ref={canvasRef} data-testid="activity-chart-canvas" />
        </div>
      </CardContent>
    </Card>
  );
}
