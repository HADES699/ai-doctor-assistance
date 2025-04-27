import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatbotPage from "./pages/ChatbotPage";
import CancerDetectionPage from "./pages/CancerDetectionPage";
import MedicalReportPage from "./pages/MedicalReportPage";
import XrayMriPage from "./pages/XrayMriPage";
import HospitalsPage from "./pages/HospitalsPage";
import NotFound from "./pages/NotFound";
import { ResultsProvider } from "./context/ResultsContext";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes  */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route
              path="/cancer-detection"
              element={
                <ResultsProvider>
                  <CancerDetectionPage />
                </ResultsProvider>
              }
            />
            <Route path="/medical-reports" element={<MedicalReportPage />} />
            <Route path="/xray-mri" element={<XrayMriPage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
