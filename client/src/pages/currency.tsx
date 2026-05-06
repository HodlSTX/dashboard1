import { useQuery } from "@tanstack/react-query";
import { RefreshCw, ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type FxResponse = {
  base: "USD";
  quote: "BRL";
  rate: number;
  timestamp: number;
  source: string;
};

const REFRESH_MS = 5 * 60 * 1000;

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Currency() {
  const { data, isFetching, isError, error, refetch, dataUpdatedAt } =
    useQuery<FxResponse>({
      queryKey: ["/api/proxy/fx/usd-brl"],
      refetchInterval: REFRESH_MS,
      staleTime: REFRESH_MS,
    });

  const [usdInput, setUsdInput] = useState("1");
  const [direction, setDirection] = useState<"USD_TO_BRL" | "BRL_TO_USD">(
    "USD_TO_BRL",
  );

  const rate = data?.rate;

  const parsed = useMemo(() => {
    const n = parseFloat(usdInput.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }, [usdInput]);

  const converted = useMemo(() => {
    if (!rate) return 0;
    return direction === "USD_TO_BRL" ? parsed * rate : parsed / rate;
  }, [parsed, rate, direction]);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const updatedAgo = useMemo(() => {
    if (!dataUpdatedAt) return "";
    const seconds = Math.max(0, Math.floor((now - dataUpdatedAt) / 1000));
    if (seconds < 60) return `${seconds}s ago`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ago`;
  }, [now, dataUpdatedAt]);

  const isUsdToBrl = direction === "USD_TO_BRL";
  const fromLabel = isUsdToBrl ? "USD" : "BRL";
  const toLabel = isUsdToBrl ? "BRL" : "USD";
  const fromSymbol = isUsdToBrl ? "$" : "R$";

  return (
    <div className="min-h-screen bg-za-dark text-white font-inter px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              data-testid="currency-title"
            >
              USD ⇄ BRL
            </h1>
            <p className="text-sm text-slate-400">Live exchange rate</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-za-purple/20 text-za-purple hover:bg-za-purple/30 disabled:opacity-50"
            aria-label="Refresh rate"
            data-testid="button-refresh-rate"
          >
            <RefreshCw
              className={`h-5 w-5 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </header>

        {/* Hero rate card */}
        <section
          className="rounded-2xl bg-gradient-to-br from-za-purple via-indigo-600 to-cyan-500 p-[1px] shadow-lg"
          data-testid="rate-card"
        >
          <div className="rounded-2xl bg-za-dark/80 p-6 backdrop-blur">
            {isError ? (
              <div className="text-center">
                <p className="text-lg font-semibold text-red-400">
                  Failed to load rate
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {error instanceof Error ? error.message : "Try again"}
                </p>
              </div>
            ) : rate ? (
              <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-slate-400">
                  1 US Dollar equals
                </p>
                <p
                  className="mt-2 text-5xl font-bold tabular-nums sm:text-6xl"
                  data-testid="text-rate-primary"
                >
                  {rate.toFixed(2)}
                </p>
                <p className="mt-1 text-lg font-medium text-slate-300">
                  Brazilian Reais
                </p>
                <p
                  className="mt-4 text-sm text-slate-400"
                  data-testid="text-rate-inverse"
                >
                  1 BRL = ${(1 / rate).toFixed(4)} USD
                </p>
              </div>
            ) : (
              <div className="text-center text-slate-400">Loading rate…</div>
            )}
          </div>
        </section>

        {/* Converter */}
        <section
          className="rounded-2xl border border-za-border bg-za-card/50 p-5"
          data-testid="converter"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Convert
            </h2>
            <button
              onClick={() =>
                setDirection((d) =>
                  d === "USD_TO_BRL" ? "BRL_TO_USD" : "USD_TO_BRL",
                )
              }
              className="inline-flex items-center gap-1 rounded-full bg-za-secondary px-3 py-1 text-xs font-medium text-slate-200 hover:bg-za-secondary/70"
              data-testid="button-swap"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              Swap
            </button>
          </div>

          <label className="block text-xs font-medium text-slate-400">
            {fromLabel}
          </label>
          <div className="mt-1 flex items-center rounded-xl border border-za-border bg-za-dark px-3 py-3 focus-within:border-za-purple">
            <span className="mr-2 text-2xl font-semibold text-slate-400">
              {fromSymbol}
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={usdInput}
              onChange={(e) => setUsdInput(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold tabular-nums outline-none"
              data-testid="input-amount"
            />
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">{toLabel}</p>
            <p
              className="mt-1 text-3xl font-bold tabular-nums"
              data-testid="text-converted"
            >
              {rate
                ? isUsdToBrl
                  ? formatBRL(converted)
                  : formatUSD(converted)
                : "—"}
            </p>
          </div>
        </section>

        <footer className="text-center text-xs text-slate-500">
          {dataUpdatedAt ? (
            <p data-testid="text-updated">
              Updated {updatedAgo}
              {data?.timestamp
                ? ` · source ${formatTime(data.timestamp)}`
                : ""}
            </p>
          ) : null}
          <p className="mt-1">Auto-refreshes every 5 minutes</p>
        </footer>
      </div>
    </div>
  );
}
