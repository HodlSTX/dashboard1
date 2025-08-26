import { useQuery } from "@tanstack/react-query";
import { DashboardData, UserStats, BountyStats, GigStats, Bounty, Category, Organization } from "@/types/dashboard";

const API_BASE_URL = "/api/proxy";

async function fetchUserStats(): Promise<UserStats> {
  const response = await fetch(`${API_BASE_URL}/users/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch user statistics");
  }
  const result = await response.json();
  // Handle the API response structure
  if (result.stats?.overview) {
    return {
      totalUsers: result.stats.overview.totalUsers || 0,
      activeUsers: result.stats.overview.activeUsers || 0,
      newUsers: result.stats.overview.newUsers || 0,
      retentionRate: result.stats.overview.retentionRate || 0,
      averageRating: result.stats.overview.averageRating || 0,
    };
  }
  // Fallback if structure is different
  return result;
}

async function fetchGigStats(): Promise<GigStats> {
  const response = await fetch(`${API_BASE_URL}/gigs/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch gig statistics");
  }
  const result = await response.json();
  // Handle the API response structure
  if (result.data?.overview) {
    return {
      totalGigs: result.data.overview.totalGigs || 0,
      activeGigs: result.data.overview.activeGigs || 0,
      completedGigs: result.data.overview.completedGigs || 0,
      disputedGigs: result.data.overview.disputedGigs || 0,
      totalValue: result.data.overview.totalValue || "0",
      averageRating: result.data.overview.averageRating || 0,
    };
  }
  // Fallback if structure is different
  return result;
}

async function fetchBounties(): Promise<Bounty[]> {
  const response = await fetch(`${API_BASE_URL}/bounties`);
  if (!response.ok) {
    throw new Error("Failed to fetch bounties");
  }
  const result = await response.json();
  // Handle the API response structure
  if (result.data && Array.isArray(result.data)) {
    return result.data.map((bounty: any) => ({
      id: bounty.id || "",
      title: bounty.title || "",
      description: bounty.description || "",
      category: typeof bounty.category === 'object' ? bounty.category?.name || "" : bounty.category || "",
      organization: typeof bounty.organization === 'object' ? bounty.organization?.name || "" : bounty.organization || "",
      value: bounty.value || bounty.price || "0",
      status: bounty.status || "active",
      dueDate: bounty.dueDate || bounty.deadline || new Date().toISOString(),
      createdAt: bounty.createdAt || bounty.created_at || new Date().toISOString(),
    }));
  }
  // Fallback to empty array
  return [];
}

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/bounties/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  const result = await response.json();
  // Handle the API response structure
  if (result.data && Array.isArray(result.data)) {
    return result.data.map((category: any) => ({
      id: category.id || "",
      name: category.name || "",
      description: category.description || "",
      bountyCount: category.bountyCount || category.count || 0,
    }));
  }
  // Fallback to empty array
  return [];
}

async function fetchOrganizations(): Promise<Organization[]> {
  const response = await fetch(`${API_BASE_URL}/bounties/organizations`);
  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }
  const result = await response.json();
  // Handle the API response structure
  if (result.data && Array.isArray(result.data)) {
    return result.data.map((org: any) => ({
      id: org.id || "",
      name: org.name || "",
      description: org.description || "",
      bountyCount: org.bountyCount || org.count || 0,
      totalValue: org.totalValue || org.total_value || "0",
    }));
  }
  // Fallback to empty array
  return [];
}

export function useUserStats() {
  return useQuery({
    queryKey: ["/api/users/stats"],
    queryFn: fetchUserStats,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useGigStats() {
  return useQuery({
    queryKey: ["/api/gigs/stats"],
    queryFn: fetchGigStats,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useBounties() {
  return useQuery({
    queryKey: ["/api/bounties"],
    queryFn: fetchBounties,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["/api/bounties/categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // Categories don't change often
  });
}

export function useOrganizations() {
  return useQuery({
    queryKey: ["/api/bounties/organizations"],
    queryFn: fetchOrganizations,
    staleTime: 10 * 60 * 1000,
  });
}

export function useDashboardData() {
  const userStatsQuery = useUserStats();
  const gigStatsQuery = useGigStats();
  const bountiesQuery = useBounties();
  const categoriesQuery = useCategories();
  const organizationsQuery = useOrganizations();

  const isLoading = userStatsQuery.isLoading || gigStatsQuery.isLoading || 
                   bountiesQuery.isLoading || categoriesQuery.isLoading || 
                   organizationsQuery.isLoading;

  const isError = userStatsQuery.isError || gigStatsQuery.isError || 
                 bountiesQuery.isError || categoriesQuery.isError || 
                 organizationsQuery.isError;

  const error = userStatsQuery.error || gigStatsQuery.error || 
               bountiesQuery.error || categoriesQuery.error || 
               organizationsQuery.error;

  return {
    data: {
      userStats: userStatsQuery.data,
      gigStats: gigStatsQuery.data,
      bounties: bountiesQuery.data || [],
      categories: categoriesQuery.data || [],
      organizations: organizationsQuery.data || [],
    },
    isLoading,
    isError,
    error,
    refetch: () => {
      userStatsQuery.refetch();
      gigStatsQuery.refetch();
      bountiesQuery.refetch();
      categoriesQuery.refetch();
      organizationsQuery.refetch();
    },
  };
}
