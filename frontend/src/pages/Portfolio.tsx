import React, { useState, useRef } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import type { Holding } from "../context/PortfolioContext";
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Briefcase
} from "lucide-react";

export const Portfolio: React.FC = () => {
  const { holdings, addHolding, addBulkHoldings, deleteHolding } = usePortfolio();
  const [activeTab, setActiveTab] = useState<"holdings" | "add">("holdings");
  const [importMethod, setImportMethod] = useState<"manual" | "csv">("manual");
  
  // Manual Entry Form State
  const [manualForm, setManualForm] = useState<Omit<Holding, "id">>({
    name: "",
    type: "Stock",
    quantity: 1,
    avgPrice: 100,
    currentPrice: 100,
    source: "Manual"
  });

  // CSV State
  const [csvError, setCsvError] = useState("");
  const [csvSuccess, setCsvSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats Calculations
  const totalCost = holdings.reduce((acc, curr) => acc + (curr.quantity * curr.avgPrice), 0);
  const currentValue = holdings.reduce((acc, curr) => acc + (curr.quantity * curr.currentPrice), 0);
  const totalReturns = currentValue - totalCost;
  const returnPercentage = totalCost > 0 ? (totalReturns / totalCost) * 100 : 0;

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setManualForm(prev => ({
      ...prev,
      [name]: name === "quantity" || name === "avgPrice" || name === "currentPrice" ? Number(value) : value
    }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name.trim()) return;

    try {
      await addHolding(manualForm);
      setManualForm({
        name: "",
        type: "Stock",
        quantity: 1,
        avgPrice: 100,
        currentPrice: 100,
        source: "Manual"
      });
      setActiveTab("holdings");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvError("");
    setCsvSuccess("");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setCsvError("Failed to read CSV file content.");
          return;
        }

        const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length < 2) {
          setCsvError("CSV file must contain a header row and at least one data row.");
          return;
        }

        // Validate Header
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const requiredHeaders = ["name", "type", "quantity", "avgprice", "currentprice", "source"];
        
        const isHeaderValid = requiredHeaders.every(req => headers.includes(req));
        if (!isHeaderValid) {
          setCsvError(`CSV headers must match: Name, Type, Quantity, AvgPrice, CurrentPrice, Source`);
          return;
        }

        const nameIdx = headers.indexOf("name");
        const typeIdx = headers.indexOf("type");
        const qtyIdx = headers.indexOf("quantity");
        const avgIdx = headers.indexOf("avgprice");
        const currIdx = headers.indexOf("currentprice");
        const srcIdx = headers.indexOf("source");

        const parsedHoldings: Omit<Holding, "id">[] = [];
        const validTypes = ["Stock", "Mutual Fund", "ETF", "REIT", "InvIT", "Bond", "Govt Security"];

        for (let i = 1; i < lines.length; i++) {
          const columns = lines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
          
          if (columns.length < requiredHeaders.length) {
            continue; // Skip malformed rows
          }

          const name = columns[nameIdx];
          const type = columns[typeIdx];
          const quantity = Number(columns[qtyIdx]);
          const avgPrice = Number(columns[avgIdx]);
          const currentPrice = Number(columns[currIdx]);
          const source = columns[srcIdx];

          if (!name || isNaN(quantity) || isNaN(avgPrice) || isNaN(currentPrice) || !source) {
            setCsvError(`Row ${i + 1} contains malformed or empty data values.`);
            return;
          }

          // Strict type normalization
          const matchedType = validTypes.find(t => t.toLowerCase() === type.toLowerCase());
          if (!matchedType) {
            setCsvError(`Row ${i + 1} has invalid asset type: "${type}". Allowed: ${validTypes.join(", ")}`);
            return;
          }

          parsedHoldings.push({
            name,
            type: matchedType as any,
            quantity,
            avgPrice,
            currentPrice,
            source
          });
        }

        if (parsedHoldings.length === 0) {
          setCsvError("No valid rows were parsed from the CSV file.");
          return;
        }

        await addBulkHoldings(parsedHoldings);
        setCsvSuccess(`Successfully imported ${parsedHoldings.length} assets!`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => {
          setActiveTab("holdings");
          setCsvSuccess("");
        }, 1500);
      } catch (err: any) {
        setCsvError(`Error parsing CSV: ${err.message}`);
      }
    };

    reader.readAsText(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics Summary */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">Unified Portfolio</h1>
          <p className="text-xs text-zinc-400 mt-1">Aggregated wealth distribution and holdings overview.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("holdings")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              activeTab === "holdings"
                ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                : "bg-zinc-950/60 border-zinc-900 text-zinc-450 hover:text-zinc-200"
            }`}
          >
            Holdings List
          </button>
          <button
            onClick={() => {
              setActiveTab("add");
              setImportMethod("manual");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              activeTab === "add"
                ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                : "bg-zinc-950/60 border-zinc-900 text-zinc-450 hover:text-zinc-200"
            }`}
          >
            Import Assets
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-550">Current Value</span>
          <span className="text-xl font-bold text-zinc-100 mt-1.5">
            ₹{currentValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-550">Total Investment Cost</span>
          <span className="text-xl font-bold text-zinc-300 mt-1.5">
            ₹{totalCost.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-550">Overall Returns</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className={`text-xl font-bold ${totalReturns >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {totalReturns >= 0 ? "+" : ""}
              ₹{totalReturns.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${totalReturns >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {totalReturns >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {totalReturns >= 0 ? "+" : ""}
              {returnPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Body View */}
      {activeTab === "holdings" ? (
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden">
          {holdings.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Briefcase className="w-10 h-10 text-zinc-700 mb-3" />
              <h3 className="text-sm font-semibold text-zinc-300">No assets imported</h3>
              <p className="text-xs text-zinc-550 mt-1 max-w-sm">Consolidate your investments by importing your portfolios from manual entries or CSV reports.</p>
              <button
                onClick={() => {
                  setActiveTab("add");
                  setImportMethod("manual");
                }}
                className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-zinc-950" />
                Add Asset
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/85 text-[10px] font-semibold uppercase tracking-wider text-zinc-550">
                    <th className="px-6 py-4">Asset Name</th>
                    <th className="px-6 py-4">Asset Type</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Avg Price</th>
                    <th className="px-6 py-4">Current Price</th>
                    <th className="px-6 py-4">Current Value</th>
                    <th className="px-6 py-4">P&L</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {holdings.map((h) => {
                    const cost = h.quantity * h.avgPrice;
                    const value = h.quantity * h.currentPrice;
                    const returns = value - cost;
                    const pct = cost > 0 ? (returns / cost) * 100 : 0;
                    return (
                      <tr key={h.id} className="hover:bg-zinc-800/20">
                        <td className="px-6 py-3.5 font-semibold text-zinc-100">{h.name}</td>
                        <td className="px-6 py-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700/50">
                            {h.type}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">{h.quantity}</td>
                        <td className="px-6 py-3.5">₹{h.avgPrice.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-3.5">₹{h.currentPrice.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-3.5 font-medium text-zinc-200">
                          ₹{value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex flex-col">
                            <span className={`font-semibold ${returns >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {returns >= 0 ? "+" : ""}
                              ₹{returns.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className={`text-[10px] mt-0.5 ${pct >= 0 ? "text-emerald-550" : "text-red-450"}`}>
                              {pct >= 0 ? "+" : ""}
                              {pct.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-zinc-450 font-medium">{h.source}</td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => deleteHolding(h.id)}
                            className="p-1 text-zinc-550 hover:text-red-400 rounded transition-colors cursor-pointer hover:bg-red-500/5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden">
          {/* Tabs for Import Style */}
          <div className="flex border-b border-zinc-800/85 bg-zinc-950/20">
            <button
              onClick={() => setImportMethod("manual")}
              className={`px-6 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                importMethod === "manual"
                  ? "border-indigo-500 text-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-350"
              }`}
            >
              Manual Asset Entry
            </button>
            <button
              onClick={() => setImportMethod("csv")}
              className={`px-6 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                importMethod === "csv"
                  ? "border-indigo-500 text-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-350"
              }`}
            >
              Upload CSV Statement
            </button>
          </div>

          <div className="p-6">
            {importMethod === "manual" ? (
              <form onSubmit={handleManualSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={manualForm.name}
                    onChange={handleManualChange}
                    placeholder="e.g. Reliance Industries, Parag Parikh Flexi Cap"
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                      Asset Type
                    </label>
                    <select
                      name="type"
                      value={manualForm.type}
                      onChange={handleManualChange}
                      className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                    >
                      <option value="Stock">Stock</option>
                      <option value="Mutual Fund">Mutual Fund</option>
                      <option value="ETF">ETF</option>
                      <option value="REIT">REIT</option>
                      <option value="InvIT">InvIT</option>
                      <option value="Bond">Bond</option>
                      <option value="Govt Security">Govt Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                      Portfolio Source
                    </label>
                    <select
                      name="source"
                      value={manualForm.source}
                      onChange={handleManualChange}
                      className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Zerodha">Zerodha</option>
                      <option value="Groww">Groww</option>
                      <option value="Upstox">Upstox</option>
                      <option value="Angel One">Angel One</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      required
                      min={0.0001}
                      step="any"
                      value={manualForm.quantity}
                      onChange={handleManualChange}
                      className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                      Average Cost Price (₹)
                    </label>
                    <input
                      type="number"
                      name="avgPrice"
                      required
                      min={0.01}
                      step="any"
                      value={manualForm.avgPrice}
                      onChange={handleManualChange}
                      className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                      Current Price (₹)
                    </label>
                    <input
                      type="number"
                      name="currentPrice"
                      required
                      min={0.01}
                      step="any"
                      value={manualForm.currentPrice}
                      onChange={handleManualChange}
                      className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-zinc-950" />
                    Add holding to Portfolio
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Drag and Drop Box */}
                <div 
                  onClick={triggerFileSelect}
                  className="max-w-xl border border-dashed border-zinc-800 hover:border-zinc-750 bg-zinc-950/20 p-8 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-900/10 transition-colors"
                >
                  <FileSpreadsheet className="w-10 h-10 text-zinc-600 mb-3" />
                  <p className="text-xs font-semibold text-zinc-300">Click to upload statement file</p>
                  <p className="text-[10px] text-zinc-550 mt-1">Supports standard comma-separated values (.csv) format.</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCSVUpload}
                    accept=".csv"
                    className="hidden"
                  />
                </div>

                {csvError && (
                  <div className="max-w-xl p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs text-red-400 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{csvError}</span>
                  </div>
                )}

                {csvSuccess && (
                  <div className="max-w-xl p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-xs text-emerald-400 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{csvSuccess}</span>
                  </div>
                )}

                {/* Import template explanation */}
                <div className="max-w-xl bg-zinc-950/40 p-5 rounded-lg border border-zinc-800/80 text-xs leading-relaxed text-zinc-400 space-y-3">
                  <h4 className="font-semibold text-zinc-300">CSV Template Guidelines</h4>
                  <p className="text-[11px] text-zinc-400">Please format your spreadsheet file columns as follows:</p>
                  <pre className="p-3 bg-zinc-950 border border-zinc-850 rounded text-[10px] font-mono text-zinc-300 block overflow-x-auto">
                    Name,Type,Quantity,AvgPrice,CurrentPrice,Source{"\n"}
                    TCS,Stock,10,3400.50,3800.00,Zerodha{"\n"}
                    Nifty 50 BeES,ETF,150,210.00,245.20,Groww{"\n"}
                    HDFC Liquid Fund,Mutual Fund,1.254,1000.00,1050.50,Groww
                  </pre>
                  <div className="text-[10px] text-zinc-500 space-y-1">
                    <p>* **Allowed Asset Types**: Stock, Mutual Fund, ETF, REIT, InvIT, Bond, Govt Security</p>
                    <p>* **Allowed Sources**: Zerodha, Groww, Upstox, Angel One, Manual</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
