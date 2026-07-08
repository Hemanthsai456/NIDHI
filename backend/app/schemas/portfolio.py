from pydantic import BaseModel, Field
from typing import List, Literal

AssetType = Literal["Stock", "Mutual Fund", "ETF", "REIT", "InvIT", "Bond", "Govt Security"]

class HoldingSchema(BaseModel):
    name: str = Field(..., min_length=1, example="TCS")
    type: AssetType = Field(..., example="Stock")
    quantity: float = Field(..., gt=0, example=10.0)
    avgPrice: float = Field(..., gt=0, example=3500.0)
    currentPrice: float = Field(..., gt=0, example=4000.0)
    source: str = Field(..., min_length=1, example="Zerodha")

class HoldingResponseSchema(HoldingSchema):
    id: str = Field(..., example="holding_abc123")

class PortfolioSummarySchema(BaseModel):
    holdings: List[HoldingResponseSchema]
    totalValue: float = Field(..., example=40000.0)
    totalCost: float = Field(..., example=35000.0)
    totalReturns: float = Field(..., example=5000.0)
    returnPercentage: float = Field(..., example=14.28)
