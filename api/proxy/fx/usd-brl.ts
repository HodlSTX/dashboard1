import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  try {
    const upstream = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!upstream.ok) {
      throw new Error(`HTTP ${upstream.status}`);
    }
    const data = (await upstream.json()) as {
      rates?: Record<string, number>;
      time_last_update_unix?: number;
    };
    const brl = data?.rates?.BRL;
    if (typeof brl !== "number") {
      throw new Error("BRL rate missing from upstream response");
    }
    res.setHeader("cache-control", "public, max-age=60, s-maxage=300");
    res.status(200).json({
      base: "USD",
      quote: "BRL",
      rate: brl,
      timestamp: data.time_last_update_unix
        ? data.time_last_update_unix * 1000
        : Date.now(),
      source: "open.er-api.com",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch USD/BRL exchange rate",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
