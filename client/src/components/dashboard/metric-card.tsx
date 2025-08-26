import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  iconBg: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  iconBg,
  className,
}: MetricCardProps) {
  const changeColor = {
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-slate-400",
  }[changeType];

  const changeIcon = {
    positive: "↗",
    negative: "↘",
    neutral: "→",
  }[changeType];

  return (
    <Card className={cn("bg-za-card border-za-border card-hover", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm" data-testid={`metric-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {title}
            </p>
            <p className="text-2xl font-bold mt-1" data-testid={`metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
            {change && (
              <div className="flex items-center mt-2">
                <span className={cn("text-sm mr-1", changeColor)}>
                  {changeIcon}
                </span>
                <span className={cn("text-sm", changeColor)} data-testid={`metric-change-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBg)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
