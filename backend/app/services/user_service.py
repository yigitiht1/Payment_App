# app/services/user_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user_model import User
from app.schemas.user_schema import UserCreate, UserResponse
import uuid
from typing import List

def create_user(db: Session, user_data: UserCreate) -> UserResponse:
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    abone_no = f"AB-{uuid.uuid4().hex[:6].upper()}"
    while db.query(User).filter(User.address == abone_no).first():
        abone_no = f"AB-{uuid.uuid4().hex[:6].upper()}"

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        address=abone_no
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        abone_no=new_user.address, 
        created_at=new_user.created_at
    )

def get_user_by_abone_no(db: Session, abone_no: str) -> UserResponse:
    user = db.query(User).filter(User.address == abone_no).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        abone_no=user.address,
        created_at=user.created_at
    )

def get_all_users(db: Session) -> List[UserResponse]:
    users = db.query(User).all()
    return [
        UserResponse(
            id=u.id,
            name=u.name,
            email=u.email,
            abone_no=u.address,
            created_at=u.created_at
        ) for u in users
    ]