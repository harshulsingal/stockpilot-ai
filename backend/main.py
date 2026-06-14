from fastapi import FastAPI
from app.api.stock_routes import router
from app.core.config import settings
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)

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