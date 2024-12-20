import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import { ExportPage } from "@/pages/ExportPage";
import { CredentialHistory } from "@/pages/CredentialHistory";
import { Settings } from "@/pages/Settings";
import { Trash } from "@/pages/Trash";
import { CompanyRegistration } from "@/pages/CompanyRegistration";
import { NetworkMap } from "@/pages/NetworkMap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainNav } from "@/components/MainNav";
import { RegisterAdmin } from "@/pages/RegisterAdmin";
import Auth from "@/pages/Auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          {session ? (
            <>
              <MainNav />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/export" element={<ExportPage />} />
                <Route path="/history" element={<CredentialHistory />} />
                <Route path="/trash" element={<Trash />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/register-admin" element={<RegisterAdmin />} />
                <Route path="/cadastros/empresas" element={<CompanyRegistration />} />
                <Route path="/network-map" element={<NetworkMap />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </>
          ) : (
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          )}
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;