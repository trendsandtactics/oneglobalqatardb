import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteSEO } from "@/components/common/RouteSEO";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import GlobalPresence from "./pages/GlobalPresence";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AirFreight from "./pages/services/AirFreight";
import OceanFreight from "./pages/services/OceanFreight";
import RoadFreight from "./pages/services/RoadFreight";
import CustomsClearance from "./pages/services/CustomsClearance";
import Warehousing from "./pages/services/Warehousing";
import ProjectLogistics from "./pages/services/ProjectLogistics";
import ScrollToTop from "./components/ScrollToTop";

// Admin pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminLayout = lazy(() => import("./pages/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Dashboard"));
const ManageSection = lazy(() => import("./pages/ManageSection"));

const queryClient = new QueryClient();

const AdminLoading = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteSEO />
        <ScrollToTop />
        <Suspense fallback={<AdminLoading />}>
          <Routes>
            <Route path="/services" element={<Services />} />
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/global-presence" element={<GlobalPresence />} />
            {/* Service detail pages */}
            <Route path="/services/air-freight" element={<AirFreight />} />
            <Route path="/services/ocean-freight" element={<OceanFreight />} />
            <Route path="/services/road-freight" element={<RoadFreight />} />
            <Route path="/services/customs-clearance" element={<CustomsClearance />} />
            <Route path="/services/warehousing" element={<Warehousing />} />
            <Route path="/services/project-logistics" element={<ProjectLogistics />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="manage/:sectionName" element={<ManageSection />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
