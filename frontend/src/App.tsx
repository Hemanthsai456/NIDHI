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

import { useState } from "react";
import { Loader2, Mail, RefreshCw, LogOut, ShieldAlert, CheckCircle } from "lucide-react";

// Route protection wrapper with Email Verification Enforcement
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiresOnboarding?: boolean }> = ({ 
  children, 
  requiresOnboarding = true 
}) => {
  const { user, loading, onboarded, resendVerification, reloadUser, logout } = useAuth();
  
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [error, setError] = useState("");

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

  // ── Email Verification Block ──────────────────────────────────────────────
  if (!user.emailVerified) {
    const handleResend = async () => {
      setError("");
      setResendSuccess(false);
      setResendLoading(true);
      try {
        await resendVerification();
        setResendSuccess(true);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to send verification email. Please try again later.");
      } finally {
        setResendLoading(false);
      }
    };

    const handleRefresh = async () => {
      setError("");
      setRefreshLoading(true);
      try {
        await reloadUser();
      } catch (err: any) {
        console.error(err);
        setError("Failed to refresh status. Please try again.");
      } finally {
        setRefreshLoading(false);
      }
    };

    const handleLogout = async () => {
      try {
        await logout();
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800/80 p-8 rounded-xl shadow-xl space-y-6 text-center animate-fade-in">
          
          {/* Logo / Icon */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-950/40 border border-indigo-900/30 rounded-full flex items-center justify-center text-indigo-400 relative">
              <span className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping" />
              <Mail className="w-5 h-5 relative" />
            </div>
            <h2 className="text-lg font-bold text-zinc-100 mt-4">Email Verification Required</h2>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Please verify your email before accessing NIDHI.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-[11px] text-red-400 flex items-start gap-2 text-left">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resendSuccess && (
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-[11px] text-emerald-400 flex items-start gap-2 text-left">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Verification email sent successfully! Check your inbox.</span>
            </div>
          )}

          <div className="bg-zinc-950/60 border border-zinc-850 p-3.5 rounded-lg text-left">
            <span className="text-[9px] uppercase font-bold text-zinc-500 block">Logged In As</span>
            <span className="text-xs font-semibold text-zinc-300 mt-1 block truncate">{user.email}</span>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleRefresh}
              disabled={refreshLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-60"
            >
              {refreshLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking Status...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh Verification Status
                </>
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-750 text-zinc-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-60"
            >
              {resendLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-zinc-500 hover:text-zinc-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer mt-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>

        </div>
      </div>
    );
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
