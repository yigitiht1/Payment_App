from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.payment_model import Payment
from app.models.bill_model import Bill
from app.schemas.payment_schema import PaymentCreate, PaymentResponse

router = APIRouter()

@router.post("/", response_model=PaymentResponse)
def make_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    bill = db.query(Bill).filter(Bill.id == payment.bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")

    if bill.is_paid:
        raise HTTPException(status_code=400, detail="Bill already paid")

    new_payment = Payment(**payment.dict())
    bill.is_paid = True
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment

@router.get("/", response_model=list[PaymentResponse])
def get_all_payments(db: Session = Depends(get_db)):
    return db.query(Payment).all()