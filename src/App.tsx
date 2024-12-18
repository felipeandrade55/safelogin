import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const CompanyRegistration = lazy(() => import("./pages/CompanyRegistration"));
const Trash = lazy(() => import("./pages/Trash"));
const CredentialHistory = lazy(() => import("./pages/CredentialHistory").then(module => ({ default: module.CredentialHistory })));
const ExportPage = lazy(() => import("./pages/ExportPage").then(module => ({ default: module.ExportPage })));

function App() {
  // Substitua CLIENT_ID pelo seu ID de cliente do Google
  const GOOGLE_CLIENT_ID = "SEU_CLIENT_ID_AQUI";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Suspense fallback={
          <div className="h-screen w-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/company-registration" element={<CompanyRegistration />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/history" element={<CredentialHistory />} />
            <Route path="/export/:companyId" element={<ExportPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;