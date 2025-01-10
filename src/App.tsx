import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import { ExportPage } from "@/pages/ExportPage";
import { CredentialHistory } from "@/pages/CredentialHistory";
import { Settings } from "@/pages/Settings";
import { Trash } from "@/pages/Trash";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainNav } from "@/components/MainNav";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <MainNav />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="/history" element={<CredentialHistory />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;