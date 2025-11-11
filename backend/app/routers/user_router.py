# app/routers/user_router.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user_schema import UserCreate, UserResponse
from app.services import user_service

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user(db, user)

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return user_service.get_all_users(db)

@router.get("/abone/{abone_no}", response_model=UserResponse)
def get_user_by_abone(abone_no: str, db: Session = Depends(get_db)):
    return user_service.get_user_by_abone_no(db, abone_no)