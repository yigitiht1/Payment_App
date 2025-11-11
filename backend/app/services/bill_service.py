from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.bill_model import Bill
from app.schemas.bill_schema import BillCreate
from datetime import datetime

def create_bill(db: Session, bill_data: BillCreate):
    new_bill = Bill(**bill_data.dict())
    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)
    return new_bill

def get_user_bills(
    db: Session, 
    user_id: int, 
    status: str = None,  
    sort: str = "asc"    
):
    query = db.query(Bill).filter(Bill.user_id == user_id)

    if status == "paid":
        query = query.filter(Bill.is_paid == True)
    elif status == "unpaid":
        query = query.filter(Bill.is_paid == False)

    if sort == "desc":
        query = query.order_by(Bill.due_date.desc())
    else:
        query = query.order_by(Bill.due_date.asc())

    bills = query.all()
    if not bills:
        raise HTTPException(status_code=404, detail="Bu kullanıcıya ait fatura bulunamadı")
    return bills

def mark_bill_paid(db: Session, bill_id: int):
    bill = db.query(Bill).filter(Bill.id == bill_id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="Fatura bulunamadı")

    bill.is_paid = True
    bill.paid_at = datetime.now()
    db.commit()
    db.refresh(bill)
    return bill

def get_user_bills_summary(db: Session, user_id: int):
    bills = db.query(Bill).filter(Bill.user_id == user_id).all()
    total = sum(b.amount for b in bills)
    paid_total = sum(b.amount for b in bills if b.is_paid)
    unpaid_total = total - paid_total
    return {"total": total, "paid_total": paid_total, "unpaid_total": unpaid_total}