from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from datetime import datetime
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    bill_id = Column(Integer, ForeignKey("bills.id"))
    amount = Column(Float, nullable=False)
    paid_at = Column(DateTime, default=datetime.utcnow)