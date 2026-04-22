import { ReactNode } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Construction } from "lucide-react";

interface Props { title: string; description: string; children?: ReactNode; }

export function PlaceholderPage({ title, description, children }: Props) {
  return (
    <AppLayout>
      <div className="grid-bg min-h-[calc(100vh-3.5rem)]">
        <div className="p-6 lg:p-10 max-w-5xl mx-auto">
          <div className="font-mono-data text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
            Sentilytics
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">{title}</h1>
          <p className="text-muted-foreground mb-8 max-w-xl">{description}</p>
          <div className="panel panel-cyan p-10 grid place-items-center text-center">
            <Construction className="h-10 w-10 text-primary mb-3" />
            <div className="font-display text-lg font-semibold mb-1">Coming soon</div>
            <p className="text-sm text-muted-foreground max-w-md">
              This module is part of the next iteration. The Dashboard contains the live overview with all three models running in parallel.
            </p>
            {children}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
