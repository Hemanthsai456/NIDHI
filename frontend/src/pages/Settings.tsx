import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  Bell,
  Link2,
  Settings as SettingsIcon,
  CheckCircle,
  AlertTriangle,
  Lock,
  Laptop,
  User,
  Mail,
  TrendingUp,
  Target,
  Activity
} from "lucide-react";

interface BrokerConnection {
  id: string;
  name: string;
  logoColor: string;
  connected: boolean;
  lastSynced?: string;
  accountNo?: string;
}

export const Settings: React.FC = () => {
  const { clearPortfolio, holdings } = usePortfolio();
  const { user, profile } = useAuth();

  const [activeTab, setActiveTab] = useState<"account" | "security" | "notifications" | "brokers" | "system">("account");
  
  // Theme state
  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem("nidhi_theme_accent") || "indigo";
  });

  // Settings states
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [aiSharing, setAiSharing] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifRebalance, setNotifRebalance] = useState(true);
  const [notifVolatility, setNotifVolatility] = useState(false);

  // Broker states
  const [brokers, setBrokers] = useState<BrokerConnection[]>([
    { id: "zerodha", name: "Zerodha Kite", logoColor: "bg-orange-500", connected: true, lastSynced: "10 mins ago", accountNo: "ZR8819" },
    { id: "groww", name: "Groww", logoColor: "bg-emerald-500", connected: false },
    { id: "angel", name: "AngelOne", logoColor: "bg-blue-500", connected: false },
    { id: "cams", name: "CAMS Mutual Fund Hub", logoColor: "bg-indigo-500", connected: false }
  ]);

  // Alert message toast mock
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Destructive reset dialog modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");

  const triggerToast = (type: "success" | "error", text: string) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleToggleBroker = (id: string) => {
    setBrokers(prev =>
      prev.map(b => {
        if (b.id === id) {
          const isConnecting = !b.connected;
          if (isConnecting) {
            triggerToast("success", `Connected successfully to ${b.name}`);
            return {
              ...b,
              connected: true,
              lastSynced: "Just now",
              accountNo: `LK${Math.floor(1000 + Math.random() * 9000)}`
            };
          } else {
            triggerToast("success", `Disconnected from ${b.name}`);
            return { ...b, connected: false, lastSynced: undefined, accountNo: undefined };
          }
        }
        return b;
      })
    );
  };

  const handleResetPortfolio = async () => {
    if (resetConfirmText.toLowerCase() !== "delete") {
      triggerToast("error", "Confirmation word must match 'delete'");
      return;
    }

    try {
      await clearPortfolio();
      triggerToast("success", "Portfolio holdings cleared successfully!");
      setShowResetModal(false);
      setResetConfirmText("");
    } catch (e) {
      triggerToast("error", "Reset request failed");
    }
  };

  const handleThemeChange = (color: string) => {
    setAccentColor(color);
    localStorage.setItem("nidhi_theme_accent", color);
    triggerToast("success", `App accent updated to ${color.toUpperCase()}`);
    
    // Dynamically apply visual change by adding data attribute to DOM root
    document.documentElement.setAttribute("data-theme-accent", color);
  };

  const getAccentText = (color: string) => {
    if (color === "emerald") return "text-emerald-500 hover:text-emerald-400";
    if (color === "rose") return "text-rose-500 hover:text-rose-400";
    if (color === "amber") return "text-amber-500 hover:text-amber-400";
    return "text-indigo-500 hover:text-indigo-400";
  };

  const getAccentBg = (color: string) => {
    if (color === "emerald") return "bg-emerald-600 hover:bg-emerald-550";
    if (color === "rose") return "bg-rose-600 hover:bg-rose-550";
    if (color === "amber") return "bg-amber-600 hover:bg-amber-550";
    return "bg-indigo-650 hover:bg-indigo-600";
  };



  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          Settings
          <SettingsIcon className="w-5 h-5 text-zinc-400" />
        </h1>
        <p className="text-zinc-400 text-xs mt-1">Configure NIDHI accounts, notification triggers, and platform linkages.</p>
      </div>

      {/* Toast Alert */}
      {alert && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg border text-xs shadow-xl animate-fade-in ${
            alert.type === "success"
              ? "bg-emerald-950/70 border-emerald-900/60 text-emerald-400"
              : "bg-rose-950/70 border-rose-900/60 text-rose-400"
          }`}
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{alert.text}</span>
        </div>
      )}

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Side Tab selectors */}
        <div className="md:col-span-1 space-y-1">
          <button
            onClick={() => setActiveTab("account")}
            className={`w-full text-left flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeTab === "account"
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 font-bold shadow-sm"
                : "bg-zinc-900 border-zinc-900/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <User className="w-4 h-4 text-zinc-400" />
            Account & Profile
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full text-left flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeTab === "security"
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 font-bold shadow-sm"
                : "bg-zinc-900 border-zinc-900/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Shield className="w-4 h-4 text-zinc-400" />
            Security & Privacy
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-left flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeTab === "notifications"
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 font-bold shadow-sm"
                : "bg-zinc-900 border-zinc-900/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Bell className="w-4 h-4 text-zinc-400" />
            Notification Rules
          </button>

          <button
            onClick={() => setActiveTab("brokers")}
            className={`w-full text-left flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeTab === "brokers"
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 font-bold shadow-sm"
                : "bg-zinc-900 border-zinc-900/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Link2 className="w-4 h-4 text-zinc-400" />
            Connected Brokers
          </button>

          <button
            onClick={() => setActiveTab("system")}
            className={`w-full text-left flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeTab === "system"
                ? "bg-zinc-800 border-zinc-700 text-zinc-100 font-bold shadow-sm"
                : "bg-zinc-900 border-zinc-900/60 text-zinc-400 hover:text-zinc-250"
            }`}
          >
            <Laptop className="w-4 h-4 text-zinc-400" />
            System & Danger Zone
          </button>
        </div>

        {/* Right Content Panel */}
        <div className="md:col-span-3">
          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="space-y-4 animate-fade-in">
              {/* Profile Card */}
              <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl">
                <div className="border-b border-zinc-850 pb-4 mb-5">
                  <h2 className="text-sm font-bold text-zinc-100">Account Information</h2>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Your Firebase authentication account and linked investor profile.</p>
                </div>

                {/* Avatar + name row */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-indigo-950 border border-indigo-900/50 flex items-center justify-center text-indigo-400 text-xl font-extrabold">
                    {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-100">{user?.displayName || profile?.fullName || "Investor"}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3 text-zinc-500" />
                      <span className="text-[10px] text-zinc-400">{user?.email || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-900/50 text-indigo-400">Firebase Auth</span>
                      <span className="text-[8px] font-mono text-zinc-600">{user?.uid?.slice(0, 12)}...</span>
                    </div>
                  </div>
                </div>

                {/* Profile details grid */}
                {profile ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: "Full Name", value: profile.fullName, icon: <User className="w-3 h-3" /> },
                      { label: "Age", value: `${profile.age} years`, icon: <User className="w-3 h-3" /> },
                      { label: "Occupation", value: profile.occupation, icon: <TrendingUp className="w-3 h-3" /> },
                      { label: "Annual Income", value: profile.annualIncome, icon: <TrendingUp className="w-3 h-3" /> },
                      { label: "Investment Goal", value: profile.goal, icon: <Target className="w-3 h-3" /> },
                      { label: "Risk Appetite", value: profile.riskAppetite, icon: <Activity className="w-3 h-3" /> },
                      { label: "Time Horizon", value: profile.horizon, icon: <Activity className="w-3 h-3" /> },
                      { label: "Monthly Budget", value: `₹${profile.capacity?.toLocaleString("en-IN")}`, icon: <TrendingUp className="w-3 h-3" /> },
                      { label: "Experience", value: profile.experience, icon: <Activity className="w-3 h-3" /> },
                    ].map(item => (
                      <div key={item.label} className="bg-zinc-950/40 border border-zinc-850 p-3 rounded-lg">
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                          {item.icon}{item.label}
                        </p>
                        <p className="text-xs font-semibold text-zinc-200 truncate">{item.value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-950/40 border border-zinc-850 rounded-lg p-4 text-center">
                    <p className="text-xs text-zinc-500">No investor profile found. Complete onboarding to see your profile details here.</p>
                  </div>
                )}
              </div>

              {/* Portfolio summary */}
              <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl">
                <h3 className="text-xs font-bold text-zinc-300 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  Portfolio Summary
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-950/40 border border-zinc-850 p-3 rounded-lg text-center">
                    <p className="text-2xl font-extrabold text-zinc-100">{holdings.length}</p>
                    <p className="text-[9px] text-zinc-500 font-semibold uppercase mt-0.5">Total Holdings</p>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-850 p-3 rounded-lg text-center">
                    <p className="text-2xl font-extrabold text-indigo-400">
                      ₹{holdings.reduce((s, h) => s + h.quantity * h.currentPrice, 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-[9px] text-zinc-500 font-semibold uppercase mt-0.5">Current Value</p>
                  </div>
                  <div className="bg-zinc-950/40 border border-zinc-850 p-3 rounded-lg text-center">
                    <p className="text-2xl font-extrabold text-zinc-100">
                      {new Set(holdings.map(h => h.type)).size}
                    </p>
                    <p className="text-[9px] text-zinc-500 font-semibold uppercase mt-0.5">Asset Types</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl space-y-6 animate-fade-in">
              <div className="border-b border-zinc-850 pb-3">
                <h2 className="text-sm font-bold text-zinc-100">Security & Privacy Settings</h2>
                <p className="text-[10px] text-zinc-400 mt-0.5">Manage authentication parameters and user privacy control.</p>
              </div>

              {/* Password change mock */}
              <div className="space-y-4 max-w-sm">
                <h3 className="text-xs font-bold text-zinc-350 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Change Password
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-3 text-zinc-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-3 text-zinc-100 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerToast("success", "Password updated successfully!")}
                    className={`py-2 px-4 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer ${getAccentBg(accentColor)}`}
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="h-px bg-zinc-850 my-2" />

              {/* Toggles */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-350">Privacy Preferences</h3>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center bg-zinc-950/30 p-3 rounded-lg border border-zinc-850">
                    <div>
                      <span className="font-semibold text-zinc-200">Two-Factor Authentication (MFA)</span>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Secure logins with mobile OTP authentication checks.</p>
                    </div>
                    <button
                      onClick={() => {
                        setMfaEnabled(!mfaEnabled);
                        triggerToast("success", `2FA ${!mfaEnabled ? "Enabled" : "Disabled"}`);
                      }}
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${
                        mfaEnabled ? "bg-emerald-600 flex justify-end" : "bg-zinc-800 flex justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center bg-zinc-950/30 p-3 rounded-lg border border-zinc-850">
                    <div>
                      <span className="font-semibold text-zinc-200">Anonymized Portfolio Sharing</span>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Share encrypted portfolio allocations with NIDHI AI to calculate global statistics.</p>
                    </div>
                    <button
                      onClick={() => {
                        setAiSharing(!aiSharing);
                        triggerToast("success", `AI allocation sharing ${!aiSharing ? "Enabled" : "Disabled"}`);
                      }}
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${
                        aiSharing ? "bg-emerald-600 flex justify-end" : "bg-zinc-800 flex justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl space-y-6 animate-fade-in">
              <div className="border-b border-zinc-850 pb-3">
                <h2 className="text-sm font-bold text-zinc-100">Notification Rules</h2>
                <p className="text-[10px] text-zinc-400 mt-0.5">Configure weekly digest deliveries and real-time advisory triggers.</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center bg-zinc-950/30 p-3.5 rounded-lg border border-zinc-850">
                  <div>
                    <span className="font-semibold text-zinc-200">Email Weekly Reports</span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Receive detailed health score summaries and diversification checks in your inbox.</p>
                  </div>
                  <button
                    onClick={() => setNotifWeekly(!notifWeekly)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${
                      notifWeekly ? "bg-emerald-600 flex justify-end" : "bg-zinc-800 flex justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>

                <div className="flex justify-between items-center bg-zinc-950/30 p-3.5 rounded-lg border border-zinc-850">
                  <div>
                    <span className="font-semibold text-zinc-200">SMS Transaction Alerts</span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Get immediate text alerts upon simulated broker transaction execution.</p>
                  </div>
                  <button
                    onClick={() => setNotifSms(!notifSms)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${
                      notifSms ? "bg-emerald-600 flex justify-end" : "bg-zinc-800 flex justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>

                <div className="flex justify-between items-center bg-zinc-950/30 p-3.5 rounded-lg border border-zinc-850">
                  <div>
                    <span className="font-semibold text-zinc-200">AI Rebalancing Warnings</span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Warnings when sector concentration weights breach limit values (&gt;25%).</p>
                  </div>
                  <button
                    onClick={() => setNotifRebalance(!notifRebalance)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${
                      notifRebalance ? "bg-emerald-600 flex justify-end" : "bg-zinc-800 flex justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>

                <div className="flex justify-between items-center bg-zinc-950/30 p-3.5 rounded-lg border border-zinc-850">
                  <div>
                    <span className="font-semibold text-zinc-200">Market Volatility Reports</span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Trigger warning reports if Nifty index swings exceed 3.5% in a single trading session.</p>
                  </div>
                  <button
                    onClick={() => setNotifVolatility(!notifVolatility)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-250 cursor-pointer ${
                      notifVolatility ? "bg-emerald-600 flex justify-end" : "bg-zinc-800 flex justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Connected Brokers Tab */}
          {activeTab === "brokers" && (
            <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl space-y-5 animate-fade-in">
              <div className="border-b border-zinc-850 pb-3">
                <h2 className="text-sm font-bold text-zinc-100">Connected Broker Platforms</h2>
                <p className="text-[10px] text-zinc-400 mt-0.5">Configure live linkages to import investment holdings and execute recommended buys.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brokers.map(b => (
                  <div key={b.id} className="bg-zinc-950/40 border border-zinc-850 p-4.5 rounded-xl flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${b.logoColor}`}>
                          {b.name[0]}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-200">{b.name}</h4>
                          <span className="text-[9px] text-zinc-500 block">
                            {b.connected ? `Account: ${b.accountNo}` : "Disconnected"}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                        b.connected 
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-900/40" 
                          : "bg-zinc-900 text-zinc-500 border-zinc-800"
                      }`}>
                        {b.connected ? "Connected" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-zinc-850/60 pt-3 text-[10px] text-zinc-400">
                      <span>{b.connected ? `Synced: ${b.lastSynced}` : "Manual Import Only"}</span>
                      <button
                        onClick={() => handleToggleBroker(b.id)}
                        className={`font-semibold cursor-pointer transition-colors ${getAccentText(accentColor)}`}
                      >
                        {b.connected ? "Disconnect" : "Link Account"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System & Danger Zone Tab */}
          {activeTab === "system" && (
            <div className="space-y-6 animate-fade-in">
              {/* Customization Accent theme card */}
              <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl space-y-4">
                <div className="border-b border-zinc-850 pb-3">
                  <h2 className="text-sm font-bold text-zinc-100">Visual Settings</h2>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Customize border highlights and visual colors inside the super-app.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] text-zinc-500 font-bold uppercase">Select Accent Palette</label>
                  <div className="flex gap-3">
                    {[
                      { name: "indigo", label: "Sleek Indigo", dotColor: "bg-indigo-500" },
                      { name: "emerald", label: "Emerald Green", dotColor: "bg-emerald-500" },
                      { name: "rose", label: "Ruby Rose", dotColor: "bg-rose-500" },
                      { name: "amber", label: "Amber Gold", dotColor: "bg-amber-500" }
                    ].map(theme => (
                      <button
                        key={theme.name}
                        onClick={() => handleThemeChange(theme.name)}
                        className={`flex-1 flex items-center justify-center gap-2 p-2.5 border rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          accentColor === theme.name 
                            ? "bg-zinc-800 border-zinc-700 text-zinc-100" 
                            : "bg-zinc-950/50 border-zinc-850 text-zinc-450 hover:text-zinc-200"
                        }`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${theme.dotColor}`} />
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-zinc-900 border border-red-950/40 p-6 rounded-xl space-y-4">
                <div className="border-b border-red-950/30 pb-3">
                  <h2 className="text-sm font-bold text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4.5 h-4.5" />
                    Danger Zone
                  </h2>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Destructive account operations that cannot be undone.</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-red-950/5 border border-red-900/10 p-4 rounded-lg gap-4">
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">Reset Portfolio Holdings</span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Permanently clear and wipe out all assets and CSV-imported stocks from NIDHI.</p>
                  </div>
                  <button
                    onClick={() => setShowResetModal(true)}
                    className="py-2 px-3.5 bg-red-650 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Wipe Portfolio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Double confirmation modal for reset portfolio */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-6 rounded-xl shadow-2xl space-y-5">
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Permanent Deletion Request
              </span>
              <h3 className="text-base font-bold text-zinc-100">Are you absolutely sure?</h3>
              <p className="text-[11px] text-zinc-450 leading-relaxed">
                This action is irreversible and will permanently wipe out all <strong>{holdings.length} holdings</strong> from your current logged-in profile context.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">
                Type <strong className="text-red-400">delete</strong> to confirm:
              </label>
              <input
                type="text"
                required
                value={resetConfirmText}
                onChange={(e) => setResetConfirmText(e.target.value)}
                placeholder="delete"
                className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:border-red-900 transition-colors"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirmText("");
                }}
                className="py-2 px-3.5 border border-zinc-850 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 transition-colors text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPortfolio}
                disabled={resetConfirmText.toLowerCase() !== "delete"}
                className="py-2 px-4 bg-red-650 hover:bg-red-600 disabled:bg-zinc-850 disabled:text-zinc-550 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Confirm Wipeout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
