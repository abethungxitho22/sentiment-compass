import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/mock-data";

interface Props { reviews: Review[]; }

const labelStyle: Record<string, string> = {
  positive: "bg-positive/10 text-positive border-positive/30",
  negative: "bg-negative/10 text-negative border-negative/30",
  neutral:  "bg-neutral/10  text-neutral  border-neutral/30",
};

const sourceColor: Record<string, string> = {
  "Google Reviews": "text-primary",
  "App Store": "text-secondary",
  "Play Store": "text-accent",
  "Trustpilot": "text-positive",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function LiveReviewFeed({ reviews }: Props) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  // Rotate the most-recent slice deterministically
  const latest = [...reviews].slice(0, 40);
  const offset = tick % Math.max(1, latest.length - 6);
  const visible = latest.slice(offset, offset + 6);

  return (
    <div className="panel panel-cyan p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Live review feed</h2>
          <p className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Streaming · all sources
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-data text-positive">
          <span className="pulse-dot text-positive bg-positive" />
          <span className="uppercase tracking-[0.18em]">Live</span>
        </div>
      </div>

      <ul className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {visible.map((r) => (
          <li key={r.id + tick} className="ticker-in rounded-xl border border-border/60 bg-background/40 p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className={cn("font-mono-data text-[10px] uppercase tracking-[0.18em]", sourceColor[r.source])}>
                  {r.source}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground truncate">{r.author}</span>
              </div>
              <span className="font-mono-data text-[10px] text-muted-foreground shrink-0">
                {timeAgo(r.createdAt)}
              </span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed mb-3">{r.text}</p>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-3 w-3", i < r.rating ? "fill-accent text-accent" : "text-muted")}
                  />
                ))}
              </div>
              <span className={cn(
                "rounded-full border px-2.5 py-0.5 text-[10px] font-mono-data uppercase tracking-[0.18em]",
                labelStyle[r.label],
              )}>
                {r.label}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
