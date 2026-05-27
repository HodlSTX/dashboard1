import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // USD -> BRL exchange rate (proxied to avoid CORS and centralize the source)
  app.get("/api/proxy/fx/usd-brl", async (_req, res) => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const brl = data?.rates?.BRL;
      if (typeof brl !== "number") {
        throw new Error("BRL rate missing from upstream response");
      }
      res.json({
        base: "USD",
        quote: "BRL",
        rate: brl,
        timestamp: data.time_last_update_unix
          ? data.time_last_update_unix * 1000
          : Date.now(),
        source: "open.er-api.com",
      });
    } catch (error) {
      console.error("Error fetching USD/BRL rate:", error);
      res.status(500).json({
        error: "Failed to fetch USD/BRL exchange rate",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
