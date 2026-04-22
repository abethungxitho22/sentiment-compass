import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  variant: "positive" | "negative" | "neutral" | "cyan" | "purple" | "amber";
}

const variantClass: Record<Props["variant"], { panel: string; text: string; bg: string }> = {
  positive: { panel: "panel-positive", text: "text-positive", bg: "bg-positive/10 border-positive/30" },
  negative: { panel: "panel-negative", text: "text-negative", bg: "bg-negative/10 border-negative/30" },
  neutral:  { panel: "panel-neutral",  text: "text-neutral",  bg: "bg-neutral/10  border-neutral/30"  },
  cyan:     { panel: "panel-cyan",     text: "text-primary",  bg: "bg-primary/10  border-primary/30"  },
  purple:   { panel: "panel-purple",   text: "text-secondary",bg: "bg-secondary/10 border-secondary/30"},
  amber:    { panel: "panel-amber",    text: "text-accent",   bg: "bg-accent/10   border-accent/30"   },
};

export function StatBox({ label, value, hint, icon: Icon, variant }: Props) {
  const v = variantClass[variant];
  return (
    <div className={cn("panel p-5 flex flex-col gap-3", v.panel)}>
      <div className="flex items-center justify-between">
        <span className="font-mono-data text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </span>
        <span className={cn("h-9 w-9 rounded-lg border grid place-items-center", v.bg, v.text)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className={cn("font-mono-data text-3xl font-medium tracking-tight", v.text)}>
        {value}
      </div>
      {hint && <div className="font-mono-data text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}
