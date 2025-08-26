import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  return (
    <Card className={`bg-red-500/20 border-red-500/30 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="text-red-400 text-xl flex-shrink-0" />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-red-400" data-testid="error-title">
              API Connection Error
            </h3>
            <p className="text-red-300" data-testid="error-message">
              {error?.message || "Unable to fetch data from Zero Authority API. Please try again."}
            </p>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="ml-auto bg-red-500/20 hover:bg-red-500/30 border-red-500/40 text-red-300 hover:text-red-200"
              data-testid="button-retry"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
