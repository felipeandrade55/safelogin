import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import CompanyRegistration from "./pages/CompanyRegistration";
import Trash from "./pages/Trash";
import CredentialHistory from "./pages/CredentialHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/company-registration" element={<CompanyRegistration />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/history" element={<CredentialHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;