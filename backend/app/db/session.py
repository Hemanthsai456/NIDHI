import os
from pathlib import Path
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

# Load .env from project root (two levels up from this file: app/db/ -> app/ -> backend/ -> project root)
_env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=_env_path, override=True)

# Read DATABASE_URL from environment variable
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    # Safe fallback if DATABASE_URL is not configured yet in .env
    DATABASE_URL = "sqlite:///./nidhi_local.db"

# SQLite connection args vs PostgreSQL connection args
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
