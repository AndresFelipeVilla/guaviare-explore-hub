import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Chatbot from "./pages/Chatbot";
import ResetPassword from "./pages/ResetPassword";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CreateReport from "./pages/CreateReport";
import AdminViewReports from "./pages/AdminViewReports";
import MyReports from "./pages/MyReports";
import ReportDetails from "./pages/ReportDetails";
import AdminReportDetails from "./pages/AdminReportDetails";
import AdminSettings from "./pages/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/dashboard/informe" element={<CreateReport />} />
            <Route path="/dashboard/informe/:reportId" element={<CreateReport />} />
            <Route path="/dashboard/mis-informes" element={<MyReports />} />
            <Route path="/dashboard/informe/detalles/:reportId" element={<ReportDetails />} />
            <Route path="/admin" element={<Navigate to="/admin/informes" replace />} />
            <Route path="/admin/informes" element={<AdminViewReports />} />
            <Route path="/admin/informe/detalles/:reportId" element={<AdminReportDetails />} />
            <Route path="/admin/configuracion" element={<AdminSettings />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

