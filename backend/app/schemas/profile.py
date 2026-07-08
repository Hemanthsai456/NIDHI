from pydantic import BaseModel, Field

class InvestorProfileSchema(BaseModel):
    fullName: str = Field(..., example="John Doe")
    age: int = Field(..., ge=18, le=100, example=30)
    occupation: str = Field(..., example="Salaried")
    annualIncome: str = Field(..., example="₹5-10 Lakhs")
    experience: str = Field(..., example="Beginner")
    goal: str = Field(..., example="Wealth Creation")
    horizon: str = Field(..., example="Medium Term (3-7 years)")
    capacity: float = Field(..., ge=0, example=15000.0)
    riskAppetite: str = Field(..., example="Moderate")
