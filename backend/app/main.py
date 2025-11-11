from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import user_router, bill_router, payment_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Su Tahsilat API", version="1.0")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router.router)
app.include_router(bill_router.router, prefix="/bills", tags=["Bills"])  
app.include_router(payment_router.router, prefix="/payments", tags=["Payments"])