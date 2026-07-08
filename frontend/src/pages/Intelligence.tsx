import React, { useState } from "react";
import { useIntelligence } from "../context/IntelligenceContext";
import { usePortfolio } from "../context/PortfolioContext";
import { useAuth } from "../context/AuthContext";
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers,
  Droplet
} from "lucide-react";

// Reusable Circular Progress Score Component
const CircularProgress: React.FC<{ score: number; label: string; strokeColor: string }> = ({ 
  score, 
  label, 
  strokeColor 
}) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-5 bg-zinc-900 border border-zinc-800/80 rounded-xl w-full">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-zinc-800 fill-none"
            strokeWidth="7"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="fill-none transition-all duration-500 ease-out"
            stroke={strokeColor}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-zinc-100">{score}</span>
          <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-bold">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-zinc-300 mt-3 text-center">{label}</span>
    </div>
  );
};

export const Intelligence: React.FC = () => {
  const { user } = useAuth();
  const { holdings } = usePortfolio();
  const { analytics, loading } = useIntelligence();
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);



  // Formatter for Indian Rupees
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const toggleInsight = (idx: number) => {
    setExpandedInsight(prev => (prev === idx ? null : idx));
  };

  // Educational plain-language explanations for insights
  const getEducationalContext = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("concentration")) {
      return {
        explanation: "Concentration risk happens when a single asset represents a very large portion of your total portfolio. If that asset suffers a sharp decline, your entire net worth is hit heavily. By spreading investments across different companies and asset classes, you reduce 'unsystematic risk'—the risk associated with a single company's failures.",
        benefits: "Protects your portfolio from sudden declines in one stock, lowers overall volatility, and ensures smoother capital growth.",
        risks: "Trimming a highly successful winner means you might miss out on a portion of its immediate future run, but it locks in gains.",
        role: "Builds a safe, resilient base. True wealth is protected by diversification and grown by patience."
      };
    }
    if (t.includes("sector")) {
      return {
        explanation: "Different sectors (Technology, Banks, Commodities) run on separate business cycles. For example, when inflation goes up, technology growth stocks might correct, but banking stocks might perform well because of higher interest rate margins. Being overly concentrated in a single sector exposes you to regulatory, industry, or macro cyclical swings.",
        benefits: "Insulates your net worth from structural changes in a single industry. Smooths out returns over multi-year business cycles.",
        risks: "Some sectors may lag in growth during specific market regimes, holding back the overall portfolio rate if allocated heavily.",
        role: "Ensures sector exposure matches broad economic growth rather than bets on a single market narrative."
      };
    }
    if (t.includes("risk") && t.includes("mismatch")) {
      return {
        explanation: "Your onboarding questionnaire indicated a preference for capital stability (Conservative risk profile), but your actual holdings are skewed towards high-risk assets like individual stocks or high-growth equity funds. This means a sudden market correction could lead to capital drops beyond your comfort zone, potentially forcing panic selling.",
        benefits: "Aligns your actual portfolio drops during corrections with your emotional risk tolerance, preventing rash decisions.",
        risks: "Slightly reduces the absolute maximum upside in bubble markets by shifting capital into safer instruments.",
        role: "Serves as the volatility shock absorber, protecting your emotional peace and principal investment capital."
      };
    }
    if (t.includes("inflation") || t.includes("drag")) {
      return {
        explanation: "An aggressive investor needs compounding growth to achieve long-term targets. Keeping too much money in low-risk government debt or fixed bank deposits creates an 'inflation drag'—meaning your money actually loses purchasing power after factoring in real inflation. Equities, REITs, and equity mutual funds are historical inflation hedges.",
        benefits: "Accelerates compounding. Helps hit aggressive long-term goals like early retirement or wealth creation.",
        risks: "Exposes you to higher paper losses (volatility) in the short-term.",
        role: "The growth engine of your portfolio, designed to build long-term purchasing power."
      };
    }
    if (t.includes("diversification")) {
      return {
        explanation: "Diversification is the only 'free lunch' in investing. By combining assets that are not perfectly correlated (like gold, debt, global equities, and domestic real estate), you can achieve the same or higher target returns while significantly lowering the portfolio's standard deviation (total risk exposure).",
        benefits: "Lowers portfolio swings, improves capital recovery time, and matches different financial goals.",
        risks: "Requires managing multiple transactions or asset listings.",
        role: "Forms the structural skeleton of a secure, long-term wealth portfolio."
      };
    }
    return {
      explanation: "This analysis is part of NIDHI's rule-based suitability model, cross-referencing your onboarding questionnaire with your current holdings list to detect asset imbalances.",
      benefits: "Maintains systematic asset allocation matching your long-term goals.",
      risks: "Requires active rebalancing discipline.",
      role: "Acts as a navigator, highlighting course adjustments needed in your wealth journey."
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">Portfolio Intelligence</h1>
        <p className="text-xs text-zinc-400 mt-1">
          AI-assisted portfolio diagnostics, risk alignment checks, and diversification diagnostics.
        </p>
      </div>

      {holdings.length === 0 ? (
        /* Empty State */
        <div className="bg-zinc-900 border border-zinc-800 border-dashed py-16 px-4 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="max-w-md space-y-1">
            <h3 className="text-sm font-semibold text-zinc-200">No holdings to analyze</h3>
            <p className="text-xs text-zinc-400">
              Please populate your portfolio with holdings first on the Portfolio page to unlock intelligence reports.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Scores & Risk Alignment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Health Score Gauge */}
            <CircularProgress 
              score={loading ? 0 : analytics?.healthScore || 0} 
              label="Portfolio Health Score" 
              strokeColor="#6366f1"
            />

            {/* Diversification Score Gauge */}
            <CircularProgress 
              score={loading ? 0 : analytics?.diversificationScore || 0} 
              label="Diversification Index" 
              strokeColor="#10b981"
            />

            {/* Risk Alignment Card */}
            <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold text-zinc-450 uppercase tracking-wider">Risk Profile Suitability</h3>
                <div className="flex gap-4 mt-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Your Profile</span>
                    <p className="text-sm font-bold text-zinc-200">
                      {user ? (localStorage.getItem(`nidhi_profile_${user.uid}`) ? JSON.parse(localStorage.getItem(`nidhi_profile_${user.uid}`)!).riskAppetite : "Moderate") : "Moderate"}
                    </p>
                  </div>
                  <div className="border-r border-zinc-800 h-8 mt-2" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Current Portfolio</span>
                    <p className="text-sm font-bold text-zinc-200">
                      {loading ? "..." : analytics?.riskRating || "Moderate"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Alert Box */}
              <div className="mt-4">
                {analytics?.riskRating && (user ? (localStorage.getItem(`nidhi_profile_${user.uid}`) ? JSON.parse(localStorage.getItem(`nidhi_profile_${user.uid}`)!).riskAppetite : "Moderate") : "Moderate") === analytics?.riskRating ? (
                  <div className="flex items-center gap-2 p-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg text-emerald-450 text-[10px] font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Your portfolio risk aligns with your target risk appetite.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2.5 bg-amber-500/5 border border-amber-500/15 rounded-lg text-amber-400 text-[10px] font-medium">
                    <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Risk profile mismatch detected. Review details below.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Diagnostics Breakdown Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Asset Allocation Breakdown */}
            <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Asset Class Mix</h3>
              </div>
              <div className="space-y-3">
                {analytics?.assetAllocations.map((a) => (
                  <div key={a.type} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-300 font-medium">{a.type}</span>
                      <span className="text-zinc-500 font-semibold">{formatCurrency(a.value)} ({a.percentage}%)</span>
                    </div>
                    <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${a.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector Exposure Breakdown */}
            <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Sector Exposures</h3>
              </div>
              <div className="space-y-3">
                {analytics?.sectorExposures.map((s) => (
                  <div key={s.sector} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-300 font-medium">{s.sector}</span>
                      <span className="text-zinc-500 font-semibold">{s.percentage}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${s.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Liquidity Diagnostics */}
            <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
                  <Droplet className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Liquidity Diagnostics</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-extrabold text-zinc-100">
                      {loading ? "..." : analytics?.liquidityScore || 0}%
                    </span>
                    <span className="text-xs font-medium text-sky-400">Available Capital</span>
                  </div>
                  
                  <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sky-400 rounded-full transition-all duration-500"
                      style={{ width: `${analytics?.liquidityScore || 0}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-normal">
                  Liquidity measures how fast your assets can be converted to cash without value drops. 
                  Equity, ETFs, and liquid Mutual Funds represent high liquidity, whereas Bonds or REITs represent lower immediate liquidity.
                </p>
              </div>

              <div className="text-[10px] text-zinc-550 border-t border-zinc-850 pt-3 mt-4">
                Target Liquidity Score: &gt; 50% for standard emergency backup.
              </div>
            </div>
          </div>

          {/* Actionable Financial Insights Accordions */}
          <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-xl space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                Actionable Financial Diagnostics & Insights
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Rule-based suitability suggestions computed by the copilot intelligence module.
              </p>
            </div>

            <div className="space-y-3">
              {analytics?.insights.map((insight, idx) => {
                const isExpanded = expandedInsight === idx;
                const edu = getEducationalContext(insight.title);

                return (
                  <div 
                    key={idx}
                    className={`border rounded-xl transition-all ${
                      insight.type === "warning"
                        ? "border-amber-500/15 bg-amber-500/3"
                        : insight.type === "success"
                        ? "border-emerald-500/15 bg-emerald-500/3"
                        : "border-zinc-800/80 bg-zinc-950"
                    }`}
                  >
                    {/* Header bar click trigger */}
                    <div 
                      onClick={() => toggleInsight(idx)}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="mt-0.5">
                          {insight.type === "warning" ? (
                            <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
                          ) : (
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-450" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-zinc-200">{insight.title}</h4>
                          <p className="text-[11px] text-zinc-400 mt-0.5 leading-normal">{insight.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                          insight.impact === "High"
                            ? "bg-rose-500/10 text-rose-400"
                            : insight.impact === "Medium"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-zinc-800 text-zinc-400"
                        }`}>
                          {insight.impact} Impact
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-zinc-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-500" />
                        )}
                      </div>
                    </div>

                    {/* Educational Expandable Panel */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-zinc-850/80 text-[11px] text-zinc-400 space-y-4 animate-fade-in">
                        {/* Explanation */}
                        <div className="space-y-1 bg-zinc-950/45 p-3 border border-zinc-850/50 rounded-lg">
                          <span className="font-semibold text-zinc-200 uppercase tracking-wider text-[9px] text-indigo-400">
                            Plain-Language Explanation
                          </span>
                          <p className="leading-relaxed">{edu.explanation}</p>
                        </div>

                        {/* Suitability guidelines */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="font-bold text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
                              Action Recommendation
                            </h5>
                            <p className="text-zinc-300 leading-normal">{insight.recommendation}</p>
                          </div>
                          <div>
                            <h5 className="font-bold text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
                              Risk Tradeoffs
                            </h5>
                            <p className="leading-normal">{edu.risks}</p>
                          </div>
                          <div>
                            <h5 className="font-bold text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
                              Role in Portfolio
                            </h5>
                            <p className="leading-normal">{edu.role}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
