import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { usePortfolio } from "./PortfolioContext";

export interface SectorExposure {
  sector: string;
  value: number;
  percentage: number;
}

export interface AssetAllocation {
  type: string;
  value: number;
  percentage: number;
}

export interface PortfolioInsight {
  type: "warning" | "success" | "info";
  title: string;
  description: string;
  recommendation: string;
  impact: "High" | "Medium" | "Low";
}

export interface PortfolioAnalytics {
  healthScore: number;
  diversificationScore: number;
  liquidityScore: number;
  riskRating: string;
  sectorExposures: SectorExposure[];
  assetAllocations: AssetAllocation[];
  insights: PortfolioInsight[];
}

interface IntelligenceContextType {
  analytics: PortfolioAnalytics | null;
  loading: boolean;
  refreshAnalytics: () => Promise<void>;
}

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

export const IntelligenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const { holdings } = usePortfolio();
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    if (!user) {
      setAnalytics(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/intelligence/analyze`, {
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
          profile: profile ? {
            fullName: profile.fullName,
            age: profile.age,
            occupation: profile.occupation,
            annualIncome: profile.annualIncome,
            experience: profile.experience,
            goal: profile.goal,
            horizon: profile.horizon,
            capacity: profile.capacity,
            riskAppetite: profile.riskAppetite
          } : null
        })
      });

      if (!response.ok) {
        throw new Error("Backend API error");
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.warn("FastAPI backend analysis failed or unreachable, running frontend calculation fallback:", err);
      // Run local client-side calculation fallback
      runLocalCalculation();
    } finally {
      setLoading(false);
    }
  };

  const runLocalCalculation = () => {
    if (holdings.length === 0) {
      setAnalytics({
        healthScore: 0,
        diversificationScore: 0,
        liquidityScore: 0,
        riskRating: "Low",
        sectorExposures: [],
        assetAllocations: [],
        insights: [
          {
            type: "info",
            title: "Empty Portfolio",
            description: "You haven't added any holdings to analyze yet.",
            recommendation: "Go to the Portfolio page to import assets manually or upload a statement.",
            impact: "High"
          }
        ]
      });
      return;
    }

    const totalValue = holdings.reduce((acc, curr) => acc + (curr.quantity * curr.currentPrice), 0);
    const totalCost = holdings.reduce((acc, curr) => acc + (curr.quantity * curr.avgPrice), 0);

    // 1. Asset Allocations
    const typeValues: Record<string, number> = {};
    holdings.forEach(h => {
      typeValues[h.type] = (typeValues[h.type] || 0) + (h.quantity * h.currentPrice);
    });
    const assetAllocations = Object.entries(typeValues).map(([type, value]) => ({
      type,
      value,
      percentage: Number(((value / totalValue) * 100).toFixed(2))
    })).sort((a, b) => b.value - a.value);

    // 2. Sector Allocation Fallback
    const sectorValues: Record<string, number> = {};
    holdings.forEach(h => {
      const val = h.quantity * h.currentPrice;
      let sec = "Others";
      const name = h.name.toLowerCase();
      if (h.type === "Govt Security" || h.type === "Bond") {
        sec = "Government & Debt";
      } else if (name.includes("tcs") || name.includes("infosys") || name.includes("wipro") || name.includes("tech")) {
        sec = "Technology";
      } else if (name.includes("hdfc") || name.includes("icici") || name.includes("sbi") || name.includes("bank") || name.includes("finance")) {
        sec = "Financial Services";
      } else if (name.includes("reliance") || name.includes("oil") || name.includes("gas") || name.includes("power")) {
        sec = "Energy & Utilities";
      } else if (h.type === "REIT" || h.type === "InvIT") {
        sec = "Real Estate & Infrastructure";
      } else if (name.includes("nifty") || name.includes("etf") || name.includes("bees")) {
        sec = "Diversified Index";
      }
      sectorValues[sec] = (sectorValues[sec] || 0) + val;
    });

    const sectorExposures = Object.entries(sectorValues).map(([sector, value]) => ({
      sector,
      value,
      percentage: Number(((value / totalValue) * 100).toFixed(2))
    })).sort((a, b) => b.value - a.value);

    // 3. Risk Calculation
    const riskWeights: Record<string, number> = {
      "Stock": 90,
      "REIT": 70,
      "InvIT": 70,
      "Mutual Fund": 50,
      "ETF": 50,
      "Bond": 30,
      "Govt Security": 10
    };
    let riskSum = 0;
    holdings.forEach(h => {
      riskSum += (h.quantity * h.currentPrice) * (riskWeights[h.type] || 50);
    });
    const avgRisk = riskSum / totalValue;
    const riskRating = avgRisk < 35 ? "Low" : avgRisk < 65 ? "Moderate" : "High";

    // 4. Liquidity Score
    let liquidSum = 0;
    holdings.forEach(h => {
      const val = h.quantity * h.currentPrice;
      if (["Stock", "Mutual Fund", "ETF"].includes(h.type)) {
        liquidSum += val;
      } else {
        liquidSum += val * 0.5;
      }
    });
    const liquidityScore = Math.round((liquidSum / totalValue) * 100);

    // 5. Diversification Score
    let divScore = 100;
    if (holdings.length === 1) divScore -= 50;
    else if (holdings.length === 2) divScore -= 30;
    else if (holdings.length === 3) divScore -= 15;
    else if (holdings.length < 5) divScore -= 5

    const maxAssetPct = Math.max(...holdings.map(h => (h.quantity * h.currentPrice) / totalValue)) * 100;
    if (maxAssetPct > 60) divScore -= 25;
    else if (maxAssetPct > 45) divScore -= 15;

    const maxSectorPct = Math.max(...sectorExposures.map(s => s.percentage));
    if (maxSectorPct > 60) divScore -= 20;

    divScore = Math.max(10, divScore);

    // 6. Health Score
    let healthScore = 100;
    if (divScore < 50) healthScore -= 15;
    if (maxAssetPct > 40) healthScore -= 15;

    const returnsPct = ((totalValue - totalCost) / totalCost) * 100;
    if (returnsPct < -15) healthScore -= 10;
    else if (returnsPct > 15) healthScore += 5;

    const profileRisk = profile?.riskAppetite || "Moderate";
    if (profileRisk === "Conservative" && riskRating === "High") healthScore -= 15;
    else if (profileRisk === "Aggressive" && riskRating === "Low") healthScore -= 8;

    healthScore = Math.max(10, Math.min(100, healthScore));

    // 7. Actionable Insights
    const insights: PortfolioInsight[] = [];
    if (maxAssetPct > 40) {
      const maxH = holdings.reduce((a, b) => (a.quantity * a.currentPrice > b.quantity * b.currentPrice) ? a : b);
      insights.push({
        type: "warning",
        title: "Asset Concentration Risk",
        description: `'${maxH.name}' represents ${maxAssetPct.toFixed(1)}% of your portfolio.`,
        recommendation: "Trim this position and allocate to other asset types to reduce risk.",
        impact: "High"
      });
    }

    if (profileRisk === "Conservative" && ["Moderate", "High"].includes(riskRating)) {
      insights.push({
        type: "warning",
        title: "Risk Profile Mismatch",
        description: `Your portfolio risk is ${riskRating}, but you declared a Conservative appetite.`,
        recommendation: "Rebalance by adding G-Secs or Corporate Bonds.",
        impact: "High"
      });
    } else if (profileRisk === "Moderate" && riskRating === "High") {
      insights.push({
        type: "warning",
        title: "Risk Profile Mismatch",
        description: "Your portfolio risk is High, but you declared a Moderate appetite.",
        recommendation: "Rebalance slightly by shifting some equity positions into index ETFs, gold, or debt mutual funds.",
        impact: "Medium"
      });
    } else if (profileRisk === "Aggressive" && riskRating === "Low") {
      insights.push({
        type: "info",
        title: "Inflation Drag Alert",
        description: "Your portfolio is concentrated in Low risk assets, whereas your declared risk appetite is Aggressive.",
        recommendation: "Consider adding diversified equity mutual funds or index ETFs to improve long-term growth.",
        impact: "Medium"
      });
    } else {
      insights.push({
        type: "success",
        title: "Risk Aligned",
        description: `Your portfolio risk (${riskRating}) aligns well with your risk profile.`,
        recommendation: "Continue standard allocations.",
        impact: "Low"
      });
    }

    if (divScore < 50) {
      insights.push({
        type: "warning",
        title: "Under-diversification",
        description: "You hold very few assets or asset classes.",
        recommendation: "Diversify across more distinct investments.",
        impact: "Medium"
      });
    }

    setAnalytics({
      healthScore,
      diversificationScore: divScore,
      liquidityScore,
      riskRating,
      sectorExposures,
      assetAllocations,
      insights
    });
  };

  useEffect(() => {
    fetchAnalytics();
  }, [holdings, profile, user]);

  return (
    <IntelligenceContext.Provider 
      value={{ 
        analytics, 
        loading, 
        refreshAnalytics: fetchAnalytics 
      }}
    >
      {children}
    </IntelligenceContext.Provider>
  );
};

export const useIntelligence = () => {
  const context = useContext(IntelligenceContext);
  if (context === undefined) {
    throw new Error("useIntelligence must be used within an IntelligenceProvider");
  }
  return context;
};
