import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { useAuth } from "../context/AuthContext";
import {
  TrendingUp,
  Shield,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  ExternalLink,
  Loader2,
  Compass,
  Award,
  CheckCircle
} from "lucide-react";

interface AssetOpportunity {
  name: string;
  type: "Stock" | "Mutual Fund" | "ETF" | "REIT" | "InvIT" | "Bond" | "Govt Security";
  ticker: string;
  expectedReturn: string;
  riskLevel: "Low" | "Moderate" | "High";
  liquidity: "Low" | "Medium" | "High";
  yieldPct: number;
  objective: string;
  description: string;
  price: number; // Simulated trading price
}

interface SuitabilityRecommendation {
  asset: AssetOpportunity;
  suitabilityReason: string;
  targetAllocationPct: number;
  expectedRole: string;
}

const LOCAL_ASSET_OPPORTUNITIES: AssetOpportunity[] = [
  {
    name: "SBI Nifty 50 ETF",
    type: "ETF",
    ticker: "SETFNIF50",
    expectedReturn: "12-15%",
    riskLevel: "Moderate",
    liquidity: "High",
    yieldPct: 1.2,
    objective: "Track and replicate the performance of the Nifty 50 Index.",
    description: "A low-cost way to invest in India's top 50 blue-chip companies across sectors.",
    price: 255.0
  },
  {
    name: "Parag Parikh Flexi Cap Fund",
    type: "Mutual Fund",
    ticker: "PPFLEXICAP",
    expectedReturn: "15-18%",
    riskLevel: "High",
    liquidity: "High",
    yieldPct: 0.5,
    objective: "Capital appreciation by investing in diversified equities globally & locally.",
    description: "An actively managed flexi-cap mutual fund with exposure to Indian blue-chips and international giants like Microsoft and Alphabet.",
    price: 74.5
  },
  {
    name: "Embassy Office Parks REIT",
    type: "REIT",
    ticker: "EMBASSY",
    expectedReturn: "7-9%",
    riskLevel: "Moderate",
    liquidity: "Medium",
    yieldPct: 7.2,
    objective: "Regular rental distribution yield plus long-term commercial real estate growth.",
    description: "Owns and operates premium Grade-A office properties in major tech hubs like Bangalore, Mumbai, Pune, paying regular quarterly distributions.",
    price: 375.0
  },
  {
    name: "PowerGRID Infrastructure InvIT",
    type: "InvIT",
    ticker: "PGINVIT",
    expectedReturn: "9-11%",
    riskLevel: "Moderate",
    liquidity: "Medium",
    yieldPct: 9.8,
    objective: "High cash distribution yield backed by power transmission contracts.",
    description: "Invests in transmission line networks across India, paying out over 90% of net distributable cash flows as quarterly dividends.",
    price: 124.0
  },
  {
    name: "7.18% Govt Security 2033",
    type: "Govt Security",
    ticker: "718GS2033",
    expectedReturn: "7.18%",
    riskLevel: "Low",
    liquidity: "Medium",
    yieldPct: 7.18,
    objective: "100% sovereign safe interest yield with half-yearly payouts.",
    description: "Sovereign debt issued by the Reserve Bank of India, paying a fixed coupon of 7.18% per year until maturity in 2033.",
    price: 1005.0
  },
  {
    name: "L&T Finance AAA Corporate Bond",
    type: "Bond",
    ticker: "LTFINBOND",
    expectedReturn: "8.1-8.3%",
    riskLevel: "Low",
    liquidity: "Low",
    yieldPct: 8.2,
    objective: "Fixed income yield from AAA-rated corporate debt.",
    description: "Senior secured corporate bonds with the highest safety rating (CRISIL AAA), paying monthly/annual coupons.",
    price: 1000.0
  },
  {
    name: "HDFC Liquid Mutual Fund",
    type: "Mutual Fund",
    ticker: "HDFCLIQUID",
    expectedReturn: "6.2-6.5%",
    riskLevel: "Low",
    liquidity: "High",
    yieldPct: 6.3,
    objective: "Capital preservation and high liquidity for short-term emergency funds.",
    description: "Invests in short-term debt instruments like treasury bills and commercial papers, making it very safe and fast to redeem.",
    price: 100.0
  },
  {
    name: "Nippon India Junior BeES ETF",
    type: "ETF",
    ticker: "JUNIORBEES",
    expectedReturn: "13-16%",
    riskLevel: "High",
    liquidity: "High",
    yieldPct: 0.8,
    objective: "Track performance of Nifty Next 50 mid-to-large-cap corporations.",
    description: "Exposes your capital to the next 50 emerging giants in India, which have high growth capacity compared to standard blue-chips.",
    price: 142.5
  }
];

// Pre-screening question types
interface InvestorPrefs {
  goal: string;
  riskAppetite: string;
  budget: number;
}

export const Investments: React.FC = () => {
  const { profile } = useAuth();
  const { holdings, addHolding } = usePortfolio();

  const [activeTab, setActiveTab] = useState<"recommended" | "explore" | "trending">("recommended");
  const [exploreCategory, setExploreCategory] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SuitabilityRecommendation[]>([]);
  const [explanation, setExplanation] = useState<string>("");

  // Pre-screening quiz state
  const [quizDone, setQuizDone] = useState(false);
  const [quizPrefs, setQuizPrefs] = useState<InvestorPrefs>({
    goal: profile?.goal || "",
    riskAppetite: profile?.riskAppetite || "",
    budget: profile?.capacity || 10000
  });

  // Drawer / Overlay Detail states
  const [selectedAsset, setSelectedAsset] = useState<AssetOpportunity | null>(null);
  
  // Checkout Simulated modal states
  const [checkoutAsset, setCheckoutAsset] = useState<AssetOpportunity | null>(null);
  const [investmentAmt, setInvestmentAmt] = useState<number>(10000);
  const [checkoutStep, setCheckoutStep] = useState<"input" | "processing" | "success">("input");
  const [partnerPlatform, setPartnerPlatform] = useState<"Zerodha" | "Groww">("Zerodha");
  const [transactingUnits, setTransactingUnits] = useState<number>(0);

  const fetchRecommendations = async (prefs?: InvestorPrefs) => {
    const activePrefs = prefs || quizPrefs;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/suitability/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          holdings: holdings.map(h => ({
            name: h.name,
            type: h.type,
            quantity: h.quantity,
            avgPrice: h.avgPrice,
            currentPrice: h.currentPrice,
            source: h.source
          })),
          profile: {
            fullName: profile?.fullName || "Investor",
            age: profile?.age || 30,
            occupation: profile?.occupation || "Professional",
            annualIncome: profile?.annualIncome || "10-20 LPA",
            experience: profile?.experience || "Intermediate",
            goal: activePrefs.goal,
            horizon: profile?.horizon || "Medium Term (3-7 years)",
            capacity: activePrefs.budget,
            riskAppetite: activePrefs.riskAppetite
          }
        })
      });

      if (!response.ok) {
        throw new Error("Suitability API error");
      }

      const data = await response.json();
      // Map frontend pricing info onto returned schema
      const mapped = data.recommendations.map((rec: any) => {
        const found = LOCAL_ASSET_OPPORTUNITIES.find(o => o.name === rec.asset.name);
        return {
          ...rec,
          asset: {
            ...rec.asset,
            price: found ? found.price : 100.0
          }
        };
      });
      setRecommendations(mapped);
      setExplanation(data.explanation);
    } catch (e) {
      console.warn("FastAPI suitability endpoint unreachable, calling local algorithm fallback:", e);
      runLocalSuitability();
    } finally {
      setLoading(false);
    }
  };

  const runLocalSuitability = (prefs?: InvestorPrefs) => {
    const activePrefs = prefs || quizPrefs;
    const p_goal = activePrefs.goal || profile?.goal || "Wealth Creation";
    const p_risk = activePrefs.riskAppetite || profile?.riskAppetite || "Moderate";
    const p_horizon = profile?.horizon || "Medium Term (3-7 years)";

    const has_reit = holdings.some(h => h.type === "REIT");
    const has_etf = holdings.some(h => h.type === "ETF");

    const recs: SuitabilityRecommendation[] = [];
    const op_map = LOCAL_ASSET_OPPORTUNITIES.reduce((acc, curr) => {
      acc[curr.name] = curr;
      return acc;
    }, {} as Record<string, AssetOpportunity>);

    // Passive Income
    if (p_goal === "Passive Income") {
      recs.push({
        asset: op_map["PowerGRID Infrastructure InvIT"],
        suitabilityReason: "Offers an attractive distribution yield of ~9.8% backed by secure power transmission networks, matching your goal for steady cash flow.",
        targetAllocationPct: 15.0,
        expectedRole: "Core passive dividend generator"
      });
      recs.push({
        asset: op_map["Embassy Office Parks REIT"],
        suitabilityReason: "Provides defensive commercial office rental payouts with growth potential, diversifying your regular cash yield.",
        targetAllocationPct: 10.0,
        expectedRole: "Commercial rental income stabilizer"
      });
    }
    // Wealth compounding
    else if (p_goal === "Wealth Creation" || p_goal === "Retirement") {
      recs.push({
        asset: op_map["Parag Parikh Flexi Cap Fund"],
        suitabilityReason: "Exposes your capital to high-growth Indian blue chips and international technology leaders, matching your long-term compounding wealth objectives.",
        targetAllocationPct: 25.0,
        expectedRole: "Core equity compounding engine"
      });
      if (!has_etf) {
        recs.push({
          asset: op_map["SBI Nifty 50 ETF"],
          suitabilityReason: "Introduces broad market indexing with minimal management fees, laying a stable diversified equity floor for your portfolio.",
          targetAllocationPct: 20.0,
          expectedRole: "Broad index foundation layer"
        });
      }
    }
    // Emergency
    else if (p_goal === "Emergency Fund") {
      recs.push({
        asset: op_map["HDFC Liquid Mutual Fund"],
        suitabilityReason: "Invests in overnight sovereign bills ensuring capital preservation and quick liquid redemption, backing your emergency safety nets.",
        targetAllocationPct: 40.0,
        expectedRole: "Liquid safety cushion"
      });
    }

    // Risk based additions
    if (p_risk === "Conservative") {
      recs.push({
        asset: op_map["7.18% Govt Security 2033"],
        suitabilityReason: "Adds 100% risk-free sovereign debt yielding 7.18% annually, shielding your wealth from equity swings while matching conservative growth needs.",
        targetAllocationPct: 30.0,
        expectedRole: "Risk-free sovereign wealth protector"
      });
      recs.push({
        asset: op_map["L&T Finance AAA Corporate Bond"],
        suitabilityReason: "Delivers highly secured fixed annual interest coupons of 8.2% to lock in attractive stable yields.",
        targetAllocationPct: 20.0,
        expectedRole: "High-grade corporate debt yield"
      });
    } else if (p_risk === "Aggressive") {
      recs.push({
        asset: op_map["Nippon India Junior BeES ETF"],
        suitabilityReason: "Tracks mid-cap giants with high volatility and strong upside potential, matching your tolerance for large paper swings in search of index-beating returns.",
        targetAllocationPct: 15.0,
        expectedRole: "High-beta mid-cap growth booster"
      });
      // Increase growth target
      recs.forEach(r => {
        if (r.asset.name === "Parag Parikh Flexi Cap Fund") {
          r.targetAllocationPct = 35.0;
        }
      });
    }

    // Diversification checks
    if (!has_reit && p_goal !== "Emergency Fund" && !recs.some(r => r.asset.name === "Embassy Office Parks REIT")) {
      recs.push({
        asset: op_map["Embassy Office Parks REIT"],
        suitabilityReason: "Your current portfolio lacks Real Estate exposure. Adding a Grade-A commercial REIT adds inflation-hedged rental yield and reduces overall equity market correlation.",
        targetAllocationPct: 8.0,
        expectedRole: "Real estate sector diversifier"
      });
    }

    // Dedup
    const unique: SuitabilityRecommendation[] = [];
    const seen = new Set();
    recs.forEach(r => {
      if (!seen.has(r.asset.name)) {
        seen.add(r.asset.name);
        unique.push(r);
      }
    });

    if (unique.length === 0) {
      unique.push({
        asset: op_map["SBI Nifty 50 ETF"],
        suitabilityReason: "Provides a basic low-cost Nifty index exposure to set up your investment path.",
        targetAllocationPct: 30.0,
        expectedRole: "Broad equity core index standard"
      });
    }

    const assetTypes = Array.from(new Set(unique.map(u => u.asset.type)));
    setRecommendations(unique);
    setExplanation(
      `Based on your profile (Declared Goal: ${p_goal}, Risk Appetite: ${p_risk}, and Horizon: ${p_horizon}), ` +
      `NIDHI suggests a target allocation structured across ${assetTypes.join(", ")}. This configuration manages market drawdowns while meeting compounding goals.`
    );
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizDone(true);
    fetchRecommendations(quizPrefs);
  };

  useEffect(() => {
    // Don't auto-fetch — wait for user to complete the quiz
    if (activeTab !== "recommended") return;
    if (quizDone) fetchRecommendations(quizPrefs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Handle simulated trade
  const handleOpenCheckout = (asset: AssetOpportunity) => {
    setCheckoutAsset(asset);
    setInvestmentAmt(profile?.capacity ? Math.max(5000, profile.capacity) : 10000);
    setCheckoutStep("input");
  };

  const handleConfirmCheckout = () => {
    if (!checkoutAsset) return;
    setCheckoutStep("processing");

    // Calculate units
    const units = parseFloat((investmentAmt / checkoutAsset.price).toFixed(2));
    setTransactingUnits(units);

    setTimeout(async () => {
      try {
        await addHolding({
          name: checkoutAsset.name,
          type: checkoutAsset.type,
          quantity: units,
          avgPrice: checkoutAsset.price,
          currentPrice: checkoutAsset.price,
          source: `Manual Buy (${partnerPlatform})`
        });
        setCheckoutStep("success");
      } catch (err) {
        console.error("Failed to append simulated transaction", err);
        setCheckoutStep("input");
      }
    }, 2000);
  };

  const categories = ["All", "REIT", "InvIT", "ETF", "Mutual Fund", "Bond", "Govt Security"];

  const filteredExploreAssets = LOCAL_ASSET_OPPORTUNITIES.filter(
    asset => exploreCategory === "All" || asset.type === exploreCategory
  );

  const trendingAssets = LOCAL_ASSET_OPPORTUNITIES.filter(
    asset => asset.name === "PowerGRID Infrastructure InvIT" || 
             asset.name === "Parag Parikh Flexi Cap Fund" || 
             asset.name === "L&T Finance AAA Corporate Bond"
  );

  const getRiskColor = (level: string) => {
    if (level === "Low") return "bg-emerald-950/50 text-emerald-400 border-emerald-800/40";
    if (level === "Moderate") return "bg-amber-950/50 text-amber-400 border-amber-800/40";
    return "bg-rose-950/50 text-rose-400 border-rose-800/40";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              Smart Investment Hub
              <Compass className="w-5 h-5 text-indigo-500 animate-pulse" />
            </h1>
            <p className="text-zinc-400 text-xs mt-1">
              Explore diverse high-grade assets and view personalized suitability suggestions tailored by NIDHI.
            </p>
          </div>
          {profile && (
            <div className="flex items-center gap-2.5 bg-zinc-950/60 border border-zinc-800 rounded-lg p-2.5 text-[10px]">
              <div>
                <span className="text-zinc-500 uppercase font-semibold">Goal:</span>
                <p className="text-indigo-400 font-bold">{profile.goal}</p>
              </div>
              <div className="h-6 w-px bg-zinc-800" />
              <div>
                <span className="text-zinc-500 uppercase font-semibold">Risk Appetite:</span>
                <p className="text-amber-400 font-bold">{profile.riskAppetite}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-850 gap-2">
        <button
          onClick={() => setActiveTab("recommended")}
          className={`pb-3 text-xs font-semibold px-4 cursor-pointer relative -mb-px transition-colors ${
            activeTab === "recommended" ? "text-indigo-500 font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Recommended Allocation
          </div>
          {activeTab === "recommended" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab("explore")}
          className={`pb-3 text-xs font-semibold px-4 cursor-pointer relative -mb-px transition-colors ${
            activeTab === "explore" ? "text-indigo-500 font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Explore All Assets
          </div>
          {activeTab === "explore" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab("trending")}
          className={`pb-3 text-xs font-semibold px-4 cursor-pointer relative -mb-px transition-colors ${
            activeTab === "trending" ? "text-indigo-500 font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            High-Yield Trending
          </div>
          {activeTab === "trending" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
        </button>
      </div>

      {/* Recommended Tab Panel */}
      {activeTab === "recommended" && (
        <div className="space-y-6">
          {/* ── Pre-screening quiz ── */}
          {!quizDone ? (
            <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden animate-fade-in">
              {/* Quiz header */}
              <div className="bg-gradient-to-r from-indigo-950/30 to-zinc-900 border-b border-indigo-900/30 px-6 py-5 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-900/40 border border-indigo-700/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Tell NIDHI about your investment intent</h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                    Answer 3 quick questions so NIDHI can generate a personalized asset allocation tailored to your current situation.
                  </p>
                </div>
              </div>

              {/* Quiz form */}
              <form onSubmit={handleQuizSubmit} className="p-6 space-y-6">
                {/* Q1: Investment Goal */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    1. What is your primary investment goal right now?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["Wealth Creation", "Passive Income", "Retirement", "Emergency Fund", "Tax Saving", "Child Education"].map(g => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setQuizPrefs(p => ({ ...p, goal: g }))}
                        className={`py-2.5 px-3 rounded-lg border text-[10px] font-semibold cursor-pointer transition-all text-left ${
                          quizPrefs.goal === g
                            ? "bg-indigo-950/60 border-indigo-700/60 text-indigo-300"
                            : "bg-zinc-950/60 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2: Risk Appetite */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    2. How comfortable are you with investment risk?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Conservative", desc: "Safety first, lower returns", color: "emerald" },
                      { label: "Moderate", desc: "Balanced risk & reward", color: "amber" },
                      { label: "Aggressive", desc: "High risk, high potential", color: "rose" }
                    ].map(({ label, desc, color }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setQuizPrefs(p => ({ ...p, riskAppetite: label }))}
                        className={`py-3 px-3 rounded-lg border cursor-pointer transition-all text-left ${
                          quizPrefs.riskAppetite === label
                            ? color === "emerald" ? "bg-emerald-950/40 border-emerald-700/50 text-emerald-300"
                              : color === "amber" ? "bg-amber-950/40 border-amber-700/50 text-amber-300"
                              : "bg-rose-950/40 border-rose-700/50 text-rose-300"
                            : "bg-zinc-950/60 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-[10px] font-bold block">{label}</span>
                        <span className="text-[9px] opacity-70 block mt-0.5">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q3: Investment Budget */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    3. How much are you looking to invest? (₹)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">₹</span>
                      <input
                        type="number"
                        min={500}
                        step={500}
                        value={quizPrefs.budget}
                        onChange={e => setQuizPrefs(p => ({ ...p, budget: Number(e.target.value) }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-8 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                      />
                    </div>
                    <div className="flex gap-1.5">
                      {[5000, 25000, 100000, 500000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setQuizPrefs(p => ({ ...p, budget: amt }))}
                          className={`py-1.5 px-2.5 rounded-lg border text-[9px] font-bold cursor-pointer transition-colors ${
                            quizPrefs.budget === amt
                              ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                              : "bg-zinc-950/60 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {amt >= 100000 ? `₹${amt / 100000}L` : `₹${(amt / 1000).toFixed(0)}K`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!quizPrefs.goal || !quizPrefs.riskAppetite}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate My Investment Plan
                </button>
              </form>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-zinc-400 text-xs mt-3">Synthesizing personalized suitability recommendation...</p>
            </div>
          ) : (
            <>
              {/* Quiz summary + edit */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-5 py-3">
                <div className="flex flex-wrap gap-3 text-[10px]">
                  <span className="text-zinc-500">Goal: <strong className="text-indigo-400">{quizPrefs.goal}</strong></span>
                  <span className="text-zinc-500">Risk: <strong className="text-amber-400">{quizPrefs.riskAppetite}</strong></span>
                  <span className="text-zinc-500">Budget: <strong className="text-zinc-200">₹{quizPrefs.budget.toLocaleString("en-IN")}</strong></span>
                </div>
                <button
                  onClick={() => { setQuizDone(false); setRecommendations([]); }}
                  className="text-[10px] font-semibold text-zinc-500 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Edit Preferences
                </button>
              </div>

              {/* Explanation Summary card */}
              <div className="bg-gradient-to-r from-indigo-950/20 to-zinc-900 border border-indigo-900/40 rounded-xl p-5 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-indigo-900/30 border border-indigo-700/30 flex items-center justify-center text-indigo-400 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wide">AI Recommendation Rationale</h3>
                  <p className="text-zinc-200 text-xs leading-relaxed mt-1.5">{explanation}</p>
                </div>
              </div>

              {/* Grid lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map(rec => (
                  <div key={rec.asset.name} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50 uppercase">
                              {rec.asset.type}
                            </span>
                            <span className="text-[10px] font-semibold text-zinc-500">
                              {rec.asset.ticker}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-zinc-100 mt-1.5">{rec.asset.name}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-semibold">Suggested Target</span>
                          <span className="text-indigo-400 font-extrabold text-lg">{rec.targetAllocationPct}%</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className={`px-2 py-0.5 rounded border ${getRiskColor(rec.asset.riskLevel)}`}>
                          Risk: {rec.asset.riskLevel}
                        </span>
                        <span className="px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">
                          Yield: {rec.asset.yieldPct}%
                        </span>
                        <span className="px-2 py-0.5 rounded border border-zinc-800 text-indigo-300">
                          Role: {rec.expectedRole}
                        </span>
                      </div>

                      <p className="text-zinc-300 text-xs leading-relaxed">
                        {rec.suitabilityReason}
                      </p>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        onClick={() => setSelectedAsset(rec.asset)}
                        className="flex-1 py-2 px-3 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleOpenCheckout(rec.asset)}
                        className="flex-1 py-2 px-3 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1"
                      >
                        Invest Now
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Explore Tab Panel */}
      {activeTab === "explore" && (
        <div className="space-y-6 animate-fade-in">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setExploreCategory(cat)}
                className={`py-1.5 px-3 rounded-full border text-[10px] font-semibold transition-all cursor-pointer ${
                  exploreCategory === cat
                    ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                    : "bg-zinc-950/60 border-zinc-900 text-zinc-500 hover:text-zinc-350 hover:border-zinc-850"
                }`}
              >
                {cat === "All" ? "All Categories" : cat + "s"}
              </button>
            ))}
          </div>

          {/* Grid lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExploreAssets.map(asset => (
              <div key={asset.name} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50 uppercase">
                          {asset.type}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-500">
                          {asset.ticker}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-100 mt-1.5">{asset.name}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block font-semibold">Exp. Return</span>
                      <span className="text-zinc-200 font-bold text-sm">{asset.expectedReturn}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className={`px-2 py-0.5 rounded border ${getRiskColor(asset.riskLevel)}`}>
                      Risk: {asset.riskLevel}
                    </span>
                    <span className="px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">
                      Liquidity: {asset.liquidity}
                    </span>
                    {asset.yieldPct > 0 && (
                      <span className="px-2 py-0.5 rounded border border-zinc-800 text-emerald-400 font-medium">
                        Dividend Yield: {asset.yieldPct}%
                      </span>
                    )}
                  </div>

                  <p className="text-zinc-405 text-xs line-clamp-2">
                    {asset.description}
                  </p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setSelectedAsset(asset)}
                    className="flex-1 py-2 px-3 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleOpenCheckout(asset)}
                    className="flex-1 py-2 px-3 bg-zinc-850 hover:bg-zinc-80 hover:text-zinc-100 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1"
                  >
                    Invest Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Tab Panel */}
      {activeTab === "trending" && (
        <div className="space-y-5 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-500" />
            <p className="text-zinc-300 text-xs">
              Trending list curated based on highest current distribution yields and overall client transaction volume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingAssets.map(asset => (
              <div key={asset.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4">
                <div className="absolute top-0 right-0 bg-indigo-500/10 border-l border-b border-indigo-500/20 text-indigo-400 text-[8px] font-bold tracking-wider px-2.5 py-1 uppercase rounded-bl">
                  Hot Yield
                </div>

                <div className="space-y-3.5">
                  <div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-950 text-indigo-400 border border-indigo-900/30 uppercase">
                      {asset.type}
                    </span>
                    <h4 className="text-sm font-bold text-zinc-100 mt-2">{asset.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-850 text-center">
                    <div>
                      <span className="text-[8px] text-zinc-500 font-semibold uppercase block">Yield</span>
                      <span className="text-xs font-bold text-emerald-400">{asset.yieldPct}%</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-500 font-semibold uppercase block">Returns</span>
                      <span className="text-xs font-bold text-zinc-200">{asset.expectedReturn}</span>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                    {asset.description}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setSelectedAsset(asset)}
                    className="flex-1 py-1.5 px-3 border border-zinc-850 hover:border-zinc-750 text-[11px] font-semibold text-zinc-400 hover:text-zinc-250 transition-colors rounded-lg cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleOpenCheckout(asset)}
                    className="flex-1 py-1.5 px-3 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-[11px] font-semibold cursor-pointer flex items-center justify-center gap-1"
                  >
                    Invest Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sliding Asset Detail Overlay panel */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full p-6 flex flex-col justify-between shadow-2xl relative">
            <button
              onClick={() => setSelectedAsset(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-350 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6 overflow-y-auto pr-1">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50 uppercase">
                  {selectedAsset.type}
                </span>
                <h3 className="text-xl font-bold text-zinc-100 mt-2">{selectedAsset.name}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Ticker: {selectedAsset.ticker}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Expected Return</span>
                  <span className="text-sm font-bold text-zinc-100">{selectedAsset.expectedReturn}</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Risk Profile</span>
                  <span className={`text-sm font-bold ${
                    selectedAsset.riskLevel === "Low" ? "text-emerald-400" : 
                    selectedAsset.riskLevel === "Moderate" ? "text-amber-400" : "text-rose-400"
                  }`}>{selectedAsset.riskLevel}</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Trading Price (Sim)</span>
                  <span className="text-sm font-bold text-zinc-100">₹{selectedAsset.price}</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850">
                  <span className="text-[9px] text-zinc-500 uppercase font-semibold block">Liquidity</span>
                  <span className="text-sm font-bold text-zinc-100">{selectedAsset.liquidity}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Investment Objective</h4>
                <p className="text-zinc-300 text-xs leading-relaxed">{selectedAsset.objective}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Asset Overview</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">{selectedAsset.description}</p>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl flex gap-3 items-start">
                <Shield className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">NIDHI Allocation Role</h5>
                  <p className="text-zinc-400 text-[11px] leading-relaxed mt-1">
                    Adds safety layers by utilizing {selectedAsset.riskLevel.toLowerCase()}-risk targets matching your horizon limit.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-850 flex gap-3">
              <button
                onClick={() => setSelectedAsset(null)}
                className="flex-1 py-2.5 px-4 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Details
              </button>
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  handleOpenCheckout(selectedAsset);
                }}
                className="flex-1 py-2.5 px-4 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              >
                Invest Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mock Partner checkout Modal */}
      {checkoutAsset && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-6 rounded-xl shadow-2xl space-y-5 relative">
            
            {checkoutStep !== "success" && (
              <button
                onClick={() => setCheckoutAsset(null)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-350 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {checkoutStep === "input" && (
              <>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">Simulated Execution Gateway</span>
                  <h3 className="text-base font-bold text-zinc-100">Invest in {checkoutAsset.name}</h3>
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-850 space-y-2">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Select Partner Platform</label>
                  <div className="flex gap-2">
                    {["Zerodha", "Groww"].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPartnerPlatform(p as any)}
                        className={`flex-1 py-2 border rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          partnerPlatform === p
                            ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                            : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-400"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
                      Investment Amount (₹)
                    </label>
                    <input
                      type="number"
                      min={500}
                      step={500}
                      value={investmentAmt}
                      onChange={(e) => setInvestmentAmt(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-3.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850 space-y-1.5 text-xs text-zinc-400">
                    <div className="flex justify-between">
                      <span>Per Unit Cost</span>
                      <span className="text-zinc-200">₹{checkoutAsset.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Units</span>
                      <span className="text-zinc-250 font-semibold">
                        {(investmentAmt / checkoutAsset.price).toFixed(2)} units
                      </span>
                    </div>
                    <div className="h-px bg-zinc-850 my-1" />
                    <div className="flex justify-between text-zinc-200 font-bold">
                      <span>Total Cost</span>
                      <span>₹{investmentAmt.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmCheckout}
                  className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  Swipe to Invest with {partnerPlatform}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {checkoutStep === "processing" && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <div className="text-center">
                  <h4 className="text-xs font-bold text-zinc-200">Processing Trade Request</h4>
                  <p className="text-[10px] text-zinc-500 mt-1">Connecting to {partnerPlatform} servers securely...</p>
                </div>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="flex flex-col items-center justify-center py-8 space-y-5 text-center">
                <div className="w-12 h-12 bg-emerald-950 border border-emerald-800 rounded-full flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-zinc-100">Simulated Investment Successful!</h4>
                  <p className="text-zinc-400 text-xs px-2 leading-relaxed">
                    Purchased <strong>{transactingUnits} units</strong> of <strong>{checkoutAsset.name}</strong>.
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Your portfolio holdings list has been automatically updated in NIDHI.
                  </p>
                </div>

                <button
                  onClick={() => setCheckoutAsset(null)}
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Dismiss & Return to Hub
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
