import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ContentProvider } from "@/contexts/ContentContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import DynamicPage from "./pages/DynamicPage";
import NotFound from "./pages/NotFound";
import Tutorial from "./pages/Tutorial";
import LegalPage from "./pages/LegalPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ContentProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/panel-x7k9m2" element={<Admin />} />
            <Route path="/tutorial" element={<Tutorial />} />
            {/* Правовые страницы */}
            <Route path="/legal/:slug" element={<LegalPage />} />
            {/* Редирект /privacy на /legal/privacy для обратной совместимости */}
            <Route path="/privacy" element={<Navigate to="/legal/privacy" replace />} />
            <Route path="/:slug" element={<DynamicPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ContentProvider>
  </QueryClientProvider>
);

export default App;