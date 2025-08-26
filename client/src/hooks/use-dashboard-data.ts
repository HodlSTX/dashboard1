import { useQuery } from "@tanstack/react-query";
import { DashboardData, UserStats, BountyStats, GigStats, Bounty, Category, Organization } from "@/types/dashboard";

const API_BASE_URL = "https://zeroauthoritydao.com/api";

async function fetchUserStats(): Promise<UserStats> {
  const response = await fetch(`${API_BASE_URL}/users/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch user statistics");
  }
  return response.json();
}

async function fetchGigStats(): Promise<GigStats> {
  const response = await fetch(`${API_BASE_URL}/gigs/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch gig statistics");
  }
  return response.json();
}

async function fetchBounties(): Promise<Bounty[]> {
  const response = await fetch(`${API_BASE_URL}/bounties`);
  if (!response.ok) {
    throw new Error("Failed to fetch bounties");
  }
  return response.json();
}

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/bounties/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

async function fetchOrganizations(): Promise<Organization[]> {
  const response = await fetch(`${API_BASE_URL}/bounties/organizations`);
  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }
  return response.json();
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
