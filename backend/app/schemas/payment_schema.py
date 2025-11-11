from pydantic import BaseModel
from datetime import datetime

class PaymentBase(BaseModel):
    bill_id: int
    amount: float

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: int
    paid_at: datetime

    class Config:
        from_attributes = True