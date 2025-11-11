from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.bill_model import Bill
from app.schemas.bill_schema import BillCreate, BillResponse
from datetime import datetime

router = APIRouter(tags=["Bills"]) 

@router.post("/", response_model=BillResponse, summary="Yeni fatura oluştur")
def create_bill(bill: BillCreate, db: Session = Depends(get_db)):
    new_bill = Bill(**bill.dict())
    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)
    return new_bill


@router.get("/", response_model=list[BillResponse], summary="Tüm faturaları getir")
def get_bills(db: Session = Depends(get_db)):
    return db.query(Bill).all()


@router.get("/{bill_id}", response_model=BillResponse, summary="ID ile fatura getir")
def get_bill(bill_id: int, db: Session = Depends(get_db)):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return bill


@router.put("/{bill_id}/pay", response_model=BillResponse, summary="Faturayı öde")
def mark_bill_paid(bill_id: int, db: Session = Depends(get_db)):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    if bill.is_paid:
        raise HTTPException(status_code=400, detail="Fatura zaten ödenmiş")
    bill.is_paid = True
    bill.paid_at = datetime.utcnow()
    db.commit()
    db.refresh(bill)
    return bill


@router.get("/user/{user_id}", response_model=list[BillResponse])
def get_bills_by_user(user_id: int, db: Session = Depends(get_db)):
    bills = db.query(Bill).filter(Bill.user_id == user_id).all()
    if not bills:
        raise HTTPException(status_code=404, detail="Fatura bulunamadı")
    return bills