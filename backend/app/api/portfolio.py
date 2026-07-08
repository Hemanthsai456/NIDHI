from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from typing import List
from uuid import uuid4
from app.schemas.portfolio import HoldingSchema, HoldingResponseSchema, PortfolioSummarySchema
from app.db.session import get_session
from app.models.database import Holding

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])


@router.get("/{user_id}", response_model=PortfolioSummarySchema)
def get_portfolio(user_id: str, db: Session = Depends(get_session)):
    holdings = db.exec(select(Holding).where(Holding.user_id == user_id)).all()
    user_holdings = [h.model_dump() for h in holdings]

    total_cost = sum(h["quantity"] * h["avgPrice"] for h in user_holdings)
    total_value = sum(h["quantity"] * h["currentPrice"] for h in user_holdings)
    total_returns = total_value - total_cost
    return_percentage = (total_returns / total_cost * 100) if total_cost > 0 else 0.0

    return {
        "holdings": user_holdings,
        "totalValue": total_value,
        "totalCost": total_cost,
        "totalReturns": total_returns,
        "returnPercentage": return_percentage
    }


@router.post("/{user_id}", response_model=HoldingResponseSchema)
def add_holding(user_id: str, holding: HoldingSchema, db: Session = Depends(get_session)):
    new_id = f"holding_{uuid4().hex[:8]}"
    db_holding = Holding(id=new_id, user_id=user_id, **holding.model_dump())
    db.add(db_holding)
    db.commit()
    db.refresh(db_holding)
    return db_holding


@router.post("/{user_id}/bulk", response_model=List[HoldingResponseSchema])
def add_bulk_holdings(user_id: str, new_holdings: List[HoldingSchema], db: Session = Depends(get_session)):
    inserted = []
    for h in new_holdings:
        new_id = f"holding_{uuid4().hex[:8]}"
        db_holding = Holding(id=new_id, user_id=user_id, **h.model_dump())
        db.add(db_holding)
        inserted.append(db_holding)
    db.commit()
    for h in inserted:
        db.refresh(h)
    return inserted


@router.delete("/{user_id}/{holding_id}")
def delete_holding(user_id: str, holding_id: str, db: Session = Depends(get_session)):
    db_holding = db.get(Holding, holding_id)
    if not db_holding or db_holding.user_id != user_id:
        raise HTTPException(status_code=404, detail="Holding not found")
    db.delete(db_holding)
    db.commit()
    return {"message": "Holding deleted successfully"}
