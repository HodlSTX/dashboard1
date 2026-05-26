import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Link } from "wouter";

type FxResponse = {
  base: "USD";
  quote: "BRL";
  rate: number;
  timestamp: number;
  source: string;
};

const REFRESH_MS = 5 * 60 * 1000;

export function CurrencyBanner() {
  const { data, isFetching, isError, refetch } = useQuery<FxResponse>({
    queryKey: ["/api/proxy/fx/usd-brl"],
    refetchInterval: REFRESH_MS,
    staleTime: REFRESH_MS,
  });

  const rate = data?.rate;

  return (
    <div
      className="sticky top-0 z-40 border-b border-za-border bg-za-dark/85 backdrop-blur"
      data-testid="currency-banner"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2 text-sm sm:px-6">
        <Link
          href="/currency"
          className="flex items-center gap-3 font-medium text-slate-200 hover:text-white"
          data-testid="link-currency"
        >
          <span className="rounded bg-za-purple/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-za-purple">
            USD / BRL
          </span>
          {isError ? (
            <span className="text-red-400">rate unavailable</span>
          ) : rate ? (
            <>
              <span className="text-base font-bold tabular-nums">
                R$ {rate.toFixed(2)}
              </span>
              <span className="hidden text-xs text-slate-400 sm:inline">
                1 USD · inv {(1 / rate).toFixed(4)}
              </span>
            </>
          ) : (
            <span className="text-slate-400">loading…</span>
          )}
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            refetch();
          }}
          disabled={isFetching}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-za-secondary hover:text-white disabled:opacity-50"
          aria-label="Refresh USD/BRL rate"
          data-testid="button-refresh-banner"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
