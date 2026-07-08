from sqlmodel import SQLModel, Field
from typing import Optional

class UserProfile(SQLModel, table=True):
    __tablename__ = "user_profiles"
    
    user_id: str = Field(primary_key=True, index=True)  # Firebase UID
    fullName: str
    age: int
    occupation: str
    annualIncome: str
    experience: str
    goal: str
    horizon: str
    capacity: float
    riskAppetite: str

class Holding(SQLModel, table=True):
    __tablename__ = "holdings"
    
    id: str = Field(primary_key=True, index=True)  # Generated ID
    user_id: str = Field(index=True)  # Firebase UID
    name: str
    type: str
    quantity: float
    avgPrice: float
    currentPrice: float
    source: str
