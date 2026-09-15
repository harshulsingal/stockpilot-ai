from fastapi import FastAPI
from app.api.stock_routes import router
from app.core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth_routes import router as auth_router

from app.core.database import Base, engine
from app.models.user import User
from app.models.portfolio import PortfolioHolding
from app.api.portfolio_routes import router as portfolio_router

from app.api.analysis_routes import (
    router as analysis_router
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)
app.include_router(
    analysis_router
)
app.include_router(portfolio_router)
@app.get("/")
def root():
    return {
        "message": "StockPilot AI Backend Running"
    }

app.include_router(
    router,
    prefix="/api/stocks",
    tags=["Stocks"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)