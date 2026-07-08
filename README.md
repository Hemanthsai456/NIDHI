<div align="center">

# NIDHI

### AI Investor Super App

**Understand the investor first. Recommend investments second.**

*A full-stack AI-powered financial copilot for retail investors in India — unifying portfolio management, intelligent analysis, and personalized asset recommendations in one premium platform.*

---

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169e1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## Overview

NIDHI resolves two core pain points for retail investors in India:

1. **Portfolio fragmentation** — holdings scattered across brokers, mutual fund platforms, and bank accounts with no unified view.
2. **Limited awareness** — most investors are unfamiliar with alternative yield instruments like REITs, InvITs, and Corporate Bonds that could meaningfully improve their risk-return profile.

Rather than acting as another transaction broker, NIDHI serves as a **personal financial copilot** — building a complete picture of an investor's profile, analyzing their existing holdings, and recommending targeted allocations with explainable AI reasoning.

---

## Features

### 🗂️ Unified Portfolio Aggregator
- Tracks **Stocks, Mutual Funds, ETFs, REITs, InvITs, Corporate Bonds, and Government Securities** in a single dashboard
- Supports manual entry, **CSV bulk import**, and simulated broker connections (Zerodha, Groww)
- Real-time portfolio valuation, P&L tracking, and cost-basis calculations

### 📊 Portfolio Intelligence Engine
- Computes **Portfolio Health Score**, **Diversification Score**, and **Liquidity Score** from holdings data
- Maps sector concentration, asset class weights, and risk distribution
- Generates plain-language advisory commentary flagging hidden risks and rebalancing opportunities

### 🤖 AI Suitability Engine
- Cross-references investor profile (age, income, goal, risk appetite, horizon) against current holdings
- Recommends target allocations designed to **fill gaps**, not push generic products
- Pre-screening questionnaire captures real-time intent before generating suggestions

### 💡 Smart Investment Hub
| Tab | Description |
|-----|-------------|
| **Recommended Allocation** | Personalized suitability targets after a 3-question intent quiz |
| **Explore All Assets** | Full asset browser with category filters |
| **High-Yield Trending** | Curated high-distribution picks (InvITs, AAA Bonds, G-Secs) |

Includes a **Simulated Partner Transaction Drawer** (Zerodha & Groww) that appends purchases directly into live portfolio holdings.

### 📚 Interactive Learning Center
- Structured educational modules covering 7 asset classes with characteristics, risks, liquidity profiles, and tax treatment
- **Knowledge Check Quizzes** — 3-question multiple-choice assessments with instant scoring
- **Deep-link to Copilot** — pre-populated prompts that route learning topics directly to the AI assistant

### 💬 AI Financial Assistant
- Context-aware chat interface backed by live portfolio and profile data
- Persistent **conversation history** saved per user (localStorage, keyed by Firebase UID)
- Collapsible history sidebar with date-grouped past queries
- Fallback local reasoning engine when the backend LLM is unavailable

### ⚙️ Settings & Personalization
- **Account & Profile** tab — displays investor profile, Firebase account info, and portfolio summary
- Custom accent color themes (Indigo, Emerald, Rose, Amber)
- Notification toggles and broker connection management
- Danger Zone portfolio reset with double-confirmation guard

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 6.0 | Type safety |
| Vite | 8.1 | Build tooling & dev server |
| Tailwind CSS | 3.4 | Styling |
| Recharts | 3.9 | Portfolio charts |
| Lucide React | 1.23 | Icon system |
| React Router | 7 | Client-side routing |
| Firebase SDK | 12 | Authentication |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| FastAPI | 0.100+ | REST API framework |
| Python | 3.11 | Runtime |
| SQLModel | 0.0.14 | ORM (PostgreSQL + SQLite) |
| Pydantic | 2.0 | Request/response validation |
| Uvicorn | 0.22+ | ASGI server |
| python-dotenv | 1.0+ | Environment management |
| psycopg2-binary | 2.9+ | PostgreSQL driver |

### Infrastructure
| Service | Role |
|--------|------|
| **Neon PostgreSQL** | Persistent database (user profiles, holdings) |
| **Firebase Auth** | User authentication & session management |

---

## Project Structure

```
NIDHI/
├── .env.example              # Environment variable template
├── .gitignore                # Comprehensive ignore rules
├── sample_portfolio.csv      # CSV import template
│
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py           # FastAPI app + lifespan (init_db)
│       ├── db/
│       │   └── session.py    # SQLModel engine, get_session, init_db
│       ├── models/
│       │   └── database.py   # UserProfile, Holding SQLModel tables
│       ├── schemas/          # Pydantic request/response schemas
│       └── api/
│           ├── profile.py    # GET/POST /api/v1/profile/{user_id}
│           ├── portfolio.py  # CRUD /api/v1/portfolio/{user_id}
│           ├── intelligence.py # POST /api/v1/intelligence/analyze
│           ├── suitability.py  # POST /api/v1/suitability/recommend
│           └── chat.py       # POST /api/v1/chat/ask
│
└── frontend/
    ├── index.html
    ├── package.json
    └── src/
        ├── App.tsx
        ├── context/
        │   ├── AuthContext.tsx    # Firebase auth + investor profile
        │   └── PortfolioContext.tsx
        ├── pages/
        │   ├── Auth/             # Login.tsx, Signup.tsx
        │   ├── Dashboard.tsx
        │   ├── Portfolio.tsx
        │   ├── Intelligence.tsx
        │   ├── Investments.tsx   # Smart Investment Hub
        │   ├── Assistant.tsx     # AI chat with history
        │   ├── Learning.tsx
        │   ├── Profile.tsx
        │   ├── Onboarding.tsx
        │   └── Settings.tsx
        └── services/
            └── firebase.ts
```

---

## API Reference

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `GET` | `/api/v1/profile/{user_id}` | Fetch investor profile |
| `POST` | `/api/v1/profile/{user_id}` | Create or update investor profile |
| `GET` | `/api/v1/portfolio/{user_id}` | Get all holdings with P&L summary |
| `POST` | `/api/v1/portfolio/{user_id}` | Add a single holding |
| `POST` | `/api/v1/portfolio/{user_id}/bulk` | Bulk-insert holdings (CSV import) |
| `DELETE` | `/api/v1/portfolio/{user_id}/{holding_id}` | Remove a holding |
| `POST` | `/api/v1/intelligence/analyze` | Run portfolio intelligence scoring |
| `POST` | `/api/v1/suitability/recommend` | Generate AI asset recommendations |
| `POST` | `/api/v1/chat/ask` | Send message to AI financial assistant |

Interactive API docs available at `http://localhost:8000/docs`.

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- A [Firebase](https://console.firebase.google.com) project with **Email/Password** auth enabled
- A [Neon](https://neon.tech) (or any PostgreSQL) database

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nidhi.git
cd nidhi
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
# Root .env — read by the backend
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

> The frontend also needs its own `.env` inside `frontend/` — copy the same Firebase variables there.

### 3. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn app.main:app --reload --port 8000
```

On first startup, **database tables are created automatically** in your PostgreSQL instance via SQLModel's `init_db()` lifespan hook. No migration tool required.

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy Firebase credentials into frontend env
# (or create frontend/.env manually with the VITE_FIREBASE_* keys)

# Start the Vite dev server
npm run dev
```

The app is available at **http://localhost:5173**.

---

## CSV Portfolio Import

Use `sample_portfolio.csv` at the project root as a template.

```csv
name,type,quantity,avgPrice,currentPrice,source
SBI Nifty 50 ETF,ETF,50,240.00,255.00,Zerodha
Embassy Office Parks REIT,REIT,100,350.00,375.00,Groww
7.18% Govt Security 2033,Govt Security,5,1000.00,1005.00,Manual
```

**Supported asset types:** `Stock`, `Mutual Fund`, `ETF`, `REIT`, `InvIT`, `Bond`, `Govt Security`

---

## Environment Variables Reference

| Variable | Location | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_API_KEY` | root `.env` / `frontend/.env` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | root `.env` / `frontend/.env` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | root `.env` / `frontend/.env` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | root `.env` / `frontend/.env` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | root `.env` / `frontend/.env` | Firebase messaging ID |
| `VITE_FIREBASE_APP_ID` | root `.env` / `frontend/.env` | Firebase app ID |
| `DATABASE_URL` | root `.env` | PostgreSQL connection string (falls back to SQLite if empty) |

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ♥ for retail investors in India.

</div>
