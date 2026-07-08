import os
from pathlib import Path
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
from fastapi import APIRouter
from app.schemas.chat import ChatRequestSchema, ChatResponseSchema

# Load .env from project root so GEMINI_API_KEY is available
_env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=_env_path, override=True)

router = APIRouter(prefix="/chat", tags=["Chat"])

# ─────────────────────────────────────────────────────────────────────────────
# Gemini LLM setup — uses the new google.genai SDK
# ─────────────────────────────────────────────────────────────────────────────
_gemini_client = None
_gemini_model_name = "gemini-2.0-flash"

try:
    from google import genai
    # pyrefly: ignore [missing-import]
    from google.genai import types as genai_types
    _api_key = os.environ.get("GEMINI_API_KEY", "")
    if _api_key:
        _gemini_client = genai.Client(api_key=_api_key)
        print(f"[NIDHI] Gemini AI connected via google.genai SDK ({_gemini_model_name})")
    else:
        print("[NIDHI] GEMINI_API_KEY not set — using local fallback engine")
except ImportError:
    print("[NIDHI] google-genai not installed — using local fallback engine")


# ─────────────────────────────────────────────────────────────────────────────
# System prompt builder — injects live portfolio + profile context
# ─────────────────────────────────────────────────────────────────────────────
def _build_system_prompt(holdings, profile) -> str:
    total_val = sum(h.quantity * h.currentPrice for h in holdings)
    eq_val  = sum(h.quantity * h.currentPrice for h in holdings if h.type in ["Stock", "ETF", "Mutual Fund"])
    debt_val = sum(h.quantity * h.currentPrice for h in holdings if h.type in ["Bond", "Govt Security", "Liquid Fund"])
    reit_val = sum(h.quantity * h.currentPrice for h in holdings if h.type in ["REIT", "InvIT"])

    eq_pct   = round(eq_val  / total_val * 100, 1) if total_val > 0 else 0
    debt_pct = round(debt_val / total_val * 100, 1) if total_val > 0 else 0
    reit_pct = round(reit_val / total_val * 100, 1) if total_val > 0 else 0

    holding_lines = "\n".join(
        f"  - {h.name} ({h.type}): {h.quantity} units @ ₹{h.currentPrice:.2f} "
        f"= ₹{h.quantity * h.currentPrice:,.2f} "
        f"[Avg cost ₹{h.avgPrice:.2f}, P&L: {'▲' if h.currentPrice >= h.avgPrice else '▼'}"
        f"₹{abs((h.currentPrice - h.avgPrice) * h.quantity):,.2f}]"
        for h in holdings
    ) if holdings else "  (No holdings imported yet)"

    profile_block = ""
    if profile:
        profile_block = f"""
INVESTOR PROFILE:
  - Name: {profile.fullName}
  - Age: {profile.age}
  - Occupation: {profile.occupation}
  - Annual Income: {profile.annualIncome}
  - Investment Experience: {profile.experience}
  - Primary Goal: {profile.goal}
  - Investment Horizon: {profile.horizon}
  - Monthly Investment Capacity: ₹{profile.capacity:,.0f}
  - Risk Appetite: {profile.riskAppetite}
"""
    else:
        profile_block = "\nINVESTOR PROFILE: Not yet configured (user has not completed onboarding)."

    return f"""You are NIDHI — an expert AI Financial Advisor for retail investors in India.
You are embedded inside the NIDHI Investor Super App. You have real-time access to the user's complete portfolio and investor profile. Use this data actively in every response.

YOUR EXPERTISE COVERS:
- Indian equity markets (NSE/BSE), Nifty, Sensex, sectoral indices
- Mutual Funds: ELSS, Flexi Cap, Large Cap, Index Funds, Liquid Funds
- ETFs: Index trackers, Gold ETFs, International ETFs
- Fixed Income: G-Secs, T-Bills, Corporate Bonds, NCDs, Fixed Deposits
- Real Assets: REITs (Embassy, Mindspace, Nexus), InvITs (PowerGrid, IRB, IndiGrid)
- Tax planning: LTCG, STCG, indexation benefits, 80C, 80D, ELSS
- Portfolio theory: Modern Portfolio Theory, Sharpe ratio, diversification, rebalancing
- SIP strategies, goal-based investing, retirement planning
- Indian market regulations: SEBI, RBI, AMFI guidelines

LIVE PORTFOLIO DATA:
  Total Value: ₹{total_val:,.2f}
  Asset Allocation: Equity {eq_pct}% | Fixed Income {debt_pct}% | Alternatives {reit_pct}%

HOLDINGS:
{holding_lines}
{profile_block}

RESPONSE RULES:
1. Always use the actual portfolio numbers above in your analysis — never give generic advice.
2. Be specific: name the actual holdings, quote exact percentages, and cite real P&L figures.
3. If the user asks about a specific stock/fund not in their portfolio, give an informed opinion on whether they should add it given their profile.
4. Offer concrete, actionable steps (e.g., "Sell 20% of X and move to Y because...").
5. Use markdown: **bold** for key terms, bullet points for lists, and ₹ for all currency.
6. Keep responses concise but complete — around 150-300 words unless the question requires depth.
7. Never repeat yourself across turns — the conversation history is provided, build on it.
8. If a question is completely outside finance/investing, politely redirect: "I'm specialized in investment analysis — let me help you with your portfolio instead."
9. Proactively offer related insights the user didn't ask for but would benefit from (e.g., if asked about risk, also mention the specific rebalancing trade they should make).
10. Always end with one targeted follow-up question to keep the conversation productive.
"""


# ─────────────────────────────────────────────────────────────────────────────
# Local fallback engine — significantly improved keyword matching
# ─────────────────────────────────────────────────────────────────────────────
def _local_fallback(user_query: str, holdings, profile) -> str:
    q = user_query.lower().strip()
    total_val = sum(h.quantity * h.currentPrice for h in holdings)
    eq_val = sum(h.quantity * h.currentPrice for h in holdings if h.type in ["Stock", "ETF", "Mutual Fund"])
    debt_val = sum(h.quantity * h.currentPrice for h in holdings if h.type in ["Bond", "Govt Security", "Liquid Fund"])
    reit_val = sum(h.quantity * h.currentPrice for h in holdings if h.type in ["REIT", "InvIT"])
    eq_pct   = round(eq_val   / total_val * 100, 1) if total_val > 0 else 0
    debt_pct = round(debt_val / total_val * 100, 1) if total_val > 0 else 0
    reit_pct = round(reit_val / total_val * 100, 1) if total_val > 0 else 0

    risk = profile.riskAppetite if profile else "Moderate"
    goal = profile.goal if profile else "Wealth Creation"
    horizon = profile.horizon if profile else "Medium Term"
    capacity = profile.capacity if profile else 0
    n = len(holdings)

    # Compute P&L per holding
    top_gainer = max(holdings, key=lambda h: (h.currentPrice - h.avgPrice) / h.avgPrice, default=None) if holdings else None
    top_loser  = min(holdings, key=lambda h: (h.currentPrice - h.avgPrice) / h.avgPrice, default=None) if holdings else None

    holding_names = [h.name for h in holdings]
    summary = ", ".join(holding_names[:3]) + (f" + {n - 3} more" if n > 3 else "")

    total_cost = sum(h.quantity * h.avgPrice for h in holdings)
    total_pnl = total_val - total_cost
    pnl_pct = round(total_pnl / total_cost * 100, 2) if total_cost > 0 else 0

    # ── Portfolio overview / summary ──────────────────────────────────────────
    if any(x in q for x in ["portfolio", "overview", "summary", "how am i doing", "how is my"]):
        if total_val == 0:
            return "Your portfolio is empty — no holdings imported yet. Head to the **Portfolio** page to add assets manually or upload a CSV file."
        pl_sign = "▲" if total_pnl >= 0 else "▼"
        response = (
            f"Here is your portfolio snapshot:\n\n"
            f"* **Total Value**: ₹{total_val:,.2f}\n"
            f"* **Total Invested**: ₹{total_cost:,.2f}\n"
            f"* **Overall P&L**: {pl_sign} ₹{abs(total_pnl):,.2f} ({'+' if pnl_pct >= 0 else ''}{pnl_pct}%)\n"
            f"* **Holdings**: {n} assets — {summary}\n"
            f"* **Allocation**: Equity {eq_pct}% | Debt {debt_pct}% | Alternatives {reit_pct}%\n\n"
        )
        if top_gainer:
            gainer_pct = round((top_gainer.currentPrice - top_gainer.avgPrice) / top_gainer.avgPrice * 100, 1)
            response += f"**Best performer**: {top_gainer.name} (+{gainer_pct}%)\n"
        if top_loser and top_loser != top_gainer:
            loser_pct = round((top_loser.currentPrice - top_loser.avgPrice) / top_loser.avgPrice * 100, 1)
            response += f"**Worst performer**: {top_loser.name} ({loser_pct}%)\n"
        response += f"\nYour declared goal is **{goal}** with a **{risk}** risk appetite. Would you like a deeper risk analysis or rebalancing suggestions?"
        return response

    # ── Risk analysis ──────────────────────────────────────────────────────────
    if any(x in q for x in ["risk", "risky", "danger", "volatile", "volatility"]):
        if total_val == 0:
            return "Your portfolio has no holdings — add assets first to get a risk analysis."
        alignment = "well-aligned" if (
            (risk == "Aggressive" and eq_pct > 60) or
            (risk == "Conservative" and debt_pct > 60) or
            (risk == "Moderate" and 30 <= eq_pct <= 70)
        ) else "misaligned"
        resp = (
            f"**Risk Analysis** for your ₹{total_val:,.2f} portfolio:\n\n"
            f"* **Equity ({eq_pct}%)** — High growth, high volatility. Holdings: {', '.join(h.name for h in holdings if h.type in ['Stock','ETF','Mutual Fund']) or 'None'}\n"
            f"* **Fixed Income ({debt_pct}%)** — Capital preservation, low volatility.\n"
            f"* **Alternatives ({reit_pct}%)** — Non-correlated rental/infra yields.\n\n"
            f"Your allocation is **{alignment}** with your **{risk}** risk profile.\n"
        )
        if risk == "Conservative" and eq_pct > 50:
            resp += "\n⚠️ **Action needed**: Equity exposure is too high for a Conservative profile. Consider shifting ₹{:,.0f} into G-Secs or AAA bonds.".format(total_val * 0.25)
        elif risk == "Aggressive" and eq_pct < 50:
            resp += "\n⚠️ **Action needed**: For an Aggressive profile, your equity allocation is low. Consider adding index ETFs to boost growth potential."
        resp += "\n\nWould you like specific rebalancing trades to fix this?"
        return resp

    # ── P&L / returns ────────────────────────────────────────────────────────
    if any(x in q for x in ["profit", "loss", "return", "p&l", "pnl", "gain", "performance"]):
        if not holdings:
            return "No holdings found. Import your portfolio to track P&L."
        lines = []
        for h in sorted(holdings, key=lambda x: (x.currentPrice - x.avgPrice) / x.avgPrice, reverse=True):
            pct = round((h.currentPrice - h.avgPrice) / h.avgPrice * 100, 2)
            pnl = round((h.currentPrice - h.avgPrice) * h.quantity, 2)
            sign = "▲" if pnl >= 0 else "▼"
            lines.append(f"  - **{h.name}**: {sign} ₹{abs(pnl):,.2f} ({'+' if pct >= 0 else ''}{pct}%)")
        pl_sign = "▲" if total_pnl >= 0 else "▼"
        return (
            f"**P&L Breakdown** (sorted best to worst):\n\n" +
            "\n".join(lines) +
            f"\n\n**Total Portfolio P&L**: {pl_sign} ₹{abs(total_pnl):,.2f} ({'+' if pnl_pct >= 0 else ''}{pnl_pct}%)\n\n"
            f"Would you like tax optimization advice on your gains?"
        )

    # ── SIP / investment amount ───────────────────────────────────────────────
    if any(x in q for x in ["sip", "how much", "invest per month", "monthly", "capacity"]):
        if capacity > 0:
            equity_sip = round(capacity * 0.6) if risk == "Aggressive" else round(capacity * 0.4) if risk == "Conservative" else round(capacity * 0.5)
            debt_sip = capacity - equity_sip
            return (
                f"Based on your monthly capacity of **₹{capacity:,.0f}** and **{risk}** risk profile:\n\n"
                f"* **Equity SIPs** (₹{equity_sip:,.0f}/month): Split across Parag Parikh Flexi Cap + SBI Nifty 50 ETF\n"
                f"* **Debt/Liquid** (₹{debt_sip:,.0f}/month): HDFC Liquid Fund for emergency reserves or short-term goals\n\n"
                f"For your **{goal}** goal with a **{horizon}** horizon, this allocation builds a disciplined compounding machine.\n\n"
                f"Should I calculate how much corpus this SIP plan will generate over your investment horizon?"
            )
        return "Complete your investor profile (via Onboarding) to get a personalized SIP plan based on your declared monthly capacity."

    # ── Specific holding question ─────────────────────────────────────────────
    for h in holdings:
        if h.name.lower() in q or any(word in q for word in h.name.lower().split()):
            pct = round((h.currentPrice - h.avgPrice) / h.avgPrice * 100, 2)
            pnl = round((h.currentPrice - h.avgPrice) * h.quantity, 2)
            weight = round(h.quantity * h.currentPrice / total_val * 100, 1) if total_val > 0 else 0
            return (
                f"**{h.name}** ({h.type}) — Deep Dive:\n\n"
                f"* **Units**: {h.quantity}\n"
                f"* **Avg Buy Price**: ₹{h.avgPrice:,.2f}\n"
                f"* **Current Price**: ₹{h.currentPrice:,.2f}\n"
                f"* **Current Value**: ₹{h.quantity * h.currentPrice:,.2f}\n"
                f"* **P&L**: {'▲' if pnl >= 0 else '▼'} ₹{abs(pnl):,.2f} ({'+' if pct >= 0 else ''}{pct}%)\n"
                f"* **Portfolio Weight**: {weight}%\n\n"
                f"Source: {h.source}\n\n"
                f"Would you like to know if this holding fits your **{risk}** risk profile and **{goal}** goal?"
            )

    # ── REITs / InvITs ────────────────────────────────────────────────────────
    if any(x in q for x in ["reit", "invit", "real estate", "infrastructure trust"]):
        reit_holdings = [h for h in holdings if h.type in ["REIT", "InvIT"]]
        resp = (
            "**REITs & InvITs** — India's yield instruments:\n\n"
            "* **REITs** own Grade-A office/retail properties, distributing 90%+ of rental income (~7-8% yield)\n"
            "* **InvITs** own highways, power lines, gas pipelines, distributing 90%+ of cash flows (~9-11% yield)\n"
            "* Both are listed on NSE/BSE, providing liquidity unlike physical real estate\n"
            "* Low correlation with equity markets — ideal for portfolio stabilization\n\n"
        )
        if reit_holdings:
            resp += f"You hold: {', '.join(h.name for h in reit_holdings)} ({reit_pct}% of your portfolio).\n\n"
            resp += "This is a solid alternative income layer. Would you like to optimize allocation or explore more options?"
        else:
            resp += f"You have **zero** alternative exposure. For a **{risk}** profile targeting **{goal}**, adding Embassy REIT or PowerGrid InvIT would add non-correlated yield.\n\nShould I check the Smart Investment Hub for a suitable REIT recommendation?"
        return resp

    # ── Diversification ───────────────────────────────────────────────────────
    if any(x in q for x in ["diversif", "spread", "concentrated", "sectors", "allocation"]):
        if n == 0:
            return "No holdings found. Import your portfolio to analyze diversification."
        types = {}
        for h in holdings:
            types[h.type] = types.get(h.type, 0) + h.quantity * h.currentPrice
        type_breakdown = "\n".join(f"  - {t}: ₹{v:,.2f} ({round(v/total_val*100,1)}%)" for t, v in sorted(types.items(), key=lambda x: -x[1]))
        resp = (
            f"**Diversification Analysis** — {n} holdings across {len(types)} asset classes:\n\n"
            f"{type_breakdown}\n\n"
        )
        if len(types) < 3:
            resp += f"⚠️ **Low diversification** — you're only in {len(types)} asset class(es). Add Fixed Income or Alternatives to reduce unsystematic risk.\n"
        elif eq_pct > 80:
            resp += "⚠️ **Equity-heavy** — over 80% in growth assets. A market correction could draw down your portfolio significantly.\n"
        else:
            resp += "✅ Your portfolio spans multiple asset classes, providing good risk spread.\n"
        resp += "\nWould you like a specific rebalancing plan?"
        return resp

    # ── Tax / LTCG / STCG ────────────────────────────────────────────────────
    if any(x in q for x in ["tax", "ltcg", "stcg", "capital gain", "80c", "elss"]):
        return (
            "**Tax Considerations for your portfolio**:\n\n"
            "**Equity (Stocks, ETFs, Equity MFs)**:\n"
            "* STCG (held < 1 year): 20% flat tax\n"
            "* LTCG (held > 1 year): 12.5% on gains above ₹1.25 lakh/year (no indexation)\n\n"
            "**Debt (Bonds, G-Secs, Debt MFs)**:\n"
            "* Taxed at your income slab rate (no special rate regardless of holding period, post-2023)\n\n"
            "**REITs/InvITs**:\n"
            "* Interest/dividend components taxed at slab rate; capital gains follow equity rules\n\n"
            "**Tax-saving**:\n"
            "* ELSS Mutual Funds qualify for ₹1.5L deduction under Section 80C (3-year lock-in)\n"
            "* Harvest LTCG up to ₹1.25L annually to reset cost basis tax-free\n\n"
            "Do you want me to analyze which of your current holdings have LTCG-eligible gains you could harvest this financial year?"
        )

    # ── Rebalancing ───────────────────────────────────────────────────────────
    if any(x in q for x in ["rebalance", "rebalancing", "reduce risk", "fix my portfolio", "what should i sell", "what should i buy"]):
        if not holdings:
            return "Import your portfolio first so I can suggest specific rebalancing trades."
        target_eq = 70 if risk == "Aggressive" else 40 if risk == "Conservative" else 55
        target_debt = 15 if risk == "Aggressive" else 45 if risk == "Conservative" else 30
        target_reit = 15
        resp = (
            f"**Rebalancing Plan** for your **{risk}** profile:\n\n"
            f"| Asset Class | Current | Target | Action |\n"
            f"|------------|---------|--------|--------|\n"
            f"| Equity | {eq_pct}% | {target_eq}% | {'Increase ↑' if eq_pct < target_eq else 'Reduce ↓' if eq_pct > target_eq else 'On target ✅'} |\n"
            f"| Fixed Income | {debt_pct}% | {target_debt}% | {'Increase ↑' if debt_pct < target_debt else 'Reduce ↓' if debt_pct > target_debt else 'On target ✅'} |\n"
            f"| Alternatives | {reit_pct}% | {target_reit}% | {'Increase ↑' if reit_pct < target_reit else 'Reduce ↓' if reit_pct > target_reit else 'On target ✅'} |\n\n"
            f"To execute: route new SIP contributions toward underweight classes rather than selling existing assets (avoids triggering capital gains).\n\n"
            f"Would you like specific fund recommendations for the underweight categories?"
        )
        return resp

    # ── Market crash / correction ─────────────────────────────────────────────
    if any(x in q for x in ["crash", "correction", "market fall", "recession", "bear market"]):
        return (
            f"**If a 20-30% market crash happens:**\n\n"
            f"* Your equity holdings ({eq_pct}% = ₹{eq_val:,.2f}) would drop — temporary paper loss\n"
            f"* Your fixed income ({debt_pct}% = ₹{debt_val:,.2f}) stays stable, continues paying coupon yields\n"
            f"* Your REITs/InvITs ({reit_pct}% = ₹{reit_val:,.2f}) are backed by long-term lease contracts — distributions largely protected\n\n"
            f"**What to do during a crash:**\n"
            f"1. Don't panic-sell — your **{horizon}** horizon gives you time to recover\n"
            f"2. Use your monthly ₹{capacity:,.0f} SIP to buy equities cheaper (rupee cost averaging)\n"
            f"3. If you have a cash buffer (Liquid Fund), deploy it to buy quality blue-chips at discounts\n\n"
            f"Are you worried about a specific sector or holding in your portfolio?"
        )

    # ── General / unknown ────────────────────────────────────────────────────
    if total_val > 0:
        return (
            f"I'm NIDHI, your AI financial advisor. Here's what I can see about your situation:\n\n"
            f"* **Portfolio value**: ₹{total_val:,.2f} across {n} holdings\n"
            f"* **P&L**: {'▲' if total_pnl >= 0 else '▼'} ₹{abs(total_pnl):,.2f} ({'+' if pnl_pct >= 0 else ''}{pnl_pct}%)\n"
            f"* **Goal**: {goal} | **Risk**: {risk} | **Horizon**: {horizon}\n\n"
            f"I can help you with:\n"
            f"* 📊 Portfolio analysis and P&L breakdown\n"
            f"* ⚖️ Risk assessment and rebalancing plan\n"
            f"* 💰 SIP strategy and goal planning\n"
            f"* 🏢 REITs, InvITs, bonds, and tax advice\n"
            f"* 📈 Analysis of specific holdings\n\n"
            f"What would you like to explore?"
        )
    return (
        "I'm NIDHI, your AI financial advisor. Your portfolio appears to be empty.\n\n"
        "To get started:\n"
        "1. Go to **Portfolio** → add holdings manually or upload a CSV\n"
        "2. Complete **Onboarding** to set your investor profile\n"
        "3. Come back here and ask me anything!\n\n"
        "I can analyze risk, suggest rebalancing, explain assets, or plan your SIP strategy."
    )


# ─────────────────────────────────────────────────────────────────────────────
# Main endpoint
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/ask", response_model=ChatResponseSchema)
def ask_question(payload: ChatRequestSchema):
    messages  = payload.messages
    holdings  = payload.holdings or []
    profile   = payload.profile

    if not messages:
        return ChatResponseSchema(response="Hello! I am NIDHI, your AI Financial Advisor. Ask me anything about your portfolio, risk, or investments!")

    # ── Try Gemini LLM first ──────────────────────────────────────────────────
    if _gemini_client:
        try:
            system_prompt = _build_system_prompt(holdings, profile)

            # Build conversation history using genai_types.Content
            contents = []
            for msg in messages:
                role = "user" if msg.role == "user" else "model"
                contents.append(
                    genai_types.Content(
                        role=role,
                        parts=[genai_types.Part(text=msg.content)]
                    )
                )

            response = _gemini_client.models.generate_content(
                model=_gemini_model_name,
                contents=contents,
                config=genai_types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.7,
                    top_p=0.95,
                    max_output_tokens=800,
                )
            )
            return ChatResponseSchema(response=response.text)

        except Exception as e:
            print(f"[NIDHI] Gemini API error: {e} — falling back to local engine")

    # ── Local fallback ────────────────────────────────────────────────────────
    user_query = messages[-1].content
    response = _local_fallback(user_query, holdings, profile)
    return ChatResponseSchema(response=response)
