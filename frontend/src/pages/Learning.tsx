import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Award,
  BookOpenCheck
} from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  answerIdx: number;
  explanation: string;
}

interface Topic {
  id: string;
  title: string;
  type: string;
  description: string;
  benefits: string[];
  risks: string[];
  liquidity: string;
  taxation: string;
  suitableFor: string;
  quiz: QuizQuestion[];
}

const TOPICS: Topic[] = [
  {
    id: "stocks",
    title: "Stocks (Equities)",
    type: "EQUITY",
    description: "Stocks represent fractional ownership in a corporation. When you buy a share, you own a micro-percentage of that company's assets, products, and earnings. Equities have historically been the strongest asset class for beating long-term inflation through capital compounding.",
    benefits: [
      "Compounding Capital Growth: Profit from index and corporate expansion over decades.",
      "Dividend Cash Flows: Regular cash distribution payouts from profit-making companies.",
      "Liquidity: Liquid exchange trading allows quick conversion of shares to cash."
    ],
    risks: [
      "Market Volatility: Subject to daily price swings driven by macro factors and market sentiment.",
      "Business Failure: If the company goes bankrupt, equity holders are paid last, meaning capital can be lost."
    ],
    liquidity: "Very High. Shares are bought and sold instantly during trading hours on NSE/BSE exchanges.",
    taxation: "Short Term Capital Gains (STCG) taxed at 20% flat. Long Term Capital Gains (LTCG) taxed at 12.5% on profits exceeding ₹1.25 Lakh in a financial year.",
    suitableFor: "Investors seeking long-term compounding growth who are comfortable with high short-term volatility.",
    quiz: [
      {
        question: "What does buying a stock represent?",
        options: [
          "A loan made to the company which must be repaid",
          "Partial ownership in the company and its future cash flows",
          "A guaranteed fixed savings yield contract"
        ],
        answerIdx: 1,
        explanation: "Stocks represent equity. Buying a share makes you a part-owner of the company, sharing its profits and growth."
      },
      {
        question: "In India, what is the Long Term Capital Gains (LTCG) tax rate for equities held over 12 months?",
        options: [
          "10% flat rate without exemption",
          "12.5% rate on gains above ₹1.25 Lakh",
          "Tax-free with no limits"
        ],
        answerIdx: 1,
        explanation: "LTCG on listed equity shares is taxed at 12.5% for gains exceeding ₹1.25 Lakh in a financial year (updated post budget)."
      },
      {
        question: "What is unsystematic risk?",
        options: [
          "Market-wide inflation and interest rate adjustments",
          "Company-specific risk like product failure, which can be diversified away",
          "Sovereign default risks of government securities"
        ],
        answerIdx: 1,
        explanation: "Unsystematic risk is company-specific risk. Spreading capital across multiple stocks eliminates this risk, leaving only systematic market risk."
      }
    ]
  },
  {
    id: "mutualfunds",
    title: "Mutual Funds",
    type: "EQUITY / DEBT",
    description: "Mutual Funds pool capital from thousands of retail investors to buy a diversified basket of stocks, bonds, or short-term papers. An asset management company (AMC) employs professional fund managers to actively select holdings matching the fund's objective.",
    benefits: [
      "Instant Diversification: Spreads minor starting capital across dozens of companies.",
      "SIP Compounding: Set up automated monthly Systematic Investment Plans.",
      "Professional Oversight: Fund selection guided by credentialed financial research managers."
    ],
    risks: [
      "Expense Ratio Cost: Annual management fees are deducted directly from NAV values.",
      "Underperformance: Actively managed funds might fail to beat passive index returns."
    ],
    liquidity: "High. Mutual fund units can be redeemed on any business day at that day's closing NAV pricing.",
    taxation: "Equity fund capital gains match stock taxes. Debt funds are taxed at the investor's marginal income tax slab rates.",
    suitableFor: "Investors seeking diversified portfolios managed by specialists, starting with low recurring amounts.",
    quiz: [
      {
        question: "What is a major structural benefit of investing in Mutual Funds?",
        options: [
          "Guaranteed regular returns by government deposit insurance",
          "Instant professional diversification across many assets with small starting capital",
          "Complete exemption from all federal and capital gain taxes"
        ],
        answerIdx: 1,
        explanation: "Mutual funds pool money to buy a broad portfolio. This allows individual retail investors to own a diversified index with tiny capital splits."
      },
      {
        question: "What is an Expense Ratio in mutual funds?",
        options: [
          "The penalty charge applied when exiting a fund early",
          "The annual operating and management fee percentage deducted from fund asset NAV",
          "The commission paid directly to tax officers"
        ],
        answerIdx: 1,
        explanation: "The Expense Ratio is the annual fee charged by the fund manager to cover operations. Lower expense ratios preserve compounding returns."
      },
      {
        question: "A Flexi Cap mutual fund allows the fund manager to invest in:",
        options: [
          "Only large-cap conglomerates to ensure high safety",
          "Only short-term treasury bills",
          "Companies of any market size (Large, Mid, or Small Cap) based on opportunities"
        ],
        answerIdx: 2,
        explanation: "Flexi Cap funds have dynamic mandate flexibility, letting managers shift holdings across large, mid, and small-cap segments based on valuations."
      }
    ]
  },
  {
    id: "etfs",
    title: "Exchange Traded Funds (ETFs)",
    type: "PASSIVE EQUITY",
    description: "Exchange Traded Funds track major stock, bond, or gold indexes (like the Nifty 50 or Gold Index). Unlike standard mutual funds, ETFs are listed and traded in real-time on stock exchanges like individual stocks.",
    benefits: [
      "Extremely Low Fees: Passive index tracking has minimal operating overhead.",
      "Intraday Trading: Buy or sell shares instantly at market price during market hours.",
      "Sectors & Commodities: Easily purchase sector indexes or physical Gold/Silver pools."
    ],
    risks: [
      "Tracking Error: Minor mismatches between ETF values and the target index.",
      "Liquidity Spreads: Low trading volumes can lead to high bid-ask price differences."
    ],
    liquidity: "Very High. Traded in real-time on exchanges during market hours.",
    taxation: "Equity index ETFs match stock tax rules (20% STCG, 12.5% LTCG). Gold and international ETFs are taxed at income slab rates.",
    suitableFor: "Investors seeking low-cost, transparent, passive market exposure who hold broker accounts.",
    quiz: [
      {
        question: "How do ETFs differ from standard Mutual Funds in terms of trading?",
        options: [
          "ETFs can only be purchased once a year",
          "ETFs trade in real-time on the stock exchange during market hours",
          "ETFs do not track stock indices"
        ],
        answerIdx: 1,
        explanation: "ETFs combine index mutual fund benefits with stock-like trading, allowing real-time intraday purchases and sales."
      },
      {
        question: "What is a tracking error in ETFs?",
        options: [
          "The difference in returns between the ETF NAV and the actual index it tracks",
          "A transaction transmission glitch inside brokerage terminals",
          "The tax rate discrepancy between domestic and foreign holdings"
        ],
        answerIdx: 0,
        explanation: "Tracking error measures the efficiency of the ETF in copying its underlying index. Lower tracking errors are preferred."
      },
      {
        question: "Which index does the SBI Nifty 50 ETF track?",
        options: [
          "BSE SENSEX Index",
          "NSE Nifty 50 Index",
          "Nasdaq 100 Index"
        ],
        answerIdx: 1,
        explanation: "The SBI Nifty 50 ETF replicates the NSE Nifty 50 index containing India's top 50 blue-chip companies."
      }
    ]
  },
  {
    id: "reits",
    title: "Real Estate Investment Trusts (REITs)",
    type: "REAL ESTATE",
    description: "REITs own and operate commercial real estate properties like Grade-A office parks, malls, and tech hubs. By law, Indian REITs must distribute 90% of their net cash inflows to unit holders, making them excellent dividend generators.",
    benefits: [
      "Low Capital Real Estate: Own commercial real estate starting with a single unit cost.",
      "Defensive Rental Yields: Stable distributions supported by long-term corporate leases.",
      "Inflation Hedge: Asset value and lease rates typically adjust upward with inflation."
    ],
    risks: [
      "Occupancy Declines: Rent falls if tech companies downsize or tenants vacate.",
      "Interest Rate Volatility: REIT yields compete with G-Secs, making prices sensitive to rate hikes."
    ],
    liquidity: "Medium-High. REIT units are listed and traded daily on stock NSE/BSE exchanges.",
    taxation: "Distributions are split into Interest, Dividends, and Capital Return components, taxed at slab rates or tax-free depending on the corporate tax structure.",
    suitableFor: "Investors seeking regular passive income and real estate diversification without direct property management.",
    quiz: [
      {
        question: "What percentage of net distributable cash flows must REITs distribute by Indian regulation?",
        options: [
          "At least 50%",
          "At least 90%",
          "Exactly 100%"
        ],
        answerIdx: 1,
        explanation: "SEBI regulations mandate that REITs distribute at least 90% of their Net Distributable Cash Flows (NDCF) to unit holders as dividends or interest."
      },
      {
        question: "Why are REIT prices sensitive to central bank interest rate hikes?",
        options: [
          "Higher rates make safe fixed income (like fixed deposits) more attractive compared to REIT yields",
          "Tech parks are physically demolished when rates rise",
          "REITs are prohibited from borrowing money"
        ],
        answerIdx: 0,
        explanation: "When interest rates rise, bond yields go up. Investors demand higher yields from REITs to compensate for risk, pushing down REIT prices."
      },
      {
        question: "What type of asset does a commercial REIT typically hold?",
        options: [
          "Agricultural farms and crop systems",
          "Grade-A tech parks, office spaces, and commercial warehouses",
          "Residential apartments and houses"
        ],
        answerIdx: 1,
        explanation: "Commercial REITs in India own high-grade commercial real estate, leasing tech parks and office spaces to stable multinational tenants."
      }
    ]
  },
  {
    id: "invits",
    title: "Infrastructure Investment Trusts (InvITs)",
    type: "INFRASTRUCTURE",
    description: "InvITs own and operate cash-generating infrastructure assets like national highway toll gates, telecom networks, and power transmission lines. They pay highly attractive yields backed by long-term toll or transmission contracts.",
    benefits: [
      "High Distribution Yields: Payouts typically exceed REIT yields, often reaching 9-11%.",
      "Revenue Predictability: Operations are backed by long-term government power or toll concessions."
    ],
    risks: [
      "Regulatory Decisions: Changes in government tariff rates or toll collections.",
      "Asset Depletion: Concession periods are finite; toll assets eventually expire."
    ],
    liquidity: "Medium. Traded on NSE/BSE but trading volume is typically lower than equity stocks.",
    taxation: "Payouts are taxed at slab rates or are tax-exempt based on the interest/dividend component division.",
    suitableFor: "Income-focused investors seeking maximum yield payouts with moderate regulatory risk tolerance.",
    quiz: [
      {
        question: "Which infrastructure asset is typically owned by an InvIT?",
        options: [
          "Commercial tech parks and office buildings",
          "Power transmission grid lines and toll roads",
          "Residential apartments"
        ],
        answerIdx: 1,
        explanation: "InvITs focus on national infrastructure. Power transmission grids (e.g. PowerGRID InvIT) and toll roads are classic cash-generating infra assets."
      },
      {
        question: "What is a major advantage of investing in InvITs?",
        options: [
          "Rapid capital value doubling within six months",
          "Highly attractive distribution yields (typically 9-11%) backed by long-term utility contracts",
          "Guaranteed complete insulation from all inflation risk"
        ],
        answerIdx: 1,
        explanation: "InvITs offer high cash distributions because utility contracts pay predictable, regular cash flows which must be distributed to investors."
      },
      {
        question: "What is concession period risk in toll-road InvITs?",
        options: [
          "Toll roads are subject to speed limit fines",
          "The asset contract expires after a set period, returning the highway to the government",
          "Roads become dusty over time"
        ],
        answerIdx: 1,
        explanation: "Toll road concessions have finite lifetimes (e.g., 30 years). At the end, the road goes back to the government, so the fund must replace it or liquidate."
      }
    ]
  },
  {
    id: "bonds",
    title: "Corporate Bonds",
    type: "DEBT",
    description: "Bonds are loans you make to a corporation. In exchange, the company issues a certificate promising to pay a fixed interest coupon annually/monthly and return your principal on a specific maturity date.",
    benefits: [
      "Predictable Income: Stable fixed coupons shielded from equity fluctuations.",
      "Liquidation Priority: Bondholders are secured creditors, paid before equity shareholders."
    ],
    risks: [
      "Default (Credit) Risk: If the issuer goes bankrupt, they may fail to pay interest or principal.",
      "Inflation Drag: If inflation is 6% and coupon is 8%, the real return is only 2%."
    ],
    liquidity: "Low-Medium. Though traded on NSE, the secondary corporate bond market is highly illiquid.",
    taxation: "Interest coupons are taxed at your slab rates. Capital gains are taxed at 12.5% if listed and held over 12 months.",
    suitableFor: "Conservative investors seeking fixed yields who plan to hold investments until maturity.",
    quiz: [
      {
        question: "If interest rates rise in the economy, what happens to the price of existing bonds?",
        options: [
          "Existing bond prices rise because yields are higher",
          "Existing bond prices fall to align their yield with new higher market rates",
          "Bond prices remain completely static"
        ],
        answerIdx: 1,
        explanation: "Bond prices move inversely to interest rates. When rates rise, existing bonds with lower coupons become less attractive, dropping in price."
      },
      {
        question: "What does a CRISIL AAA credit rating signify for a corporate bond?",
        options: [
          "Highest speculative default risk",
          "Highest credit safety and extremely low default risk",
          "Guaranteed stock equity conversion"
        ],
        answerIdx: 1,
        explanation: "AAA is the highest investment-grade credit rating. It implies the company has strong cash reserves to meet debt obligations safely."
      },
      {
        question: "What is a bond coupon?",
        options: [
          "A shopping discount card",
          "The periodic interest payment paid to the bondholder",
          "The document certifying the bond is paid off"
        ],
        answerIdx: 1,
        explanation: "Historically, bonds had paper coupon sheets. Investors clipped and redeemed them for interest. Today, the coupon represents the interest rate."
      }
    ]
  },
  {
    id: "gsecs",
    title: "Government Securities (G-Secs)",
    type: "SOVEREIGN DEBT",
    description: "G-Secs are sovereign debt securities issued by the Reserve Bank of India (RBI) on behalf of the Central Government to fund infrastructure and state spending. They carry a sovereign guarantee, making credit default risk virtually zero.",
    benefits: [
      "Zero Credit Risk: Backed by the taxing and money-printing power of the state.",
      "Long-term Lock-in: Secure constant yields for up to 30-40 years.",
      "Regular Payouts: Stable semi-annual coupon distributions."
    ],
    risks: [
      "Interest Rate Risk: If you sell before maturity, prices swing with interest cycles.",
      "Purchasing Power Risk: Low yields may not keep pace with high retail inflation."
    ],
    liquidity: "Medium. RBI's Retail Direct platform allows retail trading, but trading volume varies.",
    taxation: "Coupon interest is taxed at your income tax slab rate. Capital gains are taxed depending on the holding duration.",
    suitableFor: "Ultra-conservative investors seeking risk-free capital preservation and fixed long-term yields.",
    quiz: [
      {
        question: "Who issues Government Securities (G-Secs) in India?",
        options: [
          "Large private stockbroker companies",
          "The Reserve Bank of India (RBI) on behalf of the Central Government",
          "Local municipal councils only"
        ],
        answerIdx: 1,
        explanation: "G-Secs are sovereign debt instruments issued by RBI to manage government debt requirements."
      },
      {
        question: "Why do G-Secs carry zero credit default risk?",
        options: [
          "They are backed by massive private property portfolios",
          "They carry a sovereign guarantee from the government, which holds monetary printing rights",
          "Interest rates are pegged to global markets"
        ],
        answerIdx: 1,
        explanation: "Sovereign debt carries the full faith of the state. Governments can print currency or raise taxes to meet local debt, making defaults negligible."
      },
      {
        question: "What is the primary risk of holding a G-Sec to maturity?",
        options: [
          "Losing your initial principal capital",
          "Inflation eroding the purchasing power of your fixed return yield",
          "Bank bankruptcy"
        ],
        answerIdx: 1,
        explanation: "If you hold a bond to maturity, you get your principal back. But if inflation rises higher than the yield, the real value of that money shrinks."
      }
    ]
  }
];

export const Learning: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [activeTopic, setActiveTopic] = useState<Topic>(TOPICS[0]);
  
  // Quiz progress states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Track completed topics
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  const activeQuiz = activeTopic.quiz;

  const handleOptionSelect = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || quizSubmitted) return;
    setQuizSubmitted(true);
    if (selectedOpt === activeQuiz[currentQIdx].answerIdx) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setQuizSubmitted(false);
    if (currentQIdx < activeQuiz.length - 1) {
      setCurrentQIdx(prev => prev + 1);
    } else {
      // Quiz complete!
      setCompletedTopics(prev => ({
        ...prev,
        [activeTopic.id]: true
      }));
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQIdx(0);
    setSelectedOpt(null);
    setQuizSubmitted(false);
    setScore(0);
  };

  const handleSelectTopic = (topic: Topic) => {
    setActiveTopic(topic);
    resetQuiz();
  };

  const handleDeepLinkAssistant = () => {
    const risk = profile?.riskAppetite || "Moderate";
    const prompt = `Explain ${activeTopic.title} in detail for a investor with a ${risk} risk profile.`;
    navigate("/assistant", { state: { prefillQuery: prompt } });
  };

  return (
    <div className="space-y-6">
      {/* Top Header banner */}
      <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              Learning Center
              <GraduationCap className="w-5 h-5 text-indigo-500" />
            </h1>
            <p className="text-zinc-400 text-xs mt-1">
              Level up your financial intelligence. Complete modular quizzes to verify your asset knowledge!
            </p>
          </div>
          {Object.keys(completedTopics).length > 0 && (
            <div className="flex items-center gap-2 bg-indigo-950/40 border border-indigo-900/50 rounded-lg py-2 px-3 text-[10px] text-indigo-400 font-bold">
              <Award className="w-4 h-4" />
              <span>
                {Object.keys(completedTopics).length} of {TOPICS.length} MODULES CERTIFIED
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left navigation chips/menu, Right content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Topics menu */}
        <div className="md:col-span-1 space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 px-2.5">Asset Categories</p>
          <div className="space-y-1">
            {TOPICS.map(topic => {
              const isSelected = activeTopic.id === topic.id;
              const isDone = completedTopics[topic.id];
              return (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className={`w-full text-left flex justify-between items-center px-3.5 py-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-zinc-800 border-zinc-700 text-zinc-100 font-bold shadow-sm"
                      : "bg-zinc-900 border-zinc-900/60 text-zinc-400 hover:text-zinc-250 hover:bg-zinc-850/50"
                  }`}
                >
                  <span className="truncate">{topic.title}</span>
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="text-[8px] bg-zinc-950 text-zinc-500 border border-zinc-850 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
                      {topic.type}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right topic detail module */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-6 space-y-6 shadow-sm">
            {/* Header description */}
            <div className="flex justify-between items-start border-b border-zinc-850 pb-4">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-950 text-indigo-400 border border-indigo-900/30 uppercase">
                  Module {TOPICS.findIndex(t => t.id === activeTopic.id) + 1} • {activeTopic.type}
                </span>
                <h2 className="text-lg font-bold text-zinc-100 mt-2">{activeTopic.title}</h2>
              </div>
              <button
                onClick={handleDeepLinkAssistant}
                className="flex items-center gap-1 py-1.5 px-3 bg-zinc-950 border border-zinc-850 hover:border-zinc-750 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors rounded-lg cursor-pointer"
              >
                Ask NIDHI About This
                <Sparkles className="w-3 h-3" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">What is it?</h3>
              <p className="text-zinc-200 text-xs leading-relaxed">{activeTopic.description}</p>
            </div>

            {/* Benefits vs Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-950/60 border border-zinc-850 rounded-lg p-4 space-y-2.5">
                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Key Benefits
                </h4>
                <ul className="space-y-1.5">
                  {activeTopic.benefits.map((b, idx) => (
                    <li key={idx} className="text-zinc-300 text-xs leading-relaxed flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-850 rounded-lg p-4 space-y-2.5">
                <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Primary Risks
                </h4>
                <ul className="space-y-1.5">
                  {activeTopic.risks.map((r, idx) => (
                    <li key={idx} className="text-zinc-300 text-xs leading-relaxed flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Grid for parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-850 pt-5">
              <div>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Liquidity Profile</span>
                <p className="text-zinc-250 text-xs mt-1 font-medium">{activeTopic.liquidity}</p>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Taxation Standard</span>
                <p className="text-zinc-250 text-xs mt-1 font-medium">{activeTopic.taxation}</p>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Target Investor</span>
                <p className="text-zinc-250 text-xs mt-1 font-medium">{activeTopic.suitableFor}</p>
              </div>
            </div>
          </div>

          {/* Interactive Quiz Module */}
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <h3 className="text-xs font-bold text-zinc-250 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpenCheck className="w-4 h-4 text-indigo-400" />
                Knowledge Check • {activeTopic.title}
              </h3>
              {completedTopics[activeTopic.id] && (
                <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Certified
                </span>
              )}
            </div>

            {!quizStarted ? (
              <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
                <BookOpen className="w-10 h-10 text-zinc-500" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">Test your {activeTopic.title} Knowledge</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 max-w-sm">
                    Answer 3 quick multiple-choice questions to certify this module and earn investor XP.
                  </p>
                </div>
                <button
                  onClick={() => setQuizStarted(true)}
                  className="py-2 px-4 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Start Quiz
                </button>
              </div>
            ) : completedTopics[activeTopic.id] && currentQIdx >= activeQuiz.length ? (
              // Quiz Finished Screen
              <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-950 border border-emerald-900 rounded-full flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">Module Certified!</h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    You completed the quiz with a score of <strong>{score} of 3</strong>.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={resetQuiz}
                    className="py-2 px-3 border border-zinc-800 text-zinc-400 hover:text-zinc-250 transition-colors text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={handleDeepLinkAssistant}
                    className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Ask AI Questions
                  </button>
                </div>
              </div>
            ) : (
              // Question screen
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase font-semibold">
                  <span>Question {currentQIdx + 1} of {activeQuiz.length}</span>
                  <span>Score: {score} / {currentQIdx + (quizSubmitted ? 1 : 0)}</span>
                </div>

                <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentQIdx + (quizSubmitted ? 1 : 0)) / activeQuiz.length) * 100}%` }}
                  />
                </div>

                <h4 className="text-sm font-bold text-zinc-200 mt-2">
                  {activeQuiz[currentQIdx].question}
                </h4>

                <div className="space-y-2">
                  {activeQuiz[currentQIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedOpt === oIdx;
                    const isCorrect = oIdx === activeQuiz[currentQIdx].answerIdx;

                    let btnStyle = "bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200";
                    if (isSelected && !quizSubmitted) {
                      btnStyle = "bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold";
                    } else if (quizSubmitted) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-950/40 border-emerald-900/60 text-emerald-400 font-bold";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-950/40 border-rose-900/60 text-rose-400 font-semibold";
                      } else {
                        btnStyle = "bg-zinc-950/30 border-zinc-950/60 text-zinc-500 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleOptionSelect(oIdx)}
                        className={`w-full text-left p-3 border rounded-lg text-xs transition-all cursor-pointer ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation / Results block */}
                {quizSubmitted && (
                  <div className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-lg space-y-1.5 animate-fade-in">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">
                      {selectedOpt === activeQuiz[currentQIdx].answerIdx ? "Correct Answer!" : "Incorrect"}
                    </span>
                    <p className="text-zinc-300 text-xs leading-relaxed">
                      {activeQuiz[currentQIdx].explanation}
                    </p>
                  </div>
                )}

                {/* Confirm/Next buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-850">
                  {!quizSubmitted ? (
                    <button
                      type="button"
                      disabled={selectedOpt === null}
                      onClick={handleSubmitAnswer}
                      className="py-2 px-4 bg-indigo-650 hover:bg-indigo-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (currentQIdx >= activeQuiz.length - 1) {
                          // Trigger completion check
                          setCompletedTopics(prev => ({
                            ...prev,
                            [activeTopic.id]: true
                          }));
                          setCurrentQIdx(prev => prev + 1);
                        } else {
                          handleNextQuestion();
                        }
                      }}
                      className="py-2 px-4 bg-zinc-850 hover:bg-zinc-80 text-zinc-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {currentQIdx >= activeQuiz.length - 1 ? "Finish Module Check" : "Next Question"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
