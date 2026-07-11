import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export interface Holding {
  id: string;
  name: string;
  type: "Stock" | "Mutual Fund" | "ETF" | "REIT" | "InvIT" | "Bond" | "Govt Security" | "Gold" | "Crypto" | "FD" | "Real Estate";
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  source: string;
}

interface PortfolioContextType {
  holdings: Holding[];
  loading: boolean;
  addHolding: (holding: Omit<Holding, "id">) => Promise<void>;
  addBulkHoldings: (newHoldings: Omit<Holding, "id">[]) => Promise<void>;
  deleteHolding: (id: string) => Promise<void>;
  clearPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const storedHoldings = localStorage.getItem(`nidhi_holdings_${user.uid}`);
      if (storedHoldings) {
        setHoldings(JSON.parse(storedHoldings));
      } else {
        setHoldings([]);
      }
      setLoading(false);
    } else {
      setHoldings([]);
      setLoading(false);
    }
  }, [user]);

  const saveHoldings = (updatedHoldings: Holding[]) => {
    if (!user) return;
    localStorage.setItem(`nidhi_holdings_${user.uid}`, JSON.stringify(updatedHoldings));
    setHoldings(updatedHoldings);
  };

  const addHolding = async (holdingData: Omit<Holding, "id">) => {
    const newHolding: Holding = {
      ...holdingData,
      id: `holding_${Math.random().toString(36).substr(2, 9)}`
    };
    const updated = [...holdings, newHolding];
    saveHoldings(updated);
  };

  const addBulkHoldings = async (newHoldingsData: Omit<Holding, "id">[]) => {
    const parsed = newHoldingsData.map(h => ({
      ...h,
      id: `holding_${Math.random().toString(36).substr(2, 9)}`
    }));
    const updated = [...holdings, ...parsed];
    saveHoldings(updated);
  };

  const deleteHolding = async (id: string) => {
    const updated = holdings.filter(h => h.id !== id);
    saveHoldings(updated);
  };

  const clearPortfolio = async () => {
    saveHoldings([]);
  };

  return (
    <PortfolioContext.Provider 
      value={{ 
        holdings, 
        loading, 
        addHolding, 
        addBulkHoldings, 
        deleteHolding, 
        clearPortfolio 
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
