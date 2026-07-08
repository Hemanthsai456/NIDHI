from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.portfolio import HoldingSchema
from app.schemas.profile import InvestorProfileSchema

class ChatMessageSchema(BaseModel):
    role: str = Field(..., example="user")  # 'user' or 'assistant'
    content: str = Field(..., example="Why is my portfolio risky?")

class ChatRequestSchema(BaseModel):
    messages: List[ChatMessageSchema]
    holdings: List[HoldingSchema]
    profile: Optional[InvestorProfileSchema] = None

class ChatResponseSchema(BaseModel):
    response: str
