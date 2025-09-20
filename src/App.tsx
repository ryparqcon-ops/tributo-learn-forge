import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/app-layout";
import { ScrollToTop } from "./components/ScrollToTop";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ThemeProvider } from "./components/providers/theme-provider";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Instructors from "./pages/Instructors";
import InstructorProfile from "./pages/InstructorProfile";
import Advisory from "./pages/Advisory";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { SupabaseTest } from "./components/SupabaseTest";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useAuthSession } from "@/hooks/use-auth-session";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Verificar sesión de autenticación
  const { isLoading } = useAuthSession();

  useEffect(() => {
    // Initialize MSW in development
    if (process.env.NODE_ENV === 'development') {
      import('./lib/mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'bypass',
          serviceWorker: {
            url: '/mockServiceWorker.js'
          }
        }).then(() => {
          console.log('MSW initialized successfully');
        }).catch(console.error);
      }).catch(console.error);
    }
  }, []);

  // Mostrar loading mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AppLayout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/course/:slug" element={<CourseDetail />} />
                <Route path="/instructors" element={<Instructors />} />
                <Route path="/instructor/:id" element={<InstructorProfile />} />
                <Route path="/advisory" element={<Advisory />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Test Route - Solo en desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                  <Route path="/test-supabase" element={<SupabaseTest />} />
                )}
                
                {/* Protected Routes */}
                <Route 
                  path="/dashboard/*" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
