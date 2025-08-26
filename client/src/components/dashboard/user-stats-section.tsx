import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { User } from "@/types/dashboard";

interface TopUserProps {
  user: User;
  index: number;
}

function TopUserCard({ user, index }: TopUserProps) {
  const gradients = [
    "bg-gradient-to-r from-za-purple to-za-cyan",
    "bg-gradient-to-r from-za-cyan to-purple-500",
    "bg-gradient-to-r from-purple-500 to-za-cyan",
  ];

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center space-x-3" data-testid={`top-user-${index}`}>
      <div className={`w-10 h-10 ${gradients[index % gradients.length]} rounded-full flex items-center justify-center`}>
        <span className="text-sm font-bold">{initials}</span>
      </div>
      <div className="flex-1">
        <p className="font-medium">{user.username}</p>
        <p className="text-sm text-slate-400">{user.contributionCount} contributions</p>
      </div>
      <div className="text-right">
        <span className="text-za-purple font-semibold">{user.rating}★</span>
      </div>
    </div>
  );
}

export function UserStatsSection() {
  const { data, isLoading } = useDashboardData();

  // Mock top users data - will be replaced with real API data
  const mockTopUsers: User[] = [
    { id: "1", username: "xyzero.btc", stxAddress: "", category: "Developer", contributionCount: 152, rating: 4.9 },
    { id: "2", username: "Dawg Haus", stxAddress: "", category: "Designer", contributionCount: 89, rating: 4.8 },
    { id: "3", username: "markeljan", stxAddress: "", category: "Developer", contributionCount: 76, rating: 4.7 },
  ];

  if (isLoading) {
    return (
      <section id="users" className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-za-secondary rounded w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-za-card border-za-border rounded-xl p-6">
                <div className="h-40 bg-za-secondary rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="users" className="space-y-6 animate-fade-in" data-testid="user-stats-section">
      <h2 className="text-2xl font-bold" data-testid="user-stats-title">User Statistics</h2>
      
      {/* User Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Contributors */}
        <Card className="bg-za-card border-za-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold" data-testid="top-contributors-title">
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTopUsers.map((user, index) => (
                <TopUserCard key={user.id} user={user} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Categories */}
        <Card className="bg-za-card border-za-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold" data-testid="user-categories-title">
              User Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Developers", count: 587, percentage: 75, color: "bg-za-purple" },
                { name: "Designers", count: 321, percentage: 67, color: "bg-za-cyan" },
                { name: "Writers", count: 198, percentage: 50, color: "bg-purple-500" },
                { name: "General", count: 141, percentage: 33, color: "bg-green-500" },
              ].map((category, index) => (
                <div key={category.name} className="flex items-center justify-between" data-testid={`category-${index}`}>
                  <span className="text-slate-300">{category.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-za-secondary rounded-full h-2">
                      <div 
                        className={`h-2 ${category.color} rounded-full`} 
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Metrics */}
        <Card className="bg-za-card border-za-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold" data-testid="growth-metrics-title">
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div data-testid="new-users-metric">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">New Users</span>
                  <span className="text-green-400 text-sm">+24 this week</span>
                </div>
                <div className="w-full bg-za-secondary rounded-full h-2">
                  <div className="w-4/5 h-2 bg-gradient-to-r from-za-purple to-za-cyan rounded-full" />
                </div>
              </div>
              <div data-testid="retention-rate-metric">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Retention Rate</span>
                  <span className="text-za-purple font-semibold">87.3%</span>
                </div>
                <div className="w-full bg-za-secondary rounded-full h-2">
                  <div className="w-5/6 h-2 bg-za-purple rounded-full" />
                </div>
              </div>
              <div data-testid="average-rating-metric">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Avg. Rating</span>
                  <span className="text-yellow-400 font-semibold">4.6★</span>
                </div>
                <div className="w-full bg-za-secondary rounded-full h-2">
                  <div className="w-11/12 h-2 bg-yellow-400 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
