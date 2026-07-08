from pydantic import BaseModel, Field
from typing import List, Optional

class AssetOpportunitySchema(BaseModel):
    name: str = Field(..., example="Embassy Office Parks REIT")
    type: str = Field(..., example="REIT")
    ticker: str = Field(..., example="EMBASSY")
    expectedReturn: str = Field(..., example="7-9%")
    riskLevel: str = Field(..., example="Moderate")  # Low, Moderate, High
    liquidity: str = Field(..., example="Medium")  # Low, Medium, High
    yieldPct: float = Field(0.0, example=7.2)
    objective: str = Field(..., example="Regular dividend income & long-term capital appreciation.")
    description: str = Field(..., example="India's first publicly listed REIT owning high-grade office parks.")

class RecommendationSchema(BaseModel):
    asset: AssetOpportunitySchema
    suitabilityReason: str = Field(..., example="Provides commercial real estate yield matching your passive income goals.")
    targetAllocationPct: float = Field(..., example=10.0)
    expectedRole: str = Field(..., example="Yield generator and real estate exposure stabilizer.")

class SuitabilityResponseSchema(BaseModel):
    recommendations: List[RecommendationSchema]
    explanation: str = Field(..., example="Based on your moderate risk profile, medium term horizon, and passive income goals, NIDHI suggests a mix of high-yield InvITs, G-Secs, and Nifty index trackers.")
