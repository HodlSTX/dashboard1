import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Organization, Category } from "@/types/dashboard";
import { Building, Code, PaintbrushVertical, Pen, Megaphone } from "lucide-react";

export function OrganizationsSection() {
  const { data, isLoading } = useDashboardData();

  // Mock organizations data - will be replaced with real API data
  const mockOrganizations: Organization[] = [
    {
      id: "1",
      name: "Clarity Alliance",
      description: "Security & Auditing",
      bountyCount: 12,
      totalValue: "$24.5K",
    },
    {
      id: "2",
      name: "Red Block Labs",
      description: "Development Studio",
      bountyCount: 8,
      totalValue: "$18.2K",
    },
    {
      id: "3",
      name: "Zero Authority",
      description: "Platform Operations",
      bountyCount: 15,
      totalValue: "$32.1K",
    },
  ];

  // Mock categories data - will be replaced with real API data
  const mockCategories: (Category & { icon: React.ReactNode; color: string })[] = [
    {
      id: "1",
      name: "Development",
      description: "Smart contracts, dApps",
      bountyCount: 42,
      icon: <Code className="text-za-purple" />,
      color: "bg-za-purple",
    },
    {
      id: "2",
      name: "Design",
      description: "UI/UX, Graphics",
      bountyCount: 28,
      icon: <PaintbrushVertical className="text-za-cyan" />,
      color: "bg-za-cyan",
    },
    {
      id: "3",
      name: "Writing",
      description: "Documentation, Content",
      bountyCount: 19,
      icon: <Pen className="text-purple-400" />,
      color: "bg-purple-500",
    },
    {
      id: "4",
      name: "Marketing",
      description: "Campaigns, Social Media",
      bountyCount: 12,
      icon: <Megaphone className="text-green-400" />,
      color: "bg-green-500",
    },
  ];

  const organizations = data.organizations.length > 0 ? data.organizations : mockOrganizations;
  const categories = data.categories.length > 0 ? data.categories : mockCategories;

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
              {organizations.map((org, index) => (
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
              ))}
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
              {mockCategories.map((category, index) => {
                const percentage = Math.round((category.bountyCount / 100) * 80); // Mock percentage calculation
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between"
                    data-testid={`category-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-za-purple/20 rounded-lg flex items-center justify-center">
                        {category.icon}
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
                          className={`h-1 ${category.color} rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
