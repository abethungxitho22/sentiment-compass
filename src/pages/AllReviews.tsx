import { useMemo, useState } from "react";
import { Search, Trash2, MessagesSquare } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAnalysisHistory } from "@/hooks/use-analysis-history";
import { cn } from "@/lib/utils";
import type { ModelName } from "@/lib/sentiment";

const labelTone: Record<string, string> = {
  positive: "text-positive border-positive/30 bg-positive/10",
  negative: "text-negative border-negative/30 bg-negative/10",
  neutral:  "text-neutral  border-neutral/30  bg-neutral/10",
};

const modelColor: Record<ModelName, string> = {
  VADER: "text-primary",
  HuggingFace: "text-secondary",
  "AWS Comprehend": "text-accent",
};

const FILTERS = ["all", "positive", "neutral", "negative"] as const;
type Filter = typeof FILTERS[number];

function fullDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function AllReviews() {
  const { history, remove, clear } = useAnalysisHistory();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return history.filter((h) => {
      if (filter !== "all" && h.consensus !== filter) return false;
      if (q.trim() && !h.text.toLowerCase().includes(q.trim().toLowerCase())) return false;
      return true;
    });
  }, [history, q, filter]);

  return (
    <AppLayout>
      <div className="grid-bg">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto space-y-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="font-mono-data text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                Sentilytics · review log
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                All reviews
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Every review you've submitted, with the verdict from all three models.
              </p>
            </div>
            <div className="font-mono-data text-xs text-muted-foreground">
              {history.length} total · {filtered.length} shown
            </div>
          </div>

          {/* Filter bar */}
          <div className="panel panel-cyan p-4 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search reviews…"
                className="pl-9 bg-background/40 border-border/60"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {FILTERS.map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? "default" : "outline"}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "font-mono-data uppercase tracking-[0.15em] text-[10px]",
                    filter === f && "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {f}
                </Button>
              ))}
            </div>
            {history.length > 0 && (
              <Button
                onClick={clear}
                variant="ghost"
                size="sm"
                className="font-mono-data uppercase tracking-[0.15em] text-[10px] text-muted-foreground hover:text-negative"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* List */}
          {history.length === 0 ? (
            <div className="panel panel-purple p-10 text-center">
              <MessagesSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h2 className="font-display text-xl font-semibold mb-1">No reviews yet</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Head to the dashboard and submit a review in the Paste &amp; Analyze panel.
                It will show up here with full per-model breakdown.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="panel p-8 text-center text-sm text-muted-foreground">
              No reviews match your filter.
            </div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((h) => (
                <li key={h.id} className="panel panel-amber p-5">
                  <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[10px] font-mono-data uppercase tracking-[0.18em]",
                        labelTone[h.consensus],
                      )}>
                        {h.consensus}
                      </span>
                      <span className="font-mono-data text-[11px] text-muted-foreground">
                        {fullDate(h.createdAt)}
                      </span>
                    </div>
                    <Button
                      onClick={() => remove(h.id)}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-negative h-7 px-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-3">
                    {h.text}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {h.results.map((r) => {
                      const happy = Math.round(((r.score + 1) / 2) * 100);
                      return (
                        <div key={r.model} className="rounded-lg border border-border/60 bg-background/40 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className={cn("font-display text-sm font-semibold", modelColor[r.model])}>
                              {r.model}
                            </span>
                            <span className={cn(
                              "rounded-full border px-2 py-0.5 text-[9px] font-mono-data uppercase tracking-[0.18em]",
                              labelTone[r.label],
                            )}>
                              {r.label}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between font-mono-data">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
                              Happiness
                            </span>
                            <span className={cn("text-base", modelColor[r.model])}>
                              {happy}<span className="text-muted-foreground text-xs"> / 100</span>
                            </span>
                          </div>
                          <div className="mt-1 font-mono-data text-[10px] text-muted-foreground">
                            score {r.score > 0 ? "+" : ""}{r.score.toFixed(2)} · confidence {(r.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
