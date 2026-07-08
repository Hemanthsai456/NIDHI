import React from "react";
import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { useIntelligence } from "../context/IntelligenceContext";
import { useAuth } from "../context/AuthContext";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowRight, 
  Activity, 
  Shield, 
  AlertTriangle,
  Award,
  Sparkles,
  PieChart as PieIcon
} from "lucide-react";

const COLORS = ["#6366f1", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4", "#a1a1aa"];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { holdings } = usePortfolio();
  const { analytics, loading } = useIntelligence();

  // Metrics calculations
  const totalCost = holdings.reduce((acc, curr) => acc + (curr.quantity * curr.avgPrice), 0);
  const currentValue = holdings.reduce((acc, curr) => acc + (curr.quantity * curr.currentPrice), 0);
  const totalReturns = currentValue - totalCost;
  const returnPercentage = totalCost > 0 ? (totalReturns / totalCost) * 100 : 0;

  // Simulate historical growth trend based on holdings data
  const getHistoricalData = () => {
    if (holdings.length === 0) return [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    return months.map((m, idx) => {
      const progress = (idx + 1) / months.length;
      const baseValue = totalCost + (currentValue - totalCost) * progress;
      const randomFactor = 0.95 + (Math.sin(idx * 0.9) * 0.04);
      const val = idx === months.length - 1 ? currentValue : baseValue * randomFactor;
      return {
        month: m,
        "Portfolio Value": Number(val.toFixed(0)),
        "Invested Value": Number(totalCost.toFixed(0))
      };
    });
  };

  const trendData = getHistoricalData();

  // Get top holdings sorted by current value
  const topHoldings = [...holdings]
    .map(h => ({
      ...h,
      value: h.quantity * h.currentPrice,
      returns: (h.currentPrice - h.avgPrice) * h.quantity,
      returnPct: h.avgPrice > 0 ? ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  // Formatter for Indian Rupees
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg shadow-lg">
          <p className="text-xs text-zinc-400 font-semibold mb-1">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} className="text-xs font-medium" style={{ color: p.color || p.fill }}>
              {p.name}: {formatCurrency(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg shadow-lg">
          <p className="text-xs font-semibold text-zinc-200">{data.type || data.sector}</p>
          <p className="text-xs text-indigo-400 font-medium mt-0.5">
            {formatCurrency(data.value)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Welcome back, {user?.displayName || "Investor"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Here's a breakdown of your aggregated assets and portfolio performance.
          </p>
        </div>
        <Link 
          to="/portfolio" 
          className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Assets
        </Link>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
            <span>Portfolio Value</span>
            <PieIcon className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-zinc-100">{formatCurrency(currentValue)}</span>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              {totalReturns >= 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">{formatCurrency(totalReturns)}</span>
                  <span className="text-zinc-500">({returnPercentage.toFixed(1)}%)</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-rose-400" />
                  <span className="text-rose-400 font-medium">{formatCurrency(Math.abs(totalReturns))}</span>
                  <span className="text-zinc-550">({returnPercentage.toFixed(1)}%)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Invested Cost */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
            <span>Total Invested</span>
            <Activity className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-zinc-100">{formatCurrency(totalCost)}</span>
            <p className="text-[11px] text-zinc-500 mt-1">Aggregated across all brokers</p>
          </div>
        </div>

        {/* Portfolio Health Score */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
            <span>Health Score</span>
            <Award className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-zinc-100">
                {loading ? "..." : analytics?.healthScore || 0}
              </span>
              <span className="text-xs text-zinc-500 font-medium">/ 100</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              {loading ? "Calculating..." : (analytics?.healthScore && analytics.healthScore >= 75 ? "Excellent allocation" : "Optimization recommended")}
            </p>
          </div>
        </div>

        {/* Risk Rating */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
            <span>Risk Profile</span>
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-zinc-100">
              {loading ? "..." : analytics?.riskRating || "Moderate"}
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">
              Onboarding Goal: <span className="font-medium text-zinc-355">{user ? (localStorage.getItem(`nidhi_profile_${user.uid}`) ? JSON.parse(localStorage.getItem(`nidhi_profile_${user.uid}`)!).goal : "Wealth Creation") : "Wealth Creation"}</span>
            </p>
          </div>
        </div>
      </div>

      {holdings.length === 0 ? (
        /* Empty State */
        <div className="bg-zinc-900 border border-zinc-800 border-dashed py-16 px-4 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center">
            <PieIcon className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-sm font-semibold text-zinc-200">No portfolio data found</h3>
            <p className="text-xs text-zinc-400">
              Complete onboarding and import your portfolio using manual entry or standard statement upload.
            </p>
          </div>
          <Link 
            to="/portfolio" 
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Import Holdings
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* Main Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Portfolio Growth Trend */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Portfolio Value Growth</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Simulated historical trend based on current holdings.</p>
              </div>
              <div className="h-64 pr-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="month" 
                      stroke="#52525b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#52525b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(v) => `₹${v/1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="Portfolio Value" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#valueGrad)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Invested Value" 
                      stroke="#52525b" 
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      fill="none" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Asset Allocation Pie Chart */}
            <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Asset Type Allocation</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Asset diversification breakdown.</p>
              </div>
              
              <div className="h-44 relative my-3">
                {analytics?.assetAllocations && analytics.assetAllocations.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Pie
                        data={analytics.assetAllocations}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {analytics.assetAllocations.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {/* Center metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-semibold text-zinc-500">Total Value</span>
                  <span className="text-sm font-bold text-zinc-200">{formatCurrency(currentValue)}</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-1.5 overflow-y-auto max-h-24">
                {analytics?.assetAllocations?.map((item, idx) => (
                  <div key={item.type} className="flex justify-between items-center text-[10px] text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span>{item.type}</span>
                    </div>
                    <span className="font-medium text-zinc-300">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Grid: Insights & Top Holdings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights & Alerts */}
            <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-indigo-500/10 border border-indigo-500/20 rounded flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-200">Portfolio Insights</h3>
                    <p className="text-[10px] text-zinc-500">AI analysis of current holdings.</p>
                  </div>
                </div>
                <Link to="/intelligence" className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View Full Report
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {analytics?.insights.slice(0, 2).map((insight, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 border rounded-lg flex gap-3 text-left ${
                      insight.type === "warning" 
                        ? "bg-amber-500/5 border-amber-500/15" 
                        : insight.type === "success" 
                        ? "bg-emerald-500/5 border-emerald-500/15"
                        : "bg-zinc-950 border-zinc-800"
                    }`}
                  >
                    <div className="mt-0.5">
                      {insight.type === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-zinc-200">{insight.title}</h4>
                      <p className="text-[11px] text-zinc-400 leading-normal">{insight.description}</p>
                      <p className="text-[10px] text-zinc-500 italic mt-1">Rec: {insight.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Holdings Table */}
            <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-200">Top Holdings</h3>
                    <p className="text-[10px] text-zinc-500">Largest asset exposures by value.</p>
                  </div>
                </div>
                <Link to="/portfolio" className="text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-1">
                  Manage Portfolio
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] text-zinc-400">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800 pb-2">
                      <th className="font-semibold py-2">Asset</th>
                      <th className="font-semibold py-2 text-right">Allocation</th>
                      <th className="font-semibold py-2 text-right">Value</th>
                      <th className="font-semibold py-2 text-right">Gain / Loss</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {topHoldings.map((h) => {
                      const allocation = ((h.value / currentValue) * 100).toFixed(1);
                      return (
                        <tr key={h.id} className="hover:bg-zinc-800/20">
                          <td className="py-2.5 font-medium text-zinc-200">
                            <div>{h.name}</div>
                            <div className="text-[9px] text-zinc-500">{h.type}</div>
                          </td>
                          <td className="py-2.5 text-right font-medium text-zinc-300">{allocation}%</td>
                          <td className="py-2.5 text-right font-bold text-zinc-250">{formatCurrency(h.value)}</td>
                          <td className={`py-2.5 text-right font-semibold ${h.returns >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {h.returns >= 0 ? "+" : ""}{formatCurrency(h.returns)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
