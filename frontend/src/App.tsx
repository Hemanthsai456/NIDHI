import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import { IntelligenceProvider } from "./context/IntelligenceContext";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Login } from "./pages/Auth/Login";
import { Signup } from "./pages/Auth/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Portfolio } from "./pages/Portfolio";
import { Intelligence } from "./pages/Intelligence";
import { Investments } from "./pages/Investments";
import { Learning } from "./pages/Learning";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Onboarding } from "./pages/Onboarding";
import { Assistant } from "./pages/Assistant";

// Route protection wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiresOnboarding?: boolean }> = ({ 
  children, 
  requiresOnboarding = true 
}) => {
  const { user, loading, onboarded } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect onboarded users away from /onboarding
  if (onboarded && !requiresOnboarding) {
    return <Navigate to="/" replace />;
  }

  // Redirect non-onboarded users to /onboarding
  if (!onboarded && requiresOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <IntelligenceProvider>
          <Router>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Standalone Onboarding Route */}
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute requiresOnboarding={false}>
                    <Onboarding />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Dashboard App Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requiresOnboarding={true}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="intelligence" element={<Intelligence />} />
                <Route path="investments" element={<Investments />} />
                <Route path="learning" element={<Learning />} />
                <Route path="assistant" element={<Assistant />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </IntelligenceProvider>
      </PortfolioProvider>
    </AuthProvider>
  );
};

export default App;
