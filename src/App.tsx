import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const CompanyRegistration = lazy(() => import("./pages/CompanyRegistration"));
const Trash = lazy(() => import("./pages/Trash"));
const CredentialHistory = lazy(() => import("./pages/CredentialHistory").then(module => ({ default: module.CredentialHistory })));
const ExportPage = lazy(() => import("./pages/ExportPage").then(module => ({ default: module.ExportPage })));

function App() {
  return (
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
  );
}

export default App;