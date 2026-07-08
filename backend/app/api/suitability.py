from fastapi import APIRouter
from typing import List, Optional
from app.schemas.portfolio import HoldingSchema
from app.schemas.profile import InvestorProfileSchema
from app.schemas.suitability import (
    SuitabilityResponseSchema,
    RecommendationSchema,
    AssetOpportunitySchema
)

router = APIRouter(prefix="/suitability", tags=["Suitability"])

# Master asset database for NIDHI
ASSET_OPPORTUNITIES = [
    {
        "name": "SBI Nifty 50 ETF",
        "type": "ETF",
        "ticker": "SETFNIF50",
        "expectedReturn": "12-15%",
        "riskLevel": "Moderate",
        "liquidity": "High",
        "yieldPct": 1.2,
        "objective": "Track and replicate the performance of the Nifty 50 Index.",
        "description": "A low-cost way to invest in India's top 50 blue-chip companies across sectors."
    },
    {
        "name": "Parag Parikh Flexi Cap Fund",
        "type": "Mutual Fund",
        "ticker": "PPFLEXICAP",
        "expectedReturn": "15-18%",
        "riskLevel": "High",
        "liquidity": "High",
        "yieldPct": 0.5,
        "objective": "Capital appreciation by investing in diversified equities globally & locally.",
        "description": "An actively managed flexi-cap mutual fund with exposure to Indian blue-chips and international giants like Microsoft and Alphabet."
    },
    {
        "name": "Embassy Office Parks REIT",
        "type": "REIT",
        "ticker": "EMBASSY",
        "expectedReturn": "7-9%",
        "riskLevel": "Moderate",
        "liquidity": "Medium",
        "yieldPct": 7.2,
        "objective": "Regular rental distribution yield plus long-term commercial real estate growth.",
        "description": "Owns and operates premium Grade-A office properties in major tech hubs like Bangalore, Mumbai, Pune, paying regular quarterly distributions."
    },
    {
        "name": "PowerGRID Infrastructure InvIT",
        "type": "InvIT",
        "ticker": "PGINVIT",
        "expectedReturn": "9-11%",
        "riskLevel": "Moderate",
        "liquidity": "Medium",
        "yieldPct": 9.8,
        "objective": "High cash distribution yield backed by power transmission contracts.",
        "description": "Invests in transmission line networks across India, paying out over 90% of net distributable cash flows as quarterly dividends."
    },
    {
        "name": "7.18% Govt Security 2033",
        "type": "Govt Security",
        "ticker": "718GS2033",
        "expectedReturn": "7.18%",
        "riskLevel": "Low",
        "liquidity": "Medium",
        "yieldPct": 7.18,
        "objective": "100% sovereign safe interest yield with half-yearly payouts.",
        "description": "Sovereign debt issued by the Reserve Bank of India, paying a fixed coupon of 7.18% per year until maturity in 2033."
    },
    {
        "name": "L&T Finance AAA Corporate Bond",
        "type": "Bond",
        "ticker": "LTFINBOND",
        "expectedReturn": "8.1-8.3%",
        "riskLevel": "Low",
        "liquidity": "Low",
        "yieldPct": 8.2,
        "objective": "Fixed income yield from AAA-rated corporate debt.",
        "description": "Senior secured corporate bonds with the highest safety rating (CRISIL AAA), paying monthly/annual coupons."
    },
    {
        "name": "HDFC Liquid Mutual Fund",
        "type": "Mutual Fund",
        "ticker": "HDFCLIQUID",
        "expectedReturn": "6.2-6.5%",
        "riskLevel": "Low",
        "liquidity": "High",
        "yieldPct": 6.3,
        "objective": "Capital preservation and high liquidity for short-term emergency funds.",
        "description": "Invests in short-term debt instruments like treasury bills and commercial papers, making it very safe and fast to redeem."
    },
    {
        "name": "Nippon India Junior BeES ETF",
        "type": "ETF",
        "ticker": "JUNIORBEES",
        "expectedReturn": "13-16%",
        "riskLevel": "High",
        "liquidity": "High",
        "yieldPct": 0.8,
        "objective": "Track performance of Nifty Next 50 mid-to-large-cap corporations.",
        "description": "Exposes your capital to the next 50 emerging giants in India, which have high growth capacity compared to standard blue-chips."
    }
]

@router.get("/opportunities", response_model=List[AssetOpportunitySchema])
def get_all_opportunities():
    """Retrieve all support assets for explore/trending list"""
    return [AssetOpportunitySchema(**item) for item in ASSET_OPPORTUNITIES]

@router.post("/recommend", response_model=SuitabilityResponseSchema)
def recommend_assets(
    holdings: List[HoldingSchema],
    profile: Optional[InvestorProfileSchema] = None
):
    # Set default values if profile is not provided
    p_goal = profile.goal if profile else "Wealth Creation"
    p_risk = profile.riskAppetite if profile else "Moderate"
    p_horizon = profile.horizon if profile else "Medium Term (3-7 years)"

    # Portfolio analysis parameters
    total_value = sum(h.quantity * h.currentPrice for h in holdings)
    has_reit = any(h.type == "REIT" for h in holdings)
    has_invit = any(h.type == "InvIT" for h in holdings)
    has_etf = any(h.type == "ETF" for h in holdings)

    recommendations = []
    
    # helper mapping for opportunities
    op_map = {item["name"]: AssetOpportunitySchema(**item) for item in ASSET_OPPORTUNITIES}

    # 1. Passive Income recommendations
    if p_goal == "Passive Income":
        recommendations.append(
            RecommendationSchema(
                asset=op_map["PowerGRID Infrastructure InvIT"],
                suitabilityReason="Offers a high, stable distribution yield of ~9.8% backed by secure sovereign transmission transmission grids, perfectly supporting your passive cashflow goals.",
                targetAllocationPct=15.0,
                expectedRole="Core passive dividend generator"
            )
        )
        recommendations.append(
            RecommendationSchema(
                asset=op_map["Embassy Office Parks REIT"],
                suitabilityReason="Provides defensive commercial office rental payouts with growth potential, diversifying your regular cash yield.",
                targetAllocationPct=10.0,
                expectedRole="Commercial rental income stabilizer"
            )
        )

    # 2. Wealth Creation / Retirement equity recommendations
    elif p_goal in ["Wealth Creation", "Retirement"]:
        recommendations.append(
            RecommendationSchema(
                asset=op_map["Parag Parikh Flexi Cap Fund"],
                suitabilityReason="Exposes your capital to high-growth Indian blue chips and international technology leaders, matching your long-term compounding wealth objectives.",
                targetAllocationPct=25.0,
                expectedRole="Core equity capital growth engine"
            )
        )
        if not has_etf:
            recommendations.append(
                RecommendationSchema(
                    asset=op_map["SBI Nifty 50 ETF"],
                    suitabilityReason="Introduces broad market indexing with minimal management fees, laying a stable diversified equity floor for your portfolio.",
                    targetAllocationPct=20.0,
                    expectedRole="Broad index foundation layer"
                )
            )

    # 3. Emergency Fund recommendations
    elif p_goal == "Emergency Fund":
        recommendations.append(
            RecommendationSchema(
                asset=op_map["HDFC Liquid Mutual Fund"],
                suitabilityReason="Invests in overnight sovereign bills ensuring capital preservation and quick liquid redemption, backing your emergency safety nets.",
                targetAllocationPct=40.0,
                expectedRole="Liquid safety cushion"
            )
        )

    # 4. Risk appetite adjustments
    if p_risk == "Conservative":
        recommendations.append(
            RecommendationSchema(
                asset=op_map["7.18% Govt Security 2033"],
                suitabilityReason="Adds 100% risk-free sovereign debt yielding 7.18% annually, shielding your wealth from equity swings while matching conservative growth needs.",
                targetAllocationPct=30.0,
                expectedRole="Risk-free sovereign wealth protector"
            )
        )
        recommendations.append(
            RecommendationSchema(
                asset=op_map["L&T Finance AAA Corporate Bond"],
                suitabilityReason="Delivers highly secured fixed annual interest coupons of 8.2% to lock in attractive stable yields.",
                targetAllocationPct=20.0,
                expectedRole="High-grade corporate debt yield"
            )
        )
    elif p_risk == "Aggressive":
        recommendations.append(
            RecommendationSchema(
                asset=op_map["Nippon India Junior BeES ETF"],
                suitabilityReason="Tracks mid-cap giants with high volatility and strong upside potential, matching your tolerance for large paper swings in search of index-beating returns.",
                targetAllocationPct=15.0,
                expectedRole="High-beta mid-cap growth booster"
            )
        )
        # Increase growth fund target if aggressive
        for r in recommendations:
            if r.asset.name == "Parag Parikh Flexi Cap Fund":
                r.targetAllocationPct = 35.0

    # 5. Diversification gaps (Always add real estate REITs if missing, unless emergency profile)
    if not has_reit and p_goal != "Emergency Fund" and op_map["Embassy Office Parks REIT"] not in [r.asset for r in recommendations]:
        recommendations.append(
            RecommendationSchema(
                asset=op_map["Embassy Office Parks REIT"],
                suitabilityReason="Your current portfolio lacks Real Estate exposure. Adding a Grade-A commercial REIT adds inflation-hedged rental yield and reduces overall equity market correlation.",
                targetAllocationPct=8.0,
                expectedRole="Real estate sector diversifier"
            )
        )

    # Clean up duplicate entries (e.g. if added in multiple steps)
    seen = set()
    unique_recommendations = []
    for r in recommendations:
        if r.asset.name not in seen:
            seen.add(r.asset.name)
            unique_recommendations.append(r)
            
    # If no recommendations matched (rare fallback), add Nifty ETF
    if not unique_recommendations:
        unique_recommendations.append(
            RecommendationSchema(
                asset=op_map["SBI Nifty 50 ETF"],
                suitabilityReason="Provides a diversified baseline allocation to India's top 50 index constituents, suitable for any general investing profile.",
                targetAllocationPct=30.0,
                expectedRole="Core market beta holder"
            )
        )

    # General explanation summary
    asset_types = list(set(r.asset.type for r in unique_recommendations))
    explanation = (
        f"Based on your profile (Declared Goal: {p_goal}, Risk Appetite: {p_risk}, and Horizon: {p_horizon}), "
        f"NIDHI recommends constructing a suitability portfolio structured across {', '.join(asset_types)}. "
        f"This asset allocation is designed to optimize your returns while controlling drawdown volatility to match your comfort limits."
    )

    return SuitabilityResponseSchema(
        recommendations=unique_recommendations,
        explanation=explanation
    )
