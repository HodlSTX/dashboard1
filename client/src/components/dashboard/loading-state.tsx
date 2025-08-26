import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Wifi } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Fetching Latest Data" }: LoadingStateProps) {
  return (
    <div className="fixed inset-0 bg-za-dark/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <Card className="bg-za-card border-za-border max-w-md w-full mx-4">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 gradient-bg rounded-full animate-pulse-glow mx-auto mb-4 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2" data-testid="loading-title">
              {message}
            </h3>
            <p className="text-slate-400 mb-4" data-testid="loading-description">
              Connecting to Zero Authority API...
            </p>
            <div className="w-full bg-za-secondary rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-za-purple to-za-cyan h-2 rounded-full animate-pulse" 
                style={{ width: "75%" }}
              />
            </div>
            <div className="flex items-center justify-center mt-4 text-sm text-slate-400">
              <Wifi className="w-4 h-4 mr-2" />
              <span>Real-time data sync</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
