import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MetricCard } from "./metric-card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Bounty } from "@/types/dashboard";
import { ClipboardList, CheckCircle, Clock, AlertTriangle, Eye, Search } from "lucide-react";

export function BountyAnalyticsSection() {
  const { data, isLoading } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const bounties = data.bounties || [];

  const filteredBounties = bounties.filter((bounty) => {
    const matchesSearch = (bounty.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (bounty.organization || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           (bounty.category || "").toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const bountyStats = {
    total: bounties.length,
    active: bounties.filter(b => b.status === 'Open').length,
    completed: bounties.filter(b => ['MINED', 'FAILED', 'Winner'].includes(b.status)).length,
    disputed: bounties.filter(b => b.status === 'disputed').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-500/20 text-green-400';
      case 'MINED': return 'bg-blue-500/20 text-blue-400';
      case 'Winner': return 'bg-purple-500/20 text-purple-400';
      case 'FAILED': return 'bg-gray-500/20 text-gray-400';
      case 'disputed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  const getCategoryColor = (category: string) => {
    if (!category || typeof category !== 'string') {
      return 'bg-slate-500/20 text-slate-400';
    }
    switch (category.toLowerCase()) {
      case 'development': return 'bg-za-purple/20 text-za-purple';
      case 'design': return 'bg-za-cyan/20 text-za-cyan';
      case 'writing': return 'bg-purple-500/20 text-purple-400';
      case 'marketing': return 'bg-green-500/20 text-green-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  if (isLoading) {
    return (
      <section id="bounties" className="space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-za-secondary rounded w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-za-card border-za-border rounded-xl p-6">
                <div className="h-20 bg-za-secondary rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="bounties" className="space-y-6 animate-fade-in" data-testid="bounty-analytics-section">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" data-testid="bounty-analytics-title">Bounty Analytics</h2>
        <div className="flex items-center space-x-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory} data-testid="select-category-filter">
            <SelectTrigger className="w-40 bg-za-secondary border-za-border">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search bounties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 bg-za-secondary border-za-border"
              data-testid="input-search-bounties"
            />
          </div>
        </div>
      </div>

      {/* Bounty Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Bounties"
          value={bountyStats.total}
          icon={<ClipboardList className="text-za-purple text-2xl" />}
          iconBg="bg-za-purple/20"
        />
        <MetricCard
          title="Completed"
          value={bountyStats.completed}
          icon={<CheckCircle className="text-green-400 text-2xl" />}
          iconBg="bg-green-500/20"
        />
        <MetricCard
          title="Active (Open)"
          value={bountyStats.active}
          icon={<Clock className="text-yellow-400 text-2xl" />}
          iconBg="bg-yellow-500/20"
        />
        <MetricCard
          title="Disputed"
          value={bountyStats.disputed}
          icon={<AlertTriangle className="text-red-400 text-2xl" />}
          iconBg="bg-red-500/20"
        />
      </div>

      {/* Bounty List */}
      <Card className="bg-za-card border-za-border">
        <CardHeader className="border-b border-za-border">
          <CardTitle className="text-lg font-semibold" data-testid="recent-bounties-title">
            Recent Bounties ({filteredBounties.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-za-secondary">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-300">Title</th>
                  <th className="text-left p-4 font-medium text-slate-300">Category</th>
                  <th className="text-left p-4 font-medium text-slate-300">Organization</th>
                  <th className="text-left p-4 font-medium text-slate-300">Value</th>
                  <th className="text-left p-4 font-medium text-slate-300">Status</th>
                  <th className="text-left p-4 font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-za-border">
                {filteredBounties.map((bounty) => (
                  <tr key={bounty.id} className="hover:bg-za-secondary/50 transition-colors" data-testid={`bounty-row-${bounty.id}`}>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{bounty.title}</p>
                        <p className="text-sm text-slate-400">Due: {new Date(bounty.dueDate).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(bounty.category)}`}>
                        {bounty.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-za-purple to-za-cyan rounded-full" />
                        <span>{bounty.organization}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{bounty.value}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(bounty.status)}`}>
                        {bounty.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" className="text-za-purple hover:text-za-purple/80" data-testid={`button-view-bounty-${bounty.id}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBounties.length === 0 && (
              <div className="text-center py-8 text-slate-400" data-testid="no-bounties-message">
                <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No bounties found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
