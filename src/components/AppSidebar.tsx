import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, MessagesSquare, TrendingUp, Wand2, GitCompare, BadgeCheck, Plug, Settings,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { SOURCE_STATUS, type Source } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const NAV = [
  { title: "Dashboard",       url: "/",                 icon: LayoutDashboard },
  { title: "All Reviews",     url: "/reviews",          icon: MessagesSquare },
  { title: "Trend Report",    url: "/trends",           icon: TrendingUp },
  { title: "Live Analyze",    url: "/live",             icon: Wand2 },
  { title: "Model Compare",   url: "/compare",          icon: GitCompare },
  { title: "Accuracy Report", url: "/accuracy",         icon: BadgeCheck },
  { title: "Connections",     url: "/connections",      icon: Plug },
  { title: "Settings",        url: "/settings",         icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent grid place-items-center shrink-0">
            <span className="font-display font-bold text-background text-sm">S</span>
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display font-bold text-foreground tracking-tight">Sentilytics</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono-data">Multi-model · v1.0</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-primary">
                      <NavLink to={item.url} end={item.url === "/"}>
                        <item.icon className={cn("h-4 w-4", active && "text-primary")} />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                        {!collapsed && active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-3 py-3">
        {!collapsed ? (
          <div>
            <div className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Connected sources
            </div>
            <ul className="space-y-1.5">
              {(Object.keys(SOURCE_STATUS) as Source[]).map((src) => {
                const status = SOURCE_STATUS[src];
                const ok = status === "connected";
                return (
                  <li key={src} className="flex items-center justify-between text-xs">
                    <span className="text-sidebar-foreground">{src}</span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          ok ? "bg-positive shadow-[0_0_8px_hsl(var(--positive))]" : "bg-accent shadow-[0_0_8px_hsl(var(--accent))]",
                        )}
                      />
                      <span className="font-mono-data text-[10px] uppercase tracking-wider text-muted-foreground">
                        {ok ? "live" : "warn"}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {(Object.keys(SOURCE_STATUS) as Source[]).map((src) => {
              const ok = SOURCE_STATUS[src] === "connected";
              return (
                <span
                  key={src}
                  title={src}
                  className={cn("h-2 w-2 rounded-full", ok ? "bg-positive" : "bg-accent")}
                />
              );
            })}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
