import { useMemo } from "react";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyTrend } from "@/lib/mock-data";

interface Props { trend: DailyTrend[]; }

const toHappy = (s: number) => ((s + 1) / 2) * 100;

export function ImprovementBanner({ trend }: Props) {
  const { delta, improving, recentAvg, prevAvg, enough } = useMemo(() => {
    if (trend.length < 4) {
      return { delta: 0, improving: true, recentAvg: 0, prevAvg: 0, enough: false };
    }
    const half = Math.floor(trend.length / 2);
    const recent = trend.slice(half);
    const prev = trend.slice(0, half);
    const avg = (xs: DailyTrend[]) =>
      xs.reduce(
        (s, d) => s + toHappy((d.VADER + d.HuggingFace ) / 2),
        0,
      ) / xs.length;
    const r = avg(recent);
    const p = avg(prev);
    return { delta: r - p, improving: r >= p, recentAvg: r, prevAvg: p, enough: true };
  }, [trend]);

  // Empty / not-enough-data state
  if (!enough) {
    return (
      <div className="panel panel-cyan p-6 sm:p-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="space-y-3 max-w-2xl">
  <div className="font-mono-data text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
    Sentiment trend · waiting for data
  </div>
</div>
          <div className="h-16 w-16 rounded-2xl grid place-items-center border bg-primary/10 border-primary/30 text-primary">
            <Sparkles className="h-8 w-8" />
          </div>
        </div>
      </div>
    );
  }

  const pts = Math.abs(delta).toFixed(1);

  return (
    <div className={cn("panel p-6 sm:p-8", improving ? "panel-positive" : "panel-negative")}>
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-3 max-w-2xl">
          <div className="font-mono-data text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Sentiment trend · recent vs earlier reviews
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-[1.05] tracking-tight">
            Is our product improving?{" "}
            <span className={cn(improving ? "text-positive" : "text-negative")}>
              {improving ? "Yes." : "No."}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            Your recent reviews average{" "}
            <span className="text-foreground font-medium">{recentAvg.toFixed(0)} / 100</span>{" "}
            on the happiness scale, versus{" "}
            <span className="text-foreground font-medium">{prevAvg.toFixed(0)} / 100</span>{" "}
            for the earlier ones — that's{" "}
            <span className={cn("font-medium", improving ? "text-positive" : "text-negative")}>
              {improving ? "up" : "down"} {pts} points.
            </span>
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Change
            </div>
            <div className={cn("font-mono-data text-3xl sm:text-4xl font-medium", improving ? "text-positive" : "text-negative")}>
              {improving ? "+" : "−"}{pts}
            </div>
            <div className="font-mono-data text-[11px] text-muted-foreground mt-1">
              points on a 0 – 100 scale
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
    </div>
  );
}
