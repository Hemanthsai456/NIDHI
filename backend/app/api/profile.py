from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from app.schemas.profile import InvestorProfileSchema
from app.db.session import get_session
from app.models.database import UserProfile

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/{user_id}", response_model=InvestorProfileSchema)
def get_profile(user_id: str, db: Session = Depends(get_session)):
    profile = db.get(UserProfile, user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.post("/{user_id}", response_model=InvestorProfileSchema)
def save_profile(user_id: str, profile: InvestorProfileSchema, db: Session = Depends(get_session)):
    db_profile = db.get(UserProfile, user_id)
    if db_profile:
        # Update existing
        for key, value in profile.model_dump().items():
            setattr(db_profile, key, value)
    else:
        # Create new
        db_profile = UserProfile(user_id=user_id, **profile.model_dump())
        db.add(db_profile)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile
