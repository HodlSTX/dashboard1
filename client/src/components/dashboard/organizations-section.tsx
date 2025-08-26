import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Organization, Category } from "@/types/dashboard";
import { Building, Code, PaintbrushVertical, Pen, Megaphone } from "lucide-react";

export function OrganizationsSection() {
  const { data, isLoading } = useDashboardData();

  const organizations = data.organizations || [];
  const categories = data.categories || [];

  // Map categories with icons for display
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'development': return <Code className="text-za-purple" />;
      case 'design': return <PaintbrushVertical className="text-za-cyan" />;
      case 'writing': return <Pen className="text-purple-400" />;
      case 'marketing': return <Megaphone className="text-green-400" />;
      default: return <Code className="text-slate-400" />;
    }
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'development': return 'bg-za-purple';
      case 'design': return 'bg-za-cyan';
      case 'writing': return 'bg-purple-500';
      case 'marketing': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getOrgGradient = (index: number) => {
    const gradients = [
      "bg-gradient-to-r from-za-purple to-za-cyan",
      "bg-gradient-to-r from-za-cyan to-purple-500",
      "bg-gradient-to-r from-purple-500 to-za-purple",
    ];
    return gradients[index % gradients.length];
  };

  if (isLoading) {
    return (
      <section id="organizations" className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-za-secondary rounded w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-za-card border-za-border rounded-xl p-6">
                <div className="h-60 bg-za-secondary rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="organizations" className="space-y-6 animate-fade-in" data-testid="organizations-section">
      <h2 className="text-2xl font-bold" data-testid="organizations-title">Organizations & Categories</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organizations */}
        <Card className="bg-za-card border-za-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold" data-testid="top-organizations-title">
              Top Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizations.length > 0 ? (
                organizations.map((org, index) => (
                  <div
                    key={org.id}
                    className="flex items-center justify-between p-4 bg-za-secondary/30 rounded-lg hover:bg-za-secondary/50 transition-colors"
                    data-testid={`organization-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${getOrgGradient(index)} rounded-lg flex items-center justify-center`}>
                        <Building className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-slate-400">{org.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{org.bountyCount} bounties</p>
                      <p className="text-sm text-green-400">{org.totalValue} total</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-400" data-testid="no-organizations-message">
                  <p>No organization data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="bg-za-card border-za-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold" data-testid="bounty-categories-title">
              Bounty Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.length > 0 ? (
                categories.map((category, index) => {
                  const percentage = Math.min(Math.round((category.bountyCount / 50) * 100), 100);
                  return (
                    <div
                      key={category.id}
                      className="flex items-center justify-between"
                      data-testid={`category-${index}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-za-purple/20 rounded-lg flex items-center justify-center">
                          {getCategoryIcon(category.name)}
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-slate-400">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-za-purple font-semibold">{category.bountyCount} bounties</p>
                        <div className="w-16 bg-za-secondary rounded-full h-1 mt-1">
                          <div 
                            className={`h-1 ${getCategoryColor(category.name)} rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-slate-400" data-testid="no-categories-message">
                  <p>No category data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
