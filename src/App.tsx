import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import { ExportPage } from "@/pages/ExportPage";
import { CredentialHistory } from "@/pages/CredentialHistory";
import { Trash } from "@/pages/Trash";
import { CompanyRegistration } from "@/pages/CompanyRegistration";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainNav } from "@/components/MainNav";
import Auth from "@/pages/Auth";
import { supabase } from "@/lib/supabase";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <MainNav />
                    <Index />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/export"
              element={
                <ProtectedRoute>
                  <>
                    <MainNav />
                    <ExportPage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <>
                    <MainNav />
                    <CredentialHistory />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/trash"
              element={
                <ProtectedRoute>
                  <>
                    <MainNav />
                    <Trash />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cadastros/empresas"
              element={
                <ProtectedRoute>
                  <>
                    <MainNav />
                    <CompanyRegistration />
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;