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
  BookOpenCheck,
  Compass,
  LayoutDashboard,
  PlayCircle,
  Activity,
  Briefcase,
  Lock,
  ChevronDown,
  ChevronUp,
  Search
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

  const [isNidhiActive, setIsNidhiActive] = useState(true); // Default to NIDHI onboarding/manual first!
  const [activeNidhiSection, setActiveNidhiSection] = useState("welcome");
  const [activeTopic, setActiveTopic] = useState<Topic>(TOPICS[0]);
  
  // Quiz progress states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Track completed topics
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  // Additional NIDHI Guide States
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedPage, setExpandedPage] = useState<string | null>(null);

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
    const prompt = `Explain ${activeTopic.title} in detail for an investor with a ${risk} risk profile.`;
    navigate("/assistant", { state: { prefillQuery: prompt } });
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Data for NIDHI Onboarding Guide
  // ───────────────────────────────────────────────────────────────────────────
  const NIDHI_SECTIONS = [
    { id: "welcome", title: "Welcome to NIDHI", icon: BookOpen, desc: "Vision, philosophy & core values" },
    { id: "started", title: "Getting Started", icon: PlayCircle, desc: "Account setup, profile & goals" },
    { id: "dashboard", title: "Dashboard Guide", icon: LayoutDashboard, desc: "Explaining dashboard components" },
    { id: "pages", title: "Page Manual", icon: Compass, desc: "Understanding every page of NIDHI" },
    { id: "glossary", title: "Financial Glossary", icon: Activity, desc: "22 essential investing terms" },
    { id: "scores", title: "Scoring Systems", icon: Award, desc: "Health, Risk & Liquidity metrics" },
    { id: "ai", title: "AI Engines", icon: Sparkles, desc: "How suitability & chat copilots work" },
    { id: "partners", title: "Redirection Partners", icon: Briefcase, desc: "Zerodha/Groww transaction flow" },
    { id: "privacy", title: "Security & Privacy", icon: Lock, desc: "Firebase authentication & database safety" },
    { id: "faq", title: "FAQs", icon: HelpCircle, desc: "Frequently asked questions" }
  ];

  const GLOSSARY_TERMS = [
    {
      term: "Portfolio",
      explain: "The complete collection of financial assets (stocks, bonds, cash, REITs) held by an investor.",
      why: "Evaluates your overall net worth and risk balance rather than focusing on a single winner or loser.",
      example: "If you own ₹50,000 of SBI shares, ₹30,000 in fixed deposits, and ₹20,000 in gold, your portfolio value is ₹100,000."
    },
    {
      term: "Asset Allocation",
      explain: "The strategy of dividing your investment capital across different asset classes like equities, debt, and alternatives.",
      why: "It is the single largest driver of your portfolio's risk profile and long-term returns.",
      example: "Spreading ₹10,000 as ₹6,000 in equity mutual funds for growth, and ₹4,000 in government bonds for safety."
    },
    {
      term: "Diversification",
      explain: "Spreading investments across different issuers, sectors, and asset classes to reduce the risk of a single failure hurting your entire corpus.",
      why: "Eliminates company-specific risk. 'Don't put all your eggs in one basket.'",
      example: "Instead of putting ₹1 Lakh in one banking stock, buying a banking sector ETF that holds 10 different bank shares."
    },
    {
      term: "Risk Appetite",
      explain: "An investor's capacity and willingness to tolerate price swings (volatility) in exchange for potential returns.",
      why: "Ensures you choose investments that you won't panic-sell during market corrections.",
      example: "An aggressive investor holding 80% equities vs a conservative retiree holding 80% safe bonds."
    },
    {
      term: "Volatility",
      explain: "The speed and magnitude of price changes in an asset over a short period.",
      why: "High volatility means higher risk of short-term losses but opportunity for high returns.",
      example: "Cryptocurrencies can swing 20% in a day (high volatility), while government bonds swing less than 0.5% (low volatility)."
    },
    {
      term: "Liquidity",
      explain: "How quickly and easily an asset can be converted into cash without a significant loss in its value.",
      why: "Critical for emergency funds and short-term capital needs.",
      example: "Cash in a savings account is highly liquid; selling a physical house takes months (highly illiquid)."
    },
    {
      term: "Market Cap",
      explain: "The total market value of a company's outstanding shares (Shares Outstanding × Share Price).",
      why: "Categorizes companies into Large Cap (stable blue-chips), Mid Cap, and Small Cap (high growth, high risk).",
      example: "Reliance Industries has a market cap of over ₹15 Lakh Crores, making it a mega large-cap company."
    },
    {
      term: "Equity",
      explain: "Ownership interest in a business, typically held through common stock shares.",
      why: "Historically the highest returning asset class over long horizons.",
      example: "Owning 100 shares of Tata Motors means you own a micro-slice of its factories, brand, and profits."
    },
    {
      term: "Debt",
      explain: "An investment where you lend money to an entity (government or company) in exchange for fixed regular interest.",
      why: "Provides stability and predictable income to balance risky equities.",
      example: "Buying a 3-year bank fixed deposit that pays 7% interest annually."
    },
    {
      term: "ETF",
      explain: "Exchange Traded Fund. A basket of securities that tracks an index and is traded live on stock exchanges.",
      why: "Offers index diversification at extremely low annual fees.",
      example: "Buying SBI Nifty 50 ETF to instantly gain exposure to the 50 largest companies in India."
    },
    {
      term: "Mutual Fund",
      explain: "A pooled investment vehicle managed by an asset management company that buys diversified stocks or bonds.",
      why: "Allows easy, automated recurring investing via SIPs without needing a brokerage account.",
      example: "Investing ₹2,000 monthly in a Flexi Cap Mutual Fund via automated bank mandate."
    },
    {
      term: "REIT",
      explain: "Real Estate Investment Trust. A trust that owns rent-yielding commercial properties and distributes 90%+ of net cash flows as dividends.",
      why: "High-yield real estate access starting with low ticket sizes.",
      example: "Embassy Office Parks REIT distributing quarterly rental distributions from commercial tech hubs."
    },
    {
      term: "InvIT",
      explain: "Infrastructure Investment Trust. A trust owning cash-generating national infrastructure (toll roads, power transmission) with high distribution yields.",
      why: "Regular passive distributions, typically yielding 9-11% per year.",
      example: "PowerGrid InvIT distributing returns collected from national electricity transmission fees."
    },
    {
      term: "Corporate Bond",
      explain: "A debt instrument issued by companies to raise capital, offering fixed coupon payments.",
      why: "Higher yields than bank deposits with credit ratings checking default risks.",
      example: "A corporate bond from Tata Capital offering an 8.5% annual coupon interest rate."
    },
    {
      term: "Government Securities",
      explain: "Debt instruments issued by the RBI on behalf of the government, backed by a sovereign guarantee.",
      why: "Safest possible investment in India with zero credit default risk.",
      example: "Investing in a 10-year Central Government Bond paying 7.15% semi-annual interest."
    },
    {
      term: "Returns",
      explain: "The gain or loss generated on an investment over a specific time period.",
      why: "Measures the efficiency and performance of your invested capital.",
      example: "Buying an asset at ₹10,000 and selling it at ₹12,000 yields a 20% return."
    },
    {
      term: "Capital Gain",
      explain: "The profit earned from selling an asset for more than its purchase price.",
      why: "Taxed differently than regular income (STCG vs LTCG).",
      example: "Buying a stock at ₹500 and selling it at ₹800 yields a capital gain of ₹300 per share."
    },
    {
      term: "Dividend",
      explain: "A portion of corporate profits paid directly to shareholders as cash payouts.",
      why: "Provides a regular passive cash flow stream without selling underlying assets.",
      example: "ITC paying ₹15 per share dividend to its equity holders in a year."
    },
    {
      term: "Expense Ratio",
      explain: "The annual operating fee charged by mutual funds or ETFs, deducted from the NAV.",
      why: "High expense ratios eat into compounding returns over decades.",
      example: "A fund with a 1.5% expense ratio means ₹150 of every ₹10,000 is paid to the manager annually."
    },
    {
      term: "Sector Exposure",
      explain: "The proportion of a portfolio invested in specific industries (such as Tech, Finance, Energy).",
      why: "High sector concentration exposes you to industry-wide downturns.",
      example: "Having 60% of your portfolio in IT stocks makes you highly vulnerable to tech sector layoffs."
    },
    {
      term: "Inflation",
      explain: "The rate at which general prices for goods and services rise, eroding currency purchasing power.",
      why: "Your investments must return more than inflation to increase real purchasing power.",
      example: "If inflation is 6%, a ₹100 item will cost ₹106 next year."
    },
    {
      term: "Compounding",
      explain: "Earning interest on interest over time, leading to exponential asset growth.",
      why: "The 'eighth wonder of the world' — rewards patience and early investing.",
      example: "₹1 Lakh compounding at 12% grows to ₹3.1 Lakhs in 10 years, and ₹9.6 Lakhs in 20 years."
    }
  ];

  const PAGES_INFO = [
    {
      id: "Dashboard",
      purpose: "Provide a single source of truth summarizing your complete financial standing.",
      features: "Aggregated Net Worth value, interactive asset allocation charts, core scoring summaries, and recent activity logs.",
      how: "Check daily or weekly to monitor overall portfolio health, asset distributions, and latest timeline updates.",
      why: "Prevents portfolio fragmentation and provides immediate clarity on asset weights."
    },
    {
      id: "Portfolio",
      purpose: "Track and manage your detailed holdings lists.",
      features: "Manual asset entry forms, CSV statement file parser, mock Zerodha/Groww transaction panels.",
      how: "Add holdings manually or upload your consolidated broker statement in CSV format to populate the app.",
      why: "Accurate database holdings drive the entire suite of analysis and AI recommendations."
    },
    {
      id: "Portfolio Intelligence",
      purpose: "Conduct deep algorithmic analysis on your holding structure.",
      features: "Diversified portfolio scorecards, detailed warning tables, sector concentrations, and direct advisor text recommendations.",
      how: "Read the advisory cards to identify dangerous sector overlaps, high fees, or liquidity issues.",
      why: "Exposes hidden structural risks that simple broker tools hide from you."
    },
    {
      id: "Investment Hub",
      purpose: "Discover new assets tailored to your profile.",
      features: "3-question pre-screening quiz, custom suitability matching cards, trending high-yield bonds/G-Secs explorer.",
      how: "Answer the pre-screening quiz to filter opportunities. Click any card to launch simulated buy orders.",
      why: "Filters out market noise and suggests only assets that fit your budget, risk, and goals."
    },
    {
      id: "Learning Center",
      purpose: "Build solid financial literacy and application understanding.",
      features: "Onboarding manual, modular asset classes lessons, interactive MCQ quizzes, and AI deep-links.",
      how: "Read the platform instructions or click asset tabs, pass the module checks, or deep-link concepts to the AI assistant.",
      why: "Educated investors make rational decisions and avoid panic-selling during volatility."
    },
    {
      id: "AI Assistant",
      purpose: "Get plain-language investment advice on demand.",
      features: "Gemini 2.0 Flash chat connection, local rule fallback, conversation history sidebar grouped by date.",
      how: "Type questions about your holdings, tax implications, or rebalancing steps. Click sidebar records to load past chats.",
      why: "Translates complex portfolio data tables into highly personalized, simple, actionable financial advice."
    },
    {
      id: "Profile",
      purpose: "Set up and manage your core investor properties.",
      features: "Onboarding wizard variables viewer (Age, Goal, Capacity, Risk Appetite, Experience).",
      how: "Review settings regularly to ensure your declared data matches your actual financial status.",
      why: "The baseline values used by suitability models to personalize all portfolio recommendations."
    },
    {
      id: "Settings",
      purpose: "Configure application layout and account attributes.",
      features: "Firebase account metadata, color accent themes (Indigo, Emerald, Rose, Amber), notifications, data reset.",
      how: "Switch theme colors or use the Danger Zone reset button to purge database holdings for a fresh start.",
      why: "Puts the user in total control of layout presentation and data purging."
    }
  ];

  const FAQS = [
    {
      q: "How does NIDHI work?",
      a: "NIDHI connects your profile variables (goals, risk) with your imported holdings (stocks, bonds, REITs) in a central Neon database. It runs algorithmic diagnostic formulas to calculate scores, generates advisory insights, and uses Gemini 2.0 Flash to power custom advisory conversations."
    },
    {
      q: "Is my data secure?",
      a: "Yes. User credentials and verification are managed securely by Firebase Auth. Portfolio holding records are saved securely inside your Neon PostgreSQL database. We do not transmit or sell user portfolios to external parties."
    },
    {
      q: "Does AI invest for me?",
      a: "No. NIDHI is an advisory intelligence platform, not an automated fund manager. NIDHI computes suitability and presents recommended options, but you retain full manual control over every trade."
    },
    {
      q: "Why am I redirected to another platform?",
      a: "NIDHI is built for investment intelligence, not brokerage transactions. To execute real orders, we redirect you safely to registered brokerage partners (like Zerodha or Groww) so custody of your funds remains with licensed institutions."
    },
    {
      q: "How are recommendations generated?",
      a: "Recommendations are computed dynamically by crossing your onboarding variables (Age, Goal, Horizon, Risk Appetite) against a curated master database of asset classes. For example, conservative investors are matched with G-Secs, while aggressive profiles are recommended equity mutual funds."
    },
    {
      q: "What is Portfolio Health Score?",
      a: "It is an algorithmic score between 1 and 100 representing the quality of your portfolio's asset mix, sector spread, liquidity buffers, and alignment with your risk profile. A higher score means better risk hedging."
    },
    {
      q: "Can I connect multiple brokers?",
      a: "Yes. Because NIDHI uses unified CSV statement importing, you can upload holdings from Zerodha, Groww, or any platform simultaneously. The system will merge them into a single consolidated portfolio list."
    },
    {
      q: "Can I delete my account or reset my portfolio?",
      a: "Yes. Go to the Settings page and select the 'Danger Zone' tab. You can clear all imported holdings and reset your profile parameters, or delete your Firebase account permanently."
    }
  ];

  // Filter glossary based on query
  const filteredGlossary = GLOSSARY_TERMS.filter(item => 
    item.term.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
    item.explain.toLowerCase().includes(glossaryQuery.toLowerCase())
  );

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
        <div className="md:col-span-1 space-y-4">
          <div className="space-y-1">
            <button
              onClick={() => {
                setIsNidhiActive(true);
                resetQuiz();
              }}
              className={`w-full text-left flex items-center gap-2 px-3.5 py-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                isNidhiActive
                  ? "bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm"
                  : "bg-zinc-900 border-zinc-900/60 text-zinc-400 hover:text-zinc-250 hover:bg-zinc-850/50"
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>📘 Learn About NIDHI</span>
            </button>
          </div>

          <div className="border-t border-zinc-850 my-1" />

          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 px-2.5">Asset Categories</p>
            <div className="space-y-1">
              {TOPICS.map(topic => {
                const isSelected = !isNidhiActive && activeTopic.id === topic.id;
                const isDone = completedTopics[topic.id];
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setIsNidhiActive(false);
                      handleSelectTopic(topic);
                    }}
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
        </div>

        {/* Right topic detail module */}
        <div className="md:col-span-3 space-y-6 animate-fade-in">
          {isNidhiActive ? (
            /* =================================================================
               📘 Learn About NIDHI: Platform Guide & Knowledge Hub
               ================================================================= */
            <div className="space-y-6">
              {/* Internal topic switcher cards */}
              <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-6 space-y-6">
                <div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-950 text-indigo-400 border border-indigo-900/30 uppercase">
                    NIDHI Manual
                  </span>
                  <h2 className="text-lg font-bold text-zinc-100 mt-2">📘 Learn About NIDHI</h2>
                  <p className="text-zinc-400 text-xs mt-1">
                    Select a section below to understand platform mechanics, core financial scores, AI engines, and glossary terms.
                  </p>
                </div>

                {/* Grid of 10 topic selector tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {NIDHI_SECTIONS.map((sec) => {
                    const isSecSelected = activeNidhiSection === sec.id;
                    const SecIcon = sec.icon;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveNidhiSection(sec.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer ${
                          isSecSelected
                            ? "bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm"
                            : "bg-zinc-950/60 border-zinc-850 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
                        }`}
                      >
                        <SecIcon className={`w-4 h-4 mb-1.5 ${isSecSelected ? "text-indigo-400" : "text-zinc-500"}`} />
                        <span className="text-[10px] font-bold leading-tight truncate w-full">{sec.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Content Display */}
              <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-6 space-y-6 shadow-sm">
                
                {/* 1. Welcome to NIDHI */}
                {activeNidhiSection === "welcome" && (
                  <div className="space-y-5">
                    <div className="border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-sm font-bold text-zinc-100">Welcome to NIDHI</h3>
                    </div>
                    <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
                      <div className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-4 space-y-2">
                        <h4 className="font-bold text-zinc-100 text-xs">👁️ Our Vision</h4>
                        <p>Democratize institutional-grade portfolio intelligence for Indian retail investors, guiding them through a complex financial landscape with absolute transparency and software automation.</p>
                      </div>
                      <div className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-4 space-y-2">
                        <h4 className="font-bold text-zinc-100 text-xs">⚖️ Core Philosophy</h4>
                        <p><strong>Understand the investor first, recommend investments second.</strong> NIDHI operates on profile-aligned recommendations. We do not sell mutual funds, take commissions, or push generic transaction incentives.</p>
                      </div>
                      <div className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-4 space-y-2">
                        <h4 className="font-bold text-zinc-100 text-xs">💼 How NIDHI Helps You</h4>
                        <p>Aggregates fragmented broker holdings, evaluates portfolio risk profiles, generates plain-language advisory commentary, and suggests rebalancing strategies to improve long-term returns.</p>
                      </div>
                      <div className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-4 space-y-2">
                        <h4 className="font-bold text-zinc-100 text-xs">❓ Why NIDHI Exists</h4>
                        <p>Indian retail investors are constantly exposed to biased market tips, fragmented broker statements, and opaque fund charges. NIDHI provides an unbiased, algorithmic copilot that reads your specific profile and answers clearly.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Getting Started */}
                {activeNidhiSection === "started" && (
                  <div className="space-y-5">
                    <div className="border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-sm font-bold text-zinc-100">Getting Started</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: "1. Create Your Account", desc: "Sign up on the authentication screen using your personal email and a secure password. A verification check helps secure your credentials." },
                        { title: "2. Verify Your Email", desc: "A mock verification step demonstrates how email confirmation safeguards your account logs from unauthorized access." },
                        { title: "3. Complete Your Onboarding Profile", desc: "Walk through the onboarding questionnaire to declare your age, monthly investment capacity, experience, and primary financial targets." },
                        { title: "4. Risk Assessment", desc: "Based on your onboarding questionnaire, our engine maps your suitability profile to Conservative, Moderate, or Aggressive risk tiers." },
                        { title: "5. Setting Investment Goals", desc: "Choose specific targets like Wealth Creation, Tax Saving, Passive Income, or Capital Preservation to dictate AI analysis targets." }
                      ].map((step, idx) => (
                        <div key={idx} className="flex gap-4 items-start bg-zinc-950/50 border border-zinc-850 rounded-lg p-4">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-950/80 border border-indigo-900/50 text-indigo-400 font-bold text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-zinc-200">{step.title}</h4>
                            <p className="text-zinc-400 text-xs leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Understanding the Dashboard */}
                {activeNidhiSection === "dashboard" && (
                  <div className="space-y-5">
                    <div className="border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-sm font-bold text-zinc-100">Understanding the Dashboard</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: "Net Worth Banner", desc: "Displays the combined valuation of all your assets calculated against live prices. Updated automatically on edits." },
                        { title: "Asset Allocation Pie Chart", desc: "Visual percentage allocation across Equity, Fixed Income, and Alternatives, helping you balance macro targets." },
                        { title: "Portfolio Health Score", desc: "A 1-100 metric calculated from structural variables including diversification depth and asset suitability." },
                        { title: "Risk Rating Card", desc: "Shows your calculated risk level (Low, Moderate, High) and checks if it matches your onboarding profile configuration." },
                        { title: "Diversification Card", desc: "Gives a qualitative rating (Low, Moderate, High) indicating how well-spread your capital is across sectors." },
                        { title: "Sector Exposure Bar Chart", desc: "Identifies your sector concentrations (e.g. IT, Finance, Real Estate), flagging dangerous overlaps." },
                        { title: "Liquidity Status Ring", desc: "Computes the exact percentage of your investments convertible to cash within T+2 days." },
                        { title: "Performance Line Chart", desc: "Tracks cost basis vs current valuation over time to monitor absolute capital gains." },
                        { title: "Portfolio Timeline", desc: "Audit logs showing your transactions, CSV imports, and historical milestones." }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-lg space-y-1">
                          <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            {item.title}
                          </h4>
                          <p className="text-zinc-400 text-[11px] leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Understanding Every Page */}
                {activeNidhiSection === "pages" && (
                  <div className="space-y-5">
                    <div className="border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-sm font-bold text-zinc-100">Understanding Every Page</h3>
                    </div>
                    <div className="space-y-3">
                      {PAGES_INFO.map((page) => {
                        const isExpanded = expandedPage === page.id;
                        return (
                          <div key={page.id} className="border border-zinc-850 rounded-lg overflow-hidden bg-zinc-950/30">
                            <button
                              onClick={() => setExpandedPage(isExpanded ? null : page.id)}
                              className="w-full flex justify-between items-center p-4 text-left hover:bg-zinc-950/50 transition-colors cursor-pointer"
                            >
                              <span className="text-xs font-bold text-zinc-200">{page.id}</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                            </button>
                            {isExpanded && (
                              <div className="p-4 pt-0 border-t border-zinc-850/50 bg-zinc-950/60 space-y-3 text-xs leading-relaxed">
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-zinc-500">Purpose</span>
                                  <p className="text-zinc-350 mt-0.5">{page.purpose}</p>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-zinc-500">Key Features</span>
                                  <p className="text-zinc-350 mt-0.5">{page.features}</p>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-zinc-500">How to use it</span>
                                  <p className="text-zinc-350 mt-0.5">{page.how}</p>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-zinc-500">Why it matters</span>
                                  <p className="text-indigo-400/90 font-medium mt-0.5">{page.why}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. Financial Terms Glossary */}
                {activeNidhiSection === "glossary" && (
                  <div className="space-y-5">
                    <div className="border-b border-zinc-850 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-sm font-bold text-zinc-100">Financial Terms Glossary</h3>
                      </div>
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={glossaryQuery}
                          onChange={(e) => setGlossaryQuery(e.target.value)}
                          placeholder="Search 22 terms..."
                          className="bg-zinc-950 border border-zinc-850 rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-full sm:w-48"
                        />
                      </div>
                    </div>

                    {filteredGlossary.length === 0 ? (
                      <div className="text-center py-8 text-xs text-zinc-500">No glossary terms matched your search.</div>
                    ) : (
                      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredGlossary.map((item) => {
                          const isTermExpanded = expandedTerm === item.term;
                          return (
                            <div key={item.term} className="border border-zinc-850 rounded-lg bg-zinc-950/20">
                              <button
                                onClick={() => setExpandedTerm(isTermExpanded ? null : item.term)}
                                className="w-full flex justify-between items-center p-3 text-left hover:bg-zinc-950/40 transition-colors cursor-pointer"
                              >
                                <span className="text-xs font-bold text-zinc-250">{item.term}</span>
                                {isTermExpanded ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                              </button>
                              {isTermExpanded && (
                                <div className="p-3 pt-0 border-t border-zinc-850/50 bg-zinc-950/50 space-y-2.5 text-[11px] leading-relaxed">
                                  <div>
                                    <span className="text-[9px] uppercase font-bold text-zinc-500 block">Explanation</span>
                                    <p className="text-zinc-300 mt-0.5">{item.explain}</p>
                                  </div>
                                  <div>
                                    <span className="text-[9px] uppercase font-bold text-zinc-500 block">Why it matters</span>
                                    <p className="text-zinc-300 mt-0.5">{item.why}</p>
                                  </div>
                                  <div className="bg-zinc-900/50 p-2 rounded border border-zinc-850/30">
                                    <span className="text-[9px] uppercase font-bold text-indigo-400 block">Real-life Example</span>
                                    <p className="text-zinc-350 mt-0.5 italic">"{item.example}"</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. Understanding NIDHI Scores */}
                {activeNidhiSection === "scores" && (
                  <div className="space-y-5">
                    <div className="border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-sm font-bold text-zinc-100">Understanding NIDHI Scores</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Portfolio Health Score",
                          calc: "Computed dynamically on the backend based on diversification balance, risk-profile alignment, expense ratios, and cash cushion safety reserves.",
                          good: "A score above 75. It signifies your portfolio is highly optimized and resilient against market corrections.",
                          improve: "Maintain holdings across at least 3 distinct asset classes, trim overweight sectors, and clear redundant mutual fund holdings."
                        },
                        {
                          name: "Risk Score / Risk Rating",
                          calc: "Aggregated average of asset beta/volatility rankings multiplied by active holdings value weights. Stock/ETFs count as high volatility; G-Secs/Bonds count as low volatility.",
                          good: "Direct alignment with your onboarding profile. For a Conservative investor, a low score is 'good'; for an Aggressive investor, a high score is expected.",
                          improve: "Balance equity weights by shifting capital to sovereign G-Secs or AAA corporate bonds to lower volatility rating."
                        },
                        {
                          name: "Diversification Score",
                          calc: "Calculated using portfolio concentration algorithms. Evaluates individual asset allocation weights and sector overlap risks.",
                          good: "A score above 70. This ensures your capital is not over-concentrated in a single stock or sector.",
                          improve: "Spread stock investments across multiple sectors. Keep any single sector concentration below 25% of your total net worth."
                        },
                        {
                          name: "Liquidity Score",
                          calc: "Evaluates the proportion of assets that can be redeemed and settled within T+1 or T+2 market days (e.g. equities, ETFs, cash, liquid funds).",
                          good: "A score above 50%, guaranteeing access to quick capital for emergency withdrawals.",
                          improve: "Redirect a portion of fixed-income holdings into liquid mutual funds or exchange-traded index ETFs."
                        }
                      ].map((scoreInfo) => (
                        <div key={scoreInfo.name} className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-4 space-y-3">
                          <h4 className="text-xs font-bold text-indigo-400">{scoreInfo.name}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] leading-relaxed text-zinc-300">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-zinc-500">Calculation</span>
                              <p className="mt-0.5">{scoreInfo.calc}</p>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-bold text-zinc-500">What Good Means</span>
                              <p className="mt-0.5">{scoreInfo.good}</p>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-bold text-zinc-500">How to Improve</span>
                              <p className="mt-0.5 text-zinc-250">{scoreInfo.improve}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. AI Features */}
                {activeNidhiSection === "ai" && (
                  <div className="space-y-5">
                    <div className="border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-sm font-bold text-zinc-100">AI Features & Engine Details</h3>
                    </div>
                    <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-4 space-y-2">
                          <h4 className="font-bold text-zinc-200 text-xs">📊 Portfolio Intelligence</h4>
                          <p>Algorithmic calculation module that reviews holdings metadata and calculates core metrics (health, diversification, liquidity) automatically without human bias.</p>
                        </div>
                        <div className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-4 space-y-2">
                          <h4 className="font-bold text-zinc-200 text-xs">🎯 Suitability Engine</h4>
                          <p>A rule-based mathematical matrix that evaluates age, goals, risk appetite, and investment horizons to create personalized asset class weighting recommendations.</p>
                        </div>
                      </div>

                      <div className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-4 space-y-3">
                        <h4 className="font-bold text-zinc-200 text-xs">🤖 Gemini 2.0 Flash Assistant</h4>
                        <p>A context-aware chat interface. Whenever you send a message, NIDHI compiles your current holdings, profile variables, and chat history into a rich system prompt, allowing the LLM to give highly specific, non-generic advice.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-850 pt-4">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-emerald-400">What NIDHI Analyzes</span>
                          <ul className="list-disc pl-4 mt-1.5 space-y-1 text-zinc-400 text-[11px]">
                            <li>Aggregated asset distributions</li>
                            <li>Profit and loss ratios per holding</li>
                            <li>Age, savings capacity, and horizon variables</li>
                            <li>Sector concentration overlap profiles</li>
                          </ul>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-rose-400">What NIDHI does NOT do</span>
                          <ul className="list-disc pl-4 mt-1.5 space-y-1 text-zinc-400 text-[11px]">
                            <li>NIDHI does not execute real transaction custody</li>
                            <li>Does not auto-trade or move capital</li>
                            <li>Does not guarantee future market returns</li>
                            <li>Does not provide absolute tax declarations</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. Investment Partners */}
                {activeNidhiSection === "partners" && (
                  <div className="space-y-5">
                    <div className="border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-sm font-bold text-zinc-100">Brokerage & Investment Partners</h3>
                    </div>
                    <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
                      <p>
                        NIDHI is purely an **investor intelligence platform** designed to provide analytics, suitability matching, and advisory tracking. We do not manage brokerage accounts or direct transaction custody.
                      </p>
                      <div className="bg-zinc-950/50 border border-zinc-850 rounded-lg p-4 space-y-2">
                        <h4 className="font-bold text-zinc-200 text-xs">🔄 Secure Redirection Flow</h4>
                        <p>
                          When you decide to purchase a recommended asset (e.g. SBI Nifty 50 ETF), NIDHI launches a partner transaction drawer. Clicking "Confirm Transaction" redirects you securely to registered partner platforms like **Zerodha** or **Groww** to execute the actual trade.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-zinc-950/30 border border-zinc-850/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-zinc-200 text-[11px]">Why this is safer:</h5>
                          <p className="text-zinc-450 text-[11px] mt-1">Your investment capital and asset ownership remain protected inside SEBI-registered depositories (CDSL/NSDL). NIDHI never sees or holds your cash balance.</p>
                        </div>
                        <div className="bg-zinc-950/30 border border-zinc-850/50 p-4 rounded-lg">
                          <h5 className="font-semibold text-zinc-200 text-[11px]">Regulatory Compliance:</h5>
                          <p className="text-zinc-450 text-[11px] mt-1">Redirection aligns with Indian regulatory standards. By keeping advisory separate from transaction execution, NIDHI complies with strict SEBI code rules.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. Privacy & Security */}
                {activeNidhiSection === "privacy" && (
                  <div className="space-y-5">
                    <div className="border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-sm font-bold text-zinc-100">Privacy & Security Standards</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: "🔒 Firebase Authentication", desc: "User login, password encryption, and authorization checks are handled directly by Firebase SDK. NIDHI never stores raw passwords." },
                        { title: "📧 Email Verification", desc: "Checks user verification parameters to ensure only valid email owners can access dashboard intelligence profiles." },
                        { title: "⚡ PostgreSQL Neon DB", desc: "All holdings, profile targets, and metadata are saved inside a secure, encrypted Neon database instance with SSL active." },
                        { title: "🛡️ Private Storage Sandbox", desc: "AI chat histories are saved locally inside your browser's localStorage sandboxed by Firebase User UID, completely invisible to other users." }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-zinc-950/50 border border-zinc-850 p-4 rounded-lg space-y-1">
                          <h4 className="text-xs font-bold text-zinc-200">{item.title}</h4>
                          <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10. FAQs */}
                {activeNidhiSection === "faq" && (
                  <div className="space-y-5">
                    <div className="border-b border-zinc-850 pb-3 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-sm font-bold text-zinc-100">Frequently Asked Questions</h3>
                    </div>
                    <div className="space-y-3">
                      {FAQS.map((faq, idx) => {
                        const isFaqExpanded = expandedFaq === idx;
                        return (
                          <div key={idx} className="border border-zinc-850 rounded-lg overflow-hidden bg-zinc-950/30">
                            <button
                              onClick={() => setExpandedFaq(isFaqExpanded ? null : idx)}
                              className="w-full flex justify-between items-center p-4 text-left hover:bg-zinc-950/50 transition-colors cursor-pointer"
                            >
                              <span className="text-xs font-semibold text-zinc-200">{faq.q}</span>
                              {isFaqExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                            </button>
                            {isFaqExpanded && (
                              <div className="p-4 pt-0 border-t border-zinc-850/50 bg-zinc-950/60 text-zinc-400 text-xs leading-relaxed">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            /* =================================================================
               Asset Category Detail & Quiz (Original Learning Content)
               ================================================================= */
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
