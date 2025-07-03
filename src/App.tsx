import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { CitySelectionModal } from "@/components/CitySelectionModal";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { AppProvider } from "@/contexts/AppContext";
import ElectronicsPageWrapper from "@/components/ElectronicsPageWrapper";
import Ojah from "./pages/Ojah";

// Import i18n configuration
import "./i18n";

const queryClient = new QueryClient();

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const ListingDetail = lazy(() => import("./pages/ListingDetail"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SubcategoryPage = lazy(() => import("./pages/SubcategoryPage"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ConfirmEmail = lazy(() => import("./pages/ConfirmEmail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Help = lazy(() => import("./pages/Help"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const TransportPage = lazy(() => import("./pages/TransportPage"));
const PropertyPage = lazy(() => import("./pages/PropertyPage"));
const FashionPage = lazy(() => import("./pages/FashionPage"));
const PetsPage = lazy(() => import("./pages/PetsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <AppProvider>
            <AdminProvider>
              <SearchProvider>
                <TooltipProvider>
                  <Toaster />
                  <Routes>
                    {/* Admin panel route */}
                    <Route path="/ojah" element={<Ojah />} />
                    
                    <Route path="/" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <CitySelectionModal />
                        <Index />
                      </Suspense>
                    } />
                    
                    <Route path="/search" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <SearchResults />
                      </Suspense>
                    } />
                    
                    {/* SEO-friendly listing URLs БЕЗ ID */}
                    <Route path="/category/:categorySlug/:titleSlug" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListingDetail />
                      </Suspense>
                    } />
                    
                    {/* Fallback for old listing URLs */}
                    <Route path="/listing/:id" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ListingDetail />
                      </Suspense>
                    } />
                    
                    <Route path="/category/:slug" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <CategoryPage />
                      </Suspense>
                    } />
                    
                    <Route path="/category/:parentSlug/:slug" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <SubcategoryPage />
                      </Suspense>
                    } />
                    
                    <Route path="/create-listing" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <CreateListing />
                      </Suspense>
                    } />
                    
                    <Route path="/profile" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <UserProfile />
                      </Suspense>
                    } />
                    
                    <Route path="/login" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Login />
                      </Suspense>
                    } />
                    
                    <Route path="/register" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Register />
                      </Suspense>
                    } />
                    
                    <Route path="/reset-password" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ResetPassword />
                      </Suspense>
                    } />
                    
                    <Route path="/confirm-email" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ConfirmEmail />
                      </Suspense>
                    } />
                    
                    <Route path="/dashboard" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Dashboard />
                      </Suspense>
                    } />
                    
                    <Route path="/about" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <About />
                      </Suspense>
                    } />
                    
                    <Route path="/contact" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Contact />
                      </Suspense>
                    } />
                    
                    <Route path="/help" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Help />
                      </Suspense>
                    } />
                    
                    <Route path="/privacy-policy" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <PrivacyPolicy />
                      </Suspense>
                    } />
                    
                    <Route path="/terms-of-service" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <TermsOfService />
                      </Suspense>
                    } />
                    
                    <Route path="/transport" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <TransportPage />
                      </Suspense>
                    } />
                    
                    <Route path="/property" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <PropertyPage />
                      </Suspense>
                    } />
                    
                    <Route path="/electronics" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ElectronicsPageWrapper />
                      </Suspense>
                    } />
                    
                    <Route path="/fashion" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <FashionPage />
                      </Suspense>
                    } />
                    
                    <Route path="/pets" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <PetsPage />
                      </Suspense>
                    } />
                    
                    <Route path="*" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <NotFound />
                      </Suspense>
                    } />
                  </Routes>
                </TooltipProvider>
              </SearchProvider>
            </AdminProvider>
          </AppProvider>
        </SupabaseProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
