export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  retentionRate: number;
  averageRating: number;
}

export interface BountyStats {
  totalBounties: number;
  activeBounties: number;
  completedBounties: number;
  disputedBounties: number;
  totalValue: string;
}

export interface GigStats {
  totalGigs: number;
  activeGigs: number;
  completedGigs: number;
  disputedGigs: number;
  totalValue: string;
  averageRating: number;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  category: string;
  organization: string;
  value: string;
  status: string; // API returns 'Open', 'MINED', etc.
  dueDate: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  bountyCount: number;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  bountyCount: number;
  totalValue: string;
}

export interface User {
  id: string;
  username: string;
  stxAddress: string;
  category: string;
  contributionCount: number;
  rating: number;
  avatar?: string;
}

export interface DashboardData {
  userStats: UserStats;
  bountyStats: BountyStats;
  gigStats: GigStats;
  bounties: Bounty[];
  categories: Category[];
  organizations: Organization[];
  topUsers: User[];
}
