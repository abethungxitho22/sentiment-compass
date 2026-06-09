import type { ModelMetrics } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface Props { metrics: ModelMetrics[]; }

const modelAccent: Record<string, string> = {
  VADER: "text-primary",
  HuggingFace: "text-secondary",

};

function Bar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 85 ? "bg-positive" : pct >= 75 ? "bg-primary" : "bg-accent";
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono-data text-xs w-10 text-right">{value.toFixed(2)}</span>
    </div>
  );
}

export function ModelComparisonTable({ metrics }: Props) {
  return (
    <div className="panel panel-amber p-5 sm:p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Model comparison</h2>
          <p className="font-mono-data text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Validated against manual labels · n=240
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              {["Model", "Precision", "Recall", "F1 Score", "Accuracy"].map((h) => (
                <th key={h} className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-normal pb-3 pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {metrics.map((m) => (
              <tr key={m.model}>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", modelAccent[m.model].replace("text-", "bg-"))} />
                    <span className={cn("font-display font-semibold", modelAccent[m.model])}>{m.model}</span>
                  </div>
                </td>
                <td className="py-4 pr-4"><Bar value={m.precision} /></td>
                <td className="py-4 pr-4"><Bar value={m.recall} /></td>
                <td className="py-4 pr-4"><Bar value={m.f1} /></td>
                <td className="py-4 pr-4"><Bar value={m.accuracy} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
