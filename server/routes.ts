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

  app.get("/api/proxy/users", async (req, res) => {
    try {
      const response = await fetch("https://zeroauthoritydao.com/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ 
        error: "Failed to fetch users",
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
      // Try to get more bounties by using limit parameter
      const response = await fetch("https://zeroauthoritydao.com/api/bounties?limit=100");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // If we get exactly 100 records, try to fetch more with pagination
      if (data.data && data.data.length === 100) {
        console.log("Got 100 bounties, attempting to fetch more with pagination...");
        try {
          // Fetch page 2
          const page2Response = await fetch("https://zeroauthoritydao.com/api/bounties?limit=100&page=2");
          if (page2Response.ok) {
            const page2Data = await page2Response.json();
            if (page2Data.data && page2Data.data.length > 0) {
              data.data = [...data.data, ...page2Data.data];
              console.log(`Combined data after page 2: ${data.data.length} total bounties`);
              
              // If page 2 also has 100 records, try page 3
              if (page2Data.data.length === 100) {
                try {
                  const page3Response = await fetch("https://zeroauthoritydao.com/api/bounties?limit=100&page=3");
                  if (page3Response.ok) {
                    const page3Data = await page3Response.json();
                    if (page3Data.data && page3Data.data.length > 0) {
                      data.data = [...data.data, ...page3Data.data];
                      console.log(`Combined data after page 3: ${data.data.length} total bounties`);
                    }
                  }
                } catch (page3Error) {
                  console.log("Page 3 fetch failed, using pages 1-2");
                }
              }
            }
          }
        } catch (paginationError) {
          console.log("Pagination attempt failed, using single page result");
        }
      }
      
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
