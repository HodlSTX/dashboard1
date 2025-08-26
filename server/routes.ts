import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // API proxy routes for Zero Authority DAO API
  // These routes can be used to proxy requests to avoid CORS issues
  
  app.get("/api/proxy/users/stats", async (req, res) => {
    try {
      const response = await fetch("https://zeroauthoritydao.com/api/users/stats");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ 
        error: "Failed to fetch user statistics",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/proxy/gigs/stats", async (req, res) => {
    try {
      const response = await fetch("https://zeroauthoritydao.com/api/gigs/stats");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching gig stats:", error);
      res.status(500).json({ 
        error: "Failed to fetch gig statistics",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/proxy/bounties", async (req, res) => {
    try {
      const response = await fetch("https://zeroauthoritydao.com/api/bounties");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching bounties:", error);
      res.status(500).json({ 
        error: "Failed to fetch bounties",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/proxy/bounties/categories", async (req, res) => {
    try {
      const response = await fetch("https://zeroauthoritydao.com/api/bounties/categories");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ 
        error: "Failed to fetch categories",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/proxy/bounties/organizations", async (req, res) => {
    try {
      const response = await fetch("https://zeroauthoritydao.com/api/bounties/organizations");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      res.status(500).json({ 
        error: "Failed to fetch organizations",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      services: {
        zeroAuthorityApi: "https://zeroauthoritydao.com/api"
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
