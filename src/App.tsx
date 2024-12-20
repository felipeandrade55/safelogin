import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Trash from "@/pages/Trash";
import ExportPage from "@/pages/ExportPage";
import CredentialHistory from "@/pages/CredentialHistory";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Index />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="/history/:id" element={<CredentialHistory />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;