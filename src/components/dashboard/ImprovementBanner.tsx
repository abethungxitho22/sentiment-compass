import { useMemo } from "react";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyTrend } from "@/lib/mock-data";

interface Props { trend: DailyTrend[]; }

export function ImprovementBanner({ trend }: Props) {
  const { delta, improving, recentAvg, prevAvg } = useMemo(() => {
    if (trend.length < 4) return { delta: 0, improving: true, recentAvg: 0, prevAvg: 0 };
    const half = Math.floor(trend.length / 2);
    const recent = trend.slice(half);
    const prev = trend.slice(0, half);
    const avg = (xs: DailyTrend[]) =>
      xs.reduce((s, d) => s + (d.VADER + d.HuggingFace + d["AWS Comprehend"]) / 3, 0) / xs.length;
    const r = avg(recent);
    const p = avg(prev);
    return { delta: r - p, improving: r > p, recentAvg: r, prevAvg: p };
  }, [trend]);

  const pct = (Math.abs(delta) * 100).toFixed(1);

  return (
    <div className={cn("panel p-6 sm:p-8", improving ? "panel-positive" : "panel-negative")}>
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-3 max-w-2xl">
          <div className="font-mono-data text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Sentiment trend · last 30 days
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-[1.05] tracking-tight">
            Is our product improving?{" "}
            <span className={cn(improving ? "text-positive" : "text-negative")}>
              {improving ? "Yes." : "No."}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            {improving
              ? "Average sentiment across all three models is trending upward versus the previous period."
              : "Average sentiment across all three models is declining versus the previous period."}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Δ Compound
            </div>
            <div className={cn("font-mono-data text-3xl sm:text-4xl font-medium", improving ? "text-positive" : "text-negative")}>
              {improving ? "+" : "−"}{pct}%
            </div>
            <div className="font-mono-data text-[11px] text-muted-foreground mt-1">
              {prevAvg.toFixed(3)} → {recentAvg.toFixed(3)}
            </div>
          </div>
          <div
            className={cn(
              "h-16 w-16 rounded-2xl grid place-items-center border",
              improving
                ? "bg-positive/10 border-positive/30 text-positive"
                : "bg-negative/10 border-negative/30 text-negative",
            )}
          >
            {improving ? <TrendingUp className="h-8 w-8" /> : <TrendingDown className="h-8 w-8" />}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs font-mono-data text-muted-foreground">
        <ArrowUpRight className="h-3 w-3 text-primary" />
        <span>Computed across VADER · HuggingFace · AWS Comprehend</span>
      </div>
    </div>
  );
}
