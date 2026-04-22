import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { PlaceholderPage } from "./pages/PlaceholderPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reviews"     element={<PlaceholderPage title="All reviews"     description="Browse, filter and label every collected review across sources." />} />
          <Route path="/trends"      element={<PlaceholderPage title="Trend report"    description="Long-form sentiment trend analysis with weekly and monthly breakdowns." />} />
          <Route path="/live"        element={<PlaceholderPage title="Live analyze"    description="Paste any text and run it through all three models in real time." />} />
          <Route path="/compare"     element={<PlaceholderPage title="Model compare"   description="Side-by-side comparison of model agreement, drift, and disagreement matrix." />} />
          <Route path="/accuracy"    element={<PlaceholderPage title="Accuracy report" description="Precision, recall, F1 and accuracy versus the manual label set." />} />
          <Route path="/connections" element={<PlaceholderPage title="Connections"     description="Manage Google Reviews, App Store, Play Store and Trustpilot data sources." />} />
          <Route path="/settings"    element={<PlaceholderPage title="Settings"        description="Workspace preferences, API keys and notification rules." />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
