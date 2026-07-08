from pydantic import BaseModel, Field
from typing import List

class SectorExposureSchema(BaseModel):
    sector: str = Field(..., example="Technology")
    value: float = Field(..., example=12000.0)
    percentage: float = Field(..., example=30.0)

class AssetAllocationSchema(BaseModel):
    type: str = Field(..., example="Stock")
    value: float = Field(..., example=25000.0)
    percentage: float = Field(..., example=62.5)

class PortfolioInsightSchema(BaseModel):
    type: str = Field(..., example="warning")  # warning, success, info
    title: str = Field(..., example="High Sector Exposure")
    description: str = Field(..., example="You have over 30% exposure in Technology sector.")
    recommendation: str = Field(..., example="Diversify by allocating to Financials or Pharma.")
    impact: str = Field(..., example="Medium")  # High, Medium, Low

class PortfolioAnalyticsSchema(BaseModel):
    healthScore: int = Field(..., example=85)
    diversificationScore: int = Field(..., example=75)
    liquidityScore: int = Field(..., example=90)
    riskRating: str = Field(..., example="Moderate")  # Low, Moderate, High
    sectorExposures: List[SectorExposureSchema]
    assetAllocations: List[AssetAllocationSchema]
    insights: List[PortfolioInsightSchema]
