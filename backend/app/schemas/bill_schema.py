from pydantic import BaseModel
from datetime import datetime

class BillBase(BaseModel):
    user_id: int
    amount: float
    due_date: datetime

class BillCreate(BillBase):
    pass

class BillResponse(BillBase):
    id: int
    is_paid: bool
    created_at: datetime

    class Config:
        from_attributes = True