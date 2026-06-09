import { useMemo, useState } from "react";
import { Sparkles, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeAll, ModelName, ModelResult } from "@/lib/sentiment";
import type { AnalysisHistoryItem } from "@/hooks/use-analysis-history";
export type { AnalysisHistoryItem };
import { cn } from "@/lib/utils";

const modelMeta: Record<ModelName, { color: string; bar: string; tag: string }> = {
  VADER: { color: "text-primary", bar: "bg-primary", tag: "Lexicon · rule-based" },
  HuggingFace: { color: "text-secondary", bar: "bg-secondary", tag: "RoBERTa · transformer" },
};

const labelTone: Record<string, string> = {
  positive: "text-positive border-positive/30 bg-positive/10",
  negative: "text-negative border-negative/30 bg-negative/10",
  neutral: "text-neutral border-neutral/30 bg-neutral/10",
};

interface Props {
  history: AnalysisHistoryItem[];
  onSubmit: (text: string, results: ModelResult[]) => void;
  onClear: () => void;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function PasteAnalyzer({ history, onSubmit, onClear }: Props) {
  const [text, setText] = useState(
    "The new dashboard looks beautiful and is incredibly fast, but the export button is broken."
  );
  const [submitted, setSubmitted] = useState(text);

  const results = useMemo(() => analyzeAll(submitted || ""), [submitted]);

  const handleAnalyze = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmitted(trimmed);
    onSubmit(trimmed, analyzeAll(trimmed));
  };

  return (
    <div className="panel panel-amber p-5 sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Paste & analyze
          </h2>
          <p className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Write a review · 3 models analyze it · See results instantly
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* INPUT */}
        <div className="space-y-3">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a customer review, feedback, or any text…"
            className="min-h-[180px] resize-none bg-background/40 border-border/60 font-sans text-sm"
          />

          <div className="flex items-center justify-between gap-3">
            <span className="font-mono-data text-[11px] text-muted-foreground">
              {text.trim().length} chars
            </span>

            <Button
              onClick={handleAnalyze}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono-data uppercase tracking-[0.15em] text-xs"
            >
              Analyze
            </Button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="space-y-3">
          {results.map((r) => {
            const meta = modelMeta[r.model];
            if (!meta) return null;

            const pct = ((r.score + 1) / 2) * 100;

            return (
              <div
                key={r.model}
                className="rounded-xl border border-border/60 bg-background/40 p-4"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <div className={cn("font-display font-semibold", meta.color)}>
                      {r.model}
                    </div>
                    <div className="font-mono-data text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {meta.tag}
                    </div>
                  </div>

                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-mono-data uppercase tracking-[0.18em]",
                      labelTone[r.label]
                    )}
                  >
                    {r.label}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative h-2 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className="absolute inset-y-0 left-1/2 w-px bg-border" />
                    <div
                      className={cn("h-full", meta.bar)}
                      style={{
                        marginLeft: r.score >= 0 ? "50%" : `${pct}%`,
                        width: `${Math.abs(r.score) * 50}%`,
                      }}
                    />
                  </div>

                  <span
                    className={cn("font-mono-data text-sm w-16 text-right", meta.color)}
                  >
                    {r.score > 0 ? "+" : ""}
                    {r.score.toFixed(3)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between font-mono-data text-[10px] text-muted-foreground">
                  <span>−1.0</span>
                  <span>confidence {(r.confidence * 100).toFixed(0)}%</span>
                  <span>+1.0</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HISTORY */}
      <div className="mt-6 pt-5 border-t border-border/60">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="font-display text-sm font-semibold flex items-center gap-2">
            <History className="h-4 w-4 text-accent" />
            Your analysis history
            <span className="font-mono-data text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
              {history.length} entr{history.length === 1 ? "y" : "ies"}
            </span>
          </h3>

          {history.length > 0 && (
            <Button
              onClick={onClear}
              variant="ghost"
              size="sm"
              className="font-mono-data uppercase tracking-[0.15em] text-[10px] text-muted-foreground hover:text-negative"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground font-mono-data">
            No analyses yet — submit a review above to start your history.
          </p>
        ) : (
          <ul className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {history.map((h) => (
              <li
                key={h.id}
                className="rounded-lg border border-border/60 bg-background/40 p-3"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-mono-data uppercase tracking-[0.18em]",
                      labelTone[h.consensus]
                    )}
                  >
                    {h.consensus}
                  </span>

                  <span className="font-mono-data text-[10px] text-muted-foreground">
                    {timeAgo(h.createdAt)}
                  </span>
                </div>

                <p className="text-sm text-foreground/90 mb-2 line-clamp-2">
                  {h.text}
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  {h.results.map((r) => {
                    const meta = modelMeta[r.model];
                    if (!meta) return null;

                    return (
                      <span
                        key={r.model}
                        className="font-mono-data text-[10px] flex items-center gap-1"
                      >
                        <span className={meta.color}>{r.model}</span>
                        <span className="text-muted-foreground">
                          {r.score > 0 ? "+" : ""}
                          {r.score.toFixed(2)}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}