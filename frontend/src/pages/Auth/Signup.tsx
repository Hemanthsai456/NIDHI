import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, User, Loader2, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

export const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Track if verification email was successfully triggered during signup
  const [emailSent, setEmailSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const { signup, resendVerification, logout } = useAuth();
  const navigate = useNavigate();

  const mapAuthError = (err: any): string => {
    const code = err?.code || "";
    switch (code) {
      case "auth/email-already-in-use":
        return "This email address is already in use. Please log in or try another email.";
      case "auth/invalid-email":
        return "The email address is invalid. Please double-check formatting.";
      case "auth/weak-password":
        return "Password is too weak. Password must be at least 6 characters.";
      case "auth/network-request-failed":
        return "Network connection failed. Please check your internet connection.";
      case "auth/too-many-requests":
        return "Too many requests. Please try again later.";
      default:
        return err.message || "Failed to create account. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await signup(email, password, name);
      // Signup success sets the auth state, which triggers verification inside AuthContext
      setEmailSent(true);
    } catch (err: any) {
      console.error(err);
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendLoading(true);
    setResendSuccess(false);
    try {
      await resendVerification();
      setResendSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToLogin = async () => {
    try {
      await logout(); // Ensure user is signed out
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4">
      {/* Main card */}
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800/80 p-8 rounded-xl shadow-xl">
        
        {/* Brand logo header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 mb-3">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">NIDHI</h1>
          <p className="text-xs text-zinc-400 mt-1">Get started with your AI Investor Copilot</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs text-red-400">
            {error}
          </div>
        )}

        {resendSuccess && (
          <div className="mb-5 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-xs text-emerald-400">
            Verification email resent successfully!
          </div>
        )}

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 rounded-lg py-2.5 font-semibold text-sm transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        ) : (
          /* Success Verification Screen */
          <div className="flex flex-col items-center justify-center text-center space-y-5 py-2 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-950 border border-emerald-900 rounded-full flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-zinc-100">Verify Your Email</h3>
              <p className="text-xs text-zinc-400 leading-relaxed px-1">
                A verification email has been sent to your email address. Please verify your email before logging in.
              </p>
            </div>

            <div className="bg-zinc-950/60 border border-zinc-850 p-3.5 rounded-lg w-full">
              <span className="text-[9px] uppercase font-bold text-zinc-500 block">Registered Email</span>
              <span className="text-xs font-semibold text-zinc-300 mt-1 block truncate">{email}</span>
            </div>

            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-xs font-semibold text-zinc-200 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                type="button"
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Back to Login
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {!emailSent && (
          <p className="mt-6 text-center text-xs text-zinc-450">
            Already have an account?{" "}
            <Link to="/login" className="text-zinc-300 hover:text-zinc-100 font-medium transition-colors">
              Log in
            </Link>
          </p>
        )}

      </div>
    </div>
  );
};
