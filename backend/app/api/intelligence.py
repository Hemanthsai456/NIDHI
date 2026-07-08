from fastapi import APIRouter
from typing import List, Optional
from app.schemas.portfolio import HoldingSchema
from app.schemas.profile import InvestorProfileSchema
from app.schemas.intelligence import (
    PortfolioAnalyticsSchema,
    SectorExposureSchema,
    AssetAllocationSchema,
    PortfolioInsightSchema
)

router = APIRouter(prefix="/intelligence", tags=["Intelligence"])

# Simple helper to map asset names to sectors
def get_asset_sector(name: str, asset_type: str) -> str:
    n = name.lower()
    if asset_type in ["Govt Security", "Bond"]:
        return "Government & Debt"
    if "tcs" in n or "infosys" in n or "wipro" in n or "tech" in n or "hcl" in n:
        return "Technology"
    if "hdfc" in n or "icici" in n or "sbi" in n or "axis" in n or "bank" in n or "finance" in n or "mutual" in n:
        return "Financial Services"
    if "reliance" in n or "oil" in n or "gas" in n or "power" in n or "ntpc" in n:
        return "Energy & Utilities"
    if "pharma" in n or "sun" in n or "reddy" in n or "health" in n:
        return "Healthcare"
    if "nifty" in n or "bees" in n or "etf" in n or "index" in n:
        return "Diversified Index"
    if asset_type in ["REIT", "InvIT"]:
        return "Real Estate & Infrastructure"
    return "Others"

@router.post("/analyze", response_model=PortfolioAnalyticsSchema)
def analyze_portfolio(
    holdings: List[HoldingSchema],
    profile: Optional[InvestorProfileSchema] = None
):
    if not holdings:
        return {
            "healthScore": 0,
            "diversificationScore": 0,
            "liquidityScore": 0,
            "riskRating": "Low",
            "sectorExposures": [],
            "assetAllocations": [],
            "insights": [
                {
                    "type": "info",
                    "title": "Empty Portfolio",
                    "description": "You haven't added any holdings to analyze yet.",
                    "recommendation": "Go to the Portfolio page to import assets manually or upload a statement.",
                    "impact": "High"
                }
            ]
        }

    total_value = sum(h.quantity * h.currentPrice for h in holdings)
    total_cost = sum(h.quantity * h.avgPrice for h in holdings)

    # 1. Asset Type Allocations
    type_values = {}
    for h in holdings:
        val = h.quantity * h.currentPrice
        type_values[h.type] = type_values.get(h.type, 0.0) + val

    asset_allocations = [
        AssetAllocationSchema(
            type=t,
            value=val,
            percentage=round((val / total_value) * 100, 2)
        )
        for t, val in type_values.items()
    ]
    # Sort allocations descending
    asset_allocations.sort(key=lambda x: x.value, reverse=True)

    # 2. Sector Exposures
    sector_values = {}
    for h in holdings:
        val = h.quantity * h.currentPrice
        sec = get_asset_sector(h.name, h.type)
        sector_values[sec] = sector_values.get(sec, 0.0) + val

    sector_exposures = [
        SectorExposureSchema(
            sector=s,
            value=val,
            percentage=round((val / total_value) * 100, 2)
        )
        for s, val in sector_values.items()
    ]
    # Sort sectors descending
    sector_exposures.sort(key=lambda x: x.value, reverse=True)

    # 3. Portfolio Risk Rating
    # Weighted risk value
    risk_weights = {
        "Stock": 90,
        "REIT": 70,
        "InvIT": 70,
        "Mutual Fund": 50,
        "ETF": 50,
        "Bond": 30,
        "Govt Security": 10
    }
    weighted_risk_sum = 0.0
    for h in holdings:
        val = h.quantity * h.currentPrice
        weight = risk_weights.get(h.type, 50)
        weighted_risk_sum += val * weight

    avg_risk = weighted_risk_sum / total_value
    if avg_risk < 35:
        portfolio_risk = "Low"
    elif avg_risk < 65:
        portfolio_risk = "Moderate"
    else:
        portfolio_risk = "High"

    # 4. Liquidity Score
    # Stocks, Mutual Funds, ETFs = 100% liquid; Bonds, Govt Secs, REITs, InvITs = 50%
    liquid_values = 0.0
    for h in holdings:
        val = h.quantity * h.currentPrice
        if h.type in ["Stock", "Mutual Fund", "ETF"]:
            liquid_values += val
        else:
            liquid_values += val * 0.5
    liquidity_score = int((liquid_values / total_value) * 100)

    # 5. Diversification Score (Starts at 100, penalized for concentration)
    div_score = 100
    
    # Penalize low number of assets
    num_assets = len(holdings)
    if num_assets == 1:
        div_score -= 50
    elif num_assets == 2:
        div_score -= 30
    elif num_assets == 3:
        div_score -= 15
    elif num_assets < 5:
        div_score -= 5

    # Penalize asset concentration
    max_asset_pct = max((h.quantity * h.currentPrice / total_value) for h in holdings) * 100
    if max_asset_pct > 60:
        div_score -= 25
    elif max_asset_pct > 45:
        div_score -= 15
    elif max_asset_pct > 30:
        div_score -= 8

    # Penalize sector concentration
    max_sector_pct = max(s.percentage for s in sector_exposures)
    if max_sector_pct > 60:
        div_score -= 20
    elif max_sector_pct > 40:
        div_score -= 10

    div_score = max(0, min(100, div_score))

    # 6. Health Score (Starts at 100, penalized for issues)
    health_score = 100
    
    # Low diversification penalty
    if div_score < 40:
        health_score -= 20
    elif div_score < 60:
        health_score -= 10
        
    # High single asset concentration penalty
    if max_asset_pct > 40:
        health_score -= 15

    # Portfolio returns factor (minor bonus/penalty for performance)
    net_returns = total_value - total_cost
    return_pct = (net_returns / total_cost) * 100 if total_cost > 0 else 0
    if return_pct < -15:
        health_score -= 10
    elif return_pct > 15:
        health_score += 5  # positive performance bonus

    # Onboarding alignment checks
    profile_risk = profile.riskAppetite if profile else "Moderate"
    if profile_risk == "Conservative" and portfolio_risk == "High":
        health_score -= 15
    elif profile_risk == "Aggressive" and portfolio_risk == "Low":
        health_score -= 8
    elif profile_risk == "Moderate" and portfolio_risk == "High":
        health_score -= 5

    health_score = max(10, min(100, health_score))

    # 7. Actionable Insights Generation
    insights = []

    # Concentration check
    if max_asset_pct > 40:
        # Find which asset it is
        concentrated_asset = max(holdings, key=lambda h: h.quantity * h.currentPrice)
        insights.append(
            PortfolioInsightSchema(
                type="warning",
                title="Asset Concentration Risk",
                description=f"'{concentrated_asset.name}' accounts for {max_asset_pct:.1f}% of your total portfolio value.",
                recommendation=f"Consider paring down your position in '{concentrated_asset.name}' and reallocating capital to other asset types to reduce unsystematic risk.",
                impact="High"
            )
        )

    # Sector exposure check
    tech_exp = next((s.percentage for s in sector_exposures if s.sector == "Technology"), 0)
    if tech_exp > 35:
        insights.append(
            PortfolioInsightSchema(
                type="warning",
                title="Sector Concentration",
                description=f"Your portfolio has {tech_exp:.1f}% exposure to the Technology sector, which exceeds target diversification guidelines.",
                recommendation="Reduce sector risk by allocating to under-represented segments such as Financial Services, Healthcare, or Infrastructure REITs.",
                impact="Medium"
            )
        )

    # Risk Profile Alignment check
    if profile:
        if profile.riskAppetite == "Conservative" and portfolio_risk in ["Moderate", "High"]:
            insights.append(
                PortfolioInsightSchema(
                    type="warning",
                    title="Risk Tolerance Mismatch",
                    description=f"Your portfolio risk is {portfolio_risk}, but your onboarding profile risk tolerance is Conservative.",
                    recommendation="Increase allocation to low-volatility fixed-income instruments like Government Securities (G-Secs) or AAA-rated Corporate Bonds.",
                    impact="High"
                )
            )
        elif profile.riskAppetite == "Moderate" and portfolio_risk == "High":
            insights.append(
                PortfolioInsightSchema(
                    type="warning",
                    title="Risk Tolerance Mismatch",
                    description="Your portfolio risk is High, but your declared risk tolerance is Moderate.",
                    recommendation="Rebalance slightly by shifting some volatile equity positions into diversified index ETFs, debt mutual funds, or gold.",
                    impact="Medium"
                )
            )
        elif profile.riskAppetite == "Aggressive" and portfolio_risk == "Low":
            insights.append(
                PortfolioInsightSchema(
                    type="info",
                    title="Inflation Drag Alert",
                    description="Your portfolio is concentrated in Low risk assets, whereas your declared risk appetite is Aggressive.",
                    recommendation="Consider increasing allocation to diversified equity ETFs or Growth Mutual Funds to achieve higher long-term compounding returns.",
                    impact="Medium"
                )
            )
        else:
            insights.append(
                PortfolioInsightSchema(
                    type="success",
                    title="Risk Profile Aligned",
                    description=f"Your current portfolio risk ({portfolio_risk}) aligns with your declared {profile.riskAppetite} risk appetite.",
                    recommendation="Maintain your regular investment schedule. Continue checking allocations periodically.",
                    impact="Low"
                )
            )

    # Diversification check
    if div_score < 50:
        insights.append(
            PortfolioInsightSchema(
                type="warning",
                title="Under-diversified Portfolio",
                description=f"Your diversification score is {div_score}/100. You are holding too few distinct assets or asset classes.",
                recommendation="Aim to own at least 5 different instruments across Stocks, ETFs, and REITs to balance market cycles.",
                impact="Medium"
            )
        )

    # Liquidity check
    if liquidity_score < 40:
        insights.append(
            PortfolioInsightSchema(
                type="warning",
                title="Low Portfolio Liquidity",
                description="A significant portion of your assets are locked in less liquid or long-term products.",
                recommendation="Ensure you have an adequate emergency fund (3-6 months expenses) kept in highly liquid funds before adding more fixed-income debt.",
                impact="Medium"
            )
        )

    # Return performance check
    if return_pct > 12:
        insights.append(
            PortfolioInsightSchema(
                type="success",
                title="Strong Portfolio Return",
                description=f"Your overall returns are sitting at a strong +{return_pct:.1f}%.",
                recommendation="Reinvest returns/dividends to benefit from compound interest growth, and do not panic buy during market rallies.",
                impact="Low"
            )
        )

    # If no warnings exist, add a general healthy advice card
    if not insights:
        insights.append(
            PortfolioInsightSchema(
                type="success",
                title="Portfolio Analysis Complete",
                description="Your asset allocation appears well balanced across types.",
                recommendation="Continue your systematic investment plan (SIP) and monitor your sector exposures monthly.",
                impact="Low"
            )
        )

    return PortfolioAnalyticsSchema(
        healthScore=health_score,
        diversificationScore=div_score,
        liquidityScore=liquidity_score,
        riskRating=portfolio_risk,
        sectorExposures=sector_exposures,
        assetAllocations=asset_allocations,
        insights=insights
    )
