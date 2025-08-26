import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Box, ChartLine, Users, Trophy, Briefcase, Building, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Overview", href: "#overview", icon: ChartLine, id: "overview" },
  { name: "User Statistics", href: "#users", icon: Users, id: "users" },
  { name: "Bounty Analytics", href: "#bounties", icon: Trophy, id: "bounties" },
  { name: "Gig Marketplace", href: "#gigs", icon: Briefcase, id: "gigs" },
  { name: "Organizations", href: "#organizations", icon: Building, id: "organizations" },
];

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [activeSection, setActiveSection] = useState("overview");

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className={cn("w-64 bg-za-secondary border-r border-za-border fixed h-full overflow-y-auto", className)}>
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8" data-testid="sidebar-logo">
          <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
            <Box className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Zero Authority</h1>
            <p className="text-za-blue text-sm">Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors",
                  isActive
                    ? "bg-za-purple/20 text-za-purple border border-za-purple/30"
                    : "hover:bg-za-card text-foreground"
                )}
                data-testid={`nav-${item.id}`}
              >
                <item.icon className="w-5 h-5" />
                <span className={cn("font-medium", isActive ? "font-semibold" : "")}>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* API Status */}
        <div className="mt-8 p-4 bg-green-500/20 border border-green-500/30 rounded-lg" data-testid="api-status">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">API Connected</span>
          </div>
          <p className="text-xs text-green-300 mt-1">Real-time data sync</p>
          <div className="flex items-center mt-2 text-xs text-green-300">
            <Wifi className="w-3 h-3 mr-1" />
            <span>zeroauthoritydao.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
