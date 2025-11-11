from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.payment_model import Payment
from app.models.bill_model import Bill
from app.schemas.payment_schema import PaymentCreate

def create_payment(db: Session, payment_data: PaymentCreate):
    bill = db.query(Bill).filter(Bill.id == payment_data.bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Fatura bulunamadı")

    if bill.is_paid:
        raise HTTPException(status_code=400, detail="Fatura zaten ödenmiş")

    payment = Payment(**payment_data.dict())
    bill.is_paid = True
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment

def get_payments_by_user(db: Session, user_id: int):

    return db.query(Payment).join(Bill).filter(Bill.user_id == user_id).all()