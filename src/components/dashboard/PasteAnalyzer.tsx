import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeAll, ModelName } from "@/lib/sentiment";
import { cn } from "@/lib/utils";

const modelMeta: Record<ModelName, { color: string; bar: string; tag: string }> = {
  VADER:            { color: "text-primary",   bar: "bg-primary",   tag: "Lexicon · rule-based" },
  HuggingFace:      { color: "text-secondary", bar: "bg-secondary", tag: "RoBERTa · transformer" },
  "AWS Comprehend": { color: "text-accent",    bar: "bg-accent",    tag: "AWS · managed" },
};

const labelTone: Record<string, string> = {
  positive: "text-positive border-positive/30 bg-positive/10",
  negative: "text-negative border-negative/30 bg-negative/10",
  neutral:  "text-neutral  border-neutral/30  bg-neutral/10",
};

export function PasteAnalyzer() {
  const [text, setText] = useState("The new dashboard looks beautiful and is incredibly fast, but the export button is broken.");
  const [submitted, setSubmitted] = useState(text);

  const results = useMemo(() => analyzeAll(submitted || ""), [submitted]);

  return (
    <div className="panel panel-amber p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Paste & analyze
          </h2>
          <p className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Score any text against all three models instantly
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
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
              onClick={() => setSubmitted(text)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono-data uppercase tracking-[0.15em] text-xs"
            >
              Analyze
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {results.map((r) => {
            const meta = modelMeta[r.model];
            const pct = ((r.score + 1) / 2) * 100; // map -1..1 -> 0..100
            return (
              <div key={r.model} className="rounded-xl border border-border/60 bg-background/40 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <div className={cn("font-display font-semibold", meta.color)}>{r.model}</div>
                    <div className="font-mono-data text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {meta.tag}
                    </div>
                  </div>
                  <span className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-mono-data uppercase tracking-[0.18em]",
                    labelTone[r.label],
                  )}>
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
                  <span className={cn("font-mono-data text-sm w-16 text-right", meta.color)}>
                    {r.score > 0 ? "+" : ""}{r.score.toFixed(3)}
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
    </div>
  );
}
