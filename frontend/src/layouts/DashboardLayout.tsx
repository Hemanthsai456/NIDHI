import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Briefcase, 
  BrainCircuit, 
  TrendingUp, 
  GraduationCap, 
  UserCircle, 
  Settings as SettingsIcon,
  LogOut, 
  Menu, 
  X, 
  Bell,
  User,
  MessageSquare
} from "lucide-react";

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Portfolio", href: "/portfolio", icon: Briefcase },
    { name: "Intelligence", href: "/intelligence", icon: BrainCircuit },
    { name: "Investment Hub", href: "/investments", icon: TrendingUp },
    { name: "Learning Center", href: "/learning", icon: GraduationCap },
    { name: "AI Assistant", href: "/assistant", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: UserCircle },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const getPageTitle = () => {
    const current = navigation.find(item => item.href === location.pathname);
    return current ? current.name : "NIDHI";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex font-sans">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-zinc-800/85 bg-zinc-900">
        {/* Sidebar Brand header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/85 gap-2.5">
          <div className="w-7 h-7 bg-zinc-950 rounded-md flex items-center justify-center border border-zinc-800">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="font-semibold text-sm tracking-wider text-zinc-100">NIDHI</span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors group relative ${
                  isActive 
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700/60" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 border border-transparent"
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-zinc-200" : "text-zinc-450"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer user info & logout */}
        <div className="p-4 border-t border-zinc-800/85">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-950/40 border border-zinc-800/60 mb-2.5">
            <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-semibold text-zinc-200 truncate">{user?.displayName || "Investor"}</p>
              <p className="text-[9px] text-zinc-500 truncate">{user?.email || "loading..."}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium text-zinc-450 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/85 bg-zinc-950 sticky top-0 z-30">
          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Context Title */}
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 hidden md:block">{getPageTitle()}</h2>
          <span className="font-semibold text-sm tracking-wider text-zinc-100 md:hidden">NIDHI</span>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Notification bell placeholder */}
            <button className="p-2 text-zinc-450 hover:text-zinc-200 rounded-lg hover:bg-zinc-900 transition-colors relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            </button>

            {/* Profile Avatar Widget */}
            <div className="h-5 w-px bg-zinc-800" />
            
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <span className="text-[10px] font-bold text-zinc-300">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "I"}
                </span>
              </div>
              <span className="text-xs font-medium text-zinc-300 hidden md:block">
                {user?.displayName || "Investor"}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar overlay / drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-zinc-950/80">
          {/* Menu Card */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-zinc-900 border-r border-zinc-800 shadow-2xl">
            {/* Close button */}
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-zinc-400 hover:text-zinc-250 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo header */}
            <div className="h-16 flex items-center px-6 border-b border-zinc-850 gap-2.5">
              <div className="w-7 h-7 bg-zinc-950 rounded-md flex items-center justify-center border border-zinc-800">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
              </div>
              <span className="font-semibold text-sm tracking-wider text-zinc-105">NIDHI</span>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive 
                        ? "bg-zinc-800 text-zinc-100 border border-zinc-700/60" 
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Sidebar Footer */}
            <div className="p-4 border-t border-zinc-850">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-950/40 border border-zinc-800/60 mb-2.5">
                <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-zinc-450" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[11px] font-semibold text-zinc-200 truncate">{user?.displayName || "Investor"}</p>
                  <p className="text-[9px] text-zinc-505 truncate">{user?.email || "loading..."}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium text-zinc-450 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
