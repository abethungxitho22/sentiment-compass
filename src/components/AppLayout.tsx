import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Activity } from "lucide-react";

interface Props { children: ReactNode; }

export function AppLayout({ children }: Props) {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border/60 px-4 sticky top-0 z-30 bg-background/80 backdrop-blur">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2 text-xs font-mono-data uppercase tracking-[0.18em] text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <span>Stream · live</span>
            </div>
            <div className="ml-auto flex items-center gap-3 text-xs font-mono-data text-muted-foreground">
              <span className="hidden sm:inline">Last sync</span>
              <span className="text-foreground">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </header>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
