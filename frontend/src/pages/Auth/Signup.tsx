import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, User, Loader2, TrendingUp } from "lucide-react";

export const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

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
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
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
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-450">
          Already have an account?{" "}
          <Link to="/login" className="text-zinc-300 hover:text-zinc-100 font-medium transition-colors">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};
