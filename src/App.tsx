import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import CompanyRegistration from "./pages/CompanyRegistration";
import Trash from "./pages/Trash";
import { MainNav } from "./components/MainNav";
import { ThemeToggle } from "./components/ThemeToggle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <div className="container mx-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <MainNav />
                <ThemeToggle />
              </div>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/company-registration" element={<CompanyRegistration />} />
                <Route path="/trash" element={<Trash />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;