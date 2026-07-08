from contextlib import asynccontextmanager
import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.profile import router as profile_router
from app.api.portfolio import router as portfolio_router
from app.api.intelligence import router as intelligence_router
from app.api.suitability import router as suitability_router
from app.api.chat import router as chat_router
from app.db.session import init_db

# Load root .env
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env", override=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create all tables in the database (Neon PostgreSQL or fallback SQLite)
    init_db()
    yield
    # Shutdown cleanup (none needed)

app = FastAPI(
    title="NIDHI API",
    description="Backend API for NIDHI - AI Investor Super App",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — read allowed frontend origin from env (default: localhost dev servers)
_frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
origins = [
    _frontend_url,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(profile_router, prefix="/api/v1")
app.include_router(portfolio_router, prefix="/api/v1")
app.include_router(intelligence_router, prefix="/api/v1")
app.include_router(suitability_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "NIDHI Backend",
        "version": "0.1.0"
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to NIDHI API. Visit /docs for API documentation."}
