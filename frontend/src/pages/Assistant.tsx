import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { useAuth } from "../context/AuthContext";
import {
  Send,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  Loader2,
  Trash2,
  AlertCircle,
  Clock,
  MessageSquare
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export const Assistant: React.FC = () => {
  const location = useLocation();
  const { holdings } = usePortfolio();
  const { profile, user } = useAuth();

  const HISTORY_KEY = `nidhi_chat_history_${user?.uid || "guest"}`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages, HISTORY_KEY]);

  // Load prefill query if redirected from another page (like Learning Center)
  useEffect(() => {
    const state = location.state as { prefillQuery?: string } | null;
    if (state?.prefillQuery) {
      handleSend(state.prefillQuery);
    } else if (messages.length === 0) {
      const welcomeMsg: ChatMessage = {
        role: "assistant",
        content:
          "Hello! I am NIDHI, your AI Financial Assistant. I have analyzed your profile and current holdings.\n\nAsk me anything about your asset allocation, risk parameters, or suitability recommendations! You can use the quick-start prompts below.",
        timestamp: Date.now()
      };
      setMessages([welcomeMsg]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text, timestamp: Date.now() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputVal("");
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          holdings: holdings.map((h) => ({
            name: h.name,
            type: h.type,
            quantity: h.quantity,
            avgPrice: h.avgPrice,
            currentPrice: h.currentPrice,
            source: h.source
          })),
          profile: profile
            ? {
                fullName: profile.fullName,
                age: profile.age,
                occupation: profile.occupation,
                annualIncome: profile.annualIncome,
                experience: profile.experience,
                goal: profile.goal,
                horizon: profile.horizon,
                capacity: profile.capacity,
                riskAppetite: profile.riskAppetite
              }
            : null
        })
      });

      if (!response.ok) throw new Error("Chat assistant backend error");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, timestamp: Date.now() }
      ]);
    } catch (err) {
      console.warn("FastAPI chat assistant unreachable, executing client-side fallback:", err);
      setTimeout(() => {
        const fallbackReply = runLocalChatFallback(text);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fallbackReply, timestamp: Date.now() }
        ]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const runLocalChatFallback = (query: string): string => {
    const q = query.toLowerCase();
    const total_val = holdings.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0);
    const holdings_count = holdings.length;

    const eq_val = holdings
      .filter((h) => ["Stock", "ETF", "Mutual Fund"].includes(h.type))
      .reduce((sum, h) => sum + h.quantity * h.currentPrice, 0);
    const debt_val = holdings
      .filter((h) => ["Bond", "Govt Security", "Liquid Fund"].includes(h.type))
      .reduce((sum, h) => sum + h.quantity * h.currentPrice, 0);
    const reit_val = holdings
      .filter((h) => ["REIT", "InvIT"].includes(h.type))
      .reduce((sum, h) => sum + h.quantity * h.currentPrice, 0);

    const eq_pct = total_val > 0 ? (eq_val / total_val) * 100 : 0;
    const debt_pct = total_val > 0 ? (debt_val / total_val) * 100 : 0;
    const reit_pct = total_val > 0 ? (reit_val / total_val) * 100 : 0;

    const risk_appetite = profile?.riskAppetite || "Moderate";
    const goal = profile?.goal || "Wealth Creation";
    const holding_names = holdings.map((h) => h.name);
    const holding_summary =
      holding_names.slice(0, 3).join(", ") +
      (holding_names.length > 3 ? `, and ${holding_names.length - 3} other(s)` : "");

    if (q.includes("risk") || q.includes("risky") || q.includes("danger")) {
      if (total_val === 0) {
        return (
          "Your portfolio currently has no holdings imported. You face zero market price volatility risk, but high **inflation risk** on idle cash.\n\n" +
          "Go to the Dashboard to import portfolio details or browse recommended assets in the Smart Investment Hub!"
        );
      }
      const alignment =
        (risk_appetite === "Aggressive" && eq_pct > 60) ||
        (risk_appetite === "Conservative" && debt_pct > 60)
          ? "aligned with"
          : "mismatched with";
      let advice = "";
      if (risk_appetite === "Conservative" && eq_pct > 50) {
        advice =
          "\n\n**Actionable Advice**: Your portfolio holds high equity exposure which exposes you to stock drawdowns. Consider shifting 25% of your wealth into RBI G-Secs or AAA corporate debt.";
      } else if (risk_appetite === "Aggressive" && debt_pct > 50) {
        advice =
          "\n\n**Actionable Advice**: Your aggressive profile seeks growth, yet you hold substantial debt. Consider introducing low-cost index tracker ETFs (e.g. SBI Nifty 50 ETF) to optimize capital appreciation.";
      }
      return (
        `Analyzing your ₹${total_val.toLocaleString("en-IN")} portfolio, here is your risk distribution:\n\n` +
        `* **Equity Exposure (${eq_pct.toFixed(1)}%)**: Growth holdings include \`${holding_summary}\`.\n` +
        `* **Fixed Income (${debt_pct.toFixed(1)}%)**: Capital preservation anchor.\n` +
        `* **Alternatives (${reit_pct.toFixed(1)}%)**: Non-correlated income assets.\n\n` +
        `Your allocation is **${alignment}** your self-declared **${risk_appetite}** risk tolerance.${advice}`
      );
    }

    if (q.includes("reit") || q.includes("invit") || q.includes("real estate")) {
      const has_reit = reit_val > 0;
      return (
        "**REITs (Real Estate Investment Trusts)** and **InvITs (Infrastructure Investment Trusts)** distribute commercial rental incomes and infrastructure dividends dynamically:\n\n" +
        "* **Defensive Yields**: Currently yield 7-10% in regular distributions.\n" +
        "* **Stock Correlation**: Low correlation to equity index swings, stabilizing your drawdowns.\n" +
        `* **Your Profile**: You have ${has_reit ? "some" : "0%"} alternatives exposure. Adding commercial REITs matching NIDHI's suitability allocation optimizes passive yields.`
      );
    }

    if (q.includes("diversif") || q.includes("spread") || q.includes("sectors")) {
      if (holdings_count <= 2) {
        return (
          `You hold only ${holdings_count} asset(s). This is high issuer risk.\n\n` +
          "**Diversification** eliminates unsystematic risk by spreading your funds across sectors and issuers. " +
          "We recommend reallocating to indexes (Nifty 50 ETF) and G-Secs in the Smart Investment Hub."
        );
      }
      return (
        `Your portfolio contains ${holdings_count} holdings. Your asset category weights are:\n` +
        `* Equities: ${eq_pct.toFixed(1)}%\n` +
        `* Debt/Bonds: ${debt_pct.toFixed(1)}%\n` +
        `* Alternatives: ${reit_pct.toFixed(1)}%\n\n` +
        "This is an effective spread to reduce single-company volatility risk."
      );
    }

    if (
      q.includes("bond") ||
      q.includes("g-sec") ||
      q.includes("gsec") ||
      q.includes("fixed income")
    ) {
      return (
        "Bonds are debt agreements paying fixed interest returns. " +
        "NIDHI recommends government securities and AAA corporate bonds (yielding 7-8%) to secure guaranteed compounding and hedge equity corrections."
      );
    }

    if (q.includes("market fall") || q.includes("crash") || q.includes("correction")) {
      return (
        `During stock market crashes, your equity assets (${eq_pct.toFixed(1)}%) will correct. ` +
        `However, your debt/cash buffers (${debt_pct.toFixed(1)}%) will remain completely stable, cushioning drawdowns. ` +
        `Maintaining liquid reserves prevents forced selling and allows buying cheap assets during corrections.`
      );
    }

    if (q.includes("reduce risk") || q.includes("rebalance")) {
      return (
        "To systematically reduce your portfolio risk:\n" +
        "1. Shift funds from individual stocks to index tracker ETFs (SBI Nifty 50 ETF).\n" +
        "2. Reallocate capital to safe sovereign debt (7.18% GS 2033).\n" +
        "3. Allocate to cash reserves (HDFC Liquid Mutual Fund).\n" +
        "4. Diversify with rent-yielding commercial REITs."
      );
    }

    return (
      `Hello! I am NIDHI, your AI Financial Assistant.\n\n` +
      `Your declared Goal is **${goal}** with **${risk_appetite}** risk tolerance. ` +
      `You hold **${holdings_count}** assets valued at **₹${total_val.toLocaleString("en-IN")}**.\n\n` +
      "Ask me specific questions, like:\n" +
      "* *Why is my portfolio risky?*\n" +
      "* *Should I invest in REITs or InvITs?*\n" +
      "* *Explain diversification benefits.*\n" +
      "* *What happens if the stock market falls?*"
    );
  };

  const suggestions = [
    "Why is my portfolio risky?",
    "Should I invest in REITs?",
    "Explain diversification.",
    "What happens if the market falls?"
  ];

  const clearChat = () => {
    const welcomeMsg: ChatMessage = {
      role: "assistant",
      content: "Chat history cleared. I've reloaded your current profile context. How can I assist you now?",
      timestamp: Date.now()
    };
    setMessages([welcomeMsg]);
    setErrorMsg(null);
    localStorage.removeItem(HISTORY_KEY);
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  // Group messages by date for history view
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateLabel = formatDate(msg.timestamp);
    if (!acc[dateLabel]) acc[dateLabel] = [];
    acc[dateLabel].push(msg);
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-xl">
      {/* Chat Header */}
      <div className="bg-zinc-900 border-b border-zinc-800/80 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center border border-indigo-900/60">
            <Bot className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
              AI Financial Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
            <p className="text-[10px] text-zinc-400 font-medium">
              Portfolio Context: {holdings.length} Holdings • Goal: {profile?.goal || "None"} •{" "}
              <span className="text-zinc-500">{messages.filter((m) => m.role === "user").length} messages in history</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Toggle History Panel */}
          <button
            onClick={() => setShowHistory((v) => !v)}
            title="Chat History"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${showHistory ? "bg-zinc-700 text-zinc-200" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"}`}
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            title="Clear Conversation"
            className="text-zinc-500 hover:text-zinc-300 p-2 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* History Sidebar */}
        {showHistory && (
          <div className="w-64 border-r border-zinc-800/80 bg-zinc-950/80 flex flex-col overflow-hidden shrink-0">
            <div className="px-4 py-3 border-b border-zinc-800/60 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Conversation History</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {Object.keys(groupedMessages).length === 0 ? (
                <p className="text-[10px] text-zinc-600 text-center py-4">No history yet</p>
              ) : (
                Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    <p className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest mb-2">{date}</p>
                    <div className="space-y-1.5">
                      {msgs
                        .filter((m) => m.role === "user")
                        .map((m, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(m.content)}
                            className="w-full text-left p-2 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/60 rounded-lg transition-colors cursor-pointer group"
                          >
                            <p className="text-[10px] text-zinc-400 group-hover:text-zinc-200 truncate leading-relaxed">
                              {m.content}
                            </p>
                            <span className="text-[8px] text-zinc-600 mt-0.5 block">{formatTime(m.timestamp)}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Messages Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-4 max-w-3xl animate-fade-in ${
                m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar icon */}
              <div
                className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                  m.role === "user"
                    ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                    : "bg-indigo-950/60 border-indigo-900/50 text-indigo-400"
                }`}
              >
                {m.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-zinc-900 border-zinc-800 text-zinc-100"
                      : "bg-zinc-950/40 border-zinc-900/80 text-zinc-300 shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
                <span className="text-[9px] text-zinc-600 px-1">{formatTime(m.timestamp)}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 max-w-3xl mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-900/50 flex items-center justify-center text-indigo-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-zinc-950/30 border border-zinc-900/50 p-4 rounded-xl text-zinc-500 text-xs flex items-center gap-2">
                NIDHI is analyzing portfolio data...
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="flex gap-2 items-center bg-red-950/20 border border-red-900/30 text-red-400 text-[11px] p-3 rounded-lg max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length <= 1 && !loading && (
        <div className="px-6 pb-2 space-y-2">
          <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Suggested Prompts</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="py-1.5 px-3 border border-zinc-850 bg-zinc-950/60 hover:bg-zinc-900 hover:border-zinc-750 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors rounded-lg flex items-center gap-1 cursor-pointer"
              >
                {s}
                <ArrowRight className="w-3 h-3 text-zinc-500" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input box */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            required
            disabled={loading}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about your risk, suitability check, or asset details..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 px-4 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="w-10 h-10 bg-indigo-650 hover:bg-indigo-600 disabled:bg-zinc-850 disabled:text-zinc-650 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
