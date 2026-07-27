<div align="center">

# NIDHI

### AI Investor Super App

**Understand the investor first. Recommend investments second.**

*A full-stack AI-powered financial copilot for retail investors in India — unifying portfolio management, intelligent analysis, and personalized asset recommendations in one premium platform.*

---

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://aistudio.google.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169e1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

## 🚀 Live Deployment

The application is deployed and accessible at the following URLs:
* **Frontend Web App:** [https://nidhiapp.vercel.app](https://nidhiapp.vercel.app) 

* **Backend API Gateway:** [https://nidhi-api.render.com](https://nidhi-api.onrender.com) 

* **Interactive API Documentation:** [https://nidhi-api.render.com/docs](https://nidhi-api.onrender.com/docs) 

---

## Overview

NIDHI resolves two core pain points for retail investors in India:

1. **Portfolio fragmentation** — holdings scattered across brokers, mutual fund platforms, and bank accounts with no unified view.
2. **Limited awareness** — most investors are unfamiliar with alternative yield instruments like REITs, InvITs, and Corporate Bonds that could meaningfully improve their risk-return profile.

Rather than acting as another transaction broker, NIDHI serves as a **personal financial copilot** — building a complete picture of an investor's profile, analyzing their existing holdings, and recommending targeted allocations with explainable AI reasoning powered by **Google Gemini 2.5 Flash**.

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
- **Multi-Step Onboarding Flow** — captures investor variables (Age, Occupation, Income, Goals, Horizon, Capacity, Risk Appetite) before unlocking scoring diagnostics
- Cross-references investor profile details against current holdings to calculate gaps
- **3-question intent quiz** captures real-time goals, budget, and appetite before generating suggestions
- Recommends target allocations designed to fill gaps, not push generic products

### 💡 Smart Investment Hub
| Tab | Description |
|-----|-------------|
| **Recommended Allocation** | Personalized suitability targets after a quick intent quiz |
| **Explore All Assets** | Full asset browser with category filters |
| **High-Yield Trending** | Curated high-distribution picks (InvITs, AAA Bonds, G-Secs) |

Includes a **Simulated Partner Transaction Drawer** (Zerodha & Groww) that appends purchases directly into live portfolio holdings.

### 📚 Interactive Learning Center
- **📘 Learn About NIDHI Guide** — a comprehensive onboarding manual explaining dashboard widgets, page features, NIDHI scores calculation, AI models, and redirection partners
- **🔍 Searchable Financial Glossary** — instant filter search covering 22 core financial terms (Asset Allocation, Compounding, etc.) with simple explanations and examples
- Structured educational modules covering 7 asset classes with characteristics, risks, liquidity profiles, and tax treatment
- **Knowledge Check Quizzes** — 3-question multiple-choice assessments with instant scoring
- **Deep-link to Copilot** — pre-populated prompts that route learning topics directly to the AI assistant

### 💬 AI Financial Assistant (Gemini 2.5 Flash)
- Powered by **Google Gemini 2.0 Flash** with a rich financial system prompt injecting live portfolio data
- Gives specific, data-driven answers referencing your actual holdings, P&L, and profile — never generic
- Full **multi-turn conversation history** passed to Gemini on every message for coherent dialogue
- Persistent history saved per user (localStorage keyed by Firebase UID) — survives page refreshes
- Collapsible history sidebar with date-grouped past queries
- Automatic **local fallback engine** when Gemini API is unreachable (covers P&L, risk, rebalancing, tax, SIP planning)

### 🔒 Auth & Security
- Secure logins and sessions managed via **Firebase Authentication**
- Safe **blank-by-default login forms** preventing accidental form autofills
- **Firebase Email Verification Flow** — new accounts require validation before accessing the dashboard
- **Interactive Verification Block Screen** — unverified users are blocked and presented with resend and refresh status options
- Mapped readable user-friendly messages for all Firebase authentication errors (invalid credentials, weak passwords, etc.)

### ⚙️ Settings & Personalization
- **Linear/Vercel/CRED Inspired Design System** — custom color mappings (pitch black `#050505` dark mode and off-white `#f8f9fa` light mode)
- **Persistent Theme Toggle** — Sun/Moon switcher in top header (and on login/signup screens) that persists settings in `localStorage`
- **System Theme Auto-Detection** — matches local OS preferred system settings automatically on first-time visits
- **Liquid Theme Transitions** — global ease transitions (250ms duration) animating text, background, and border adjustments
- **Account & Profile** tab — displays investor profile details, Firebase account info, and portfolio summary
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
| SQLModel | 0.0.14 | ORM (PostgreSQL + SQLite fallback) |
| Pydantic | 2.0 | Request/response validation |
| Uvicorn | 0.22+ | ASGI server |
| python-dotenv | 1.0+ | Environment management |
| psycopg2-binary | 2.9+ | PostgreSQL driver |
| google-genai | 1.0+ | Gemini 2.0 Flash LLM |

### Infrastructure
| Service | Role |
|--------|------|
| **Neon PostgreSQL** | Persistent database (user profiles & holdings) |
| **Firebase Auth** | User authentication & session management |
| **Google Gemini 2.5 Flash** | AI Financial Assistant LLM |

---

## Project Structure

```
NIDHI/
├── .env.example              # Environment variable template (copy → .env)
├── .gitignore                # Comprehensive ignore rules
├── .gitattributes            # Line-ending normalization (LF)
├── README.md
├── sample_portfolio.csv      # CSV import template
│
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py           # FastAPI app + lifespan (init_db) + CORS
│       ├── db/
│       │   └── session.py    # SQLModel engine, get_session, init_db
│       ├── models/
│       │   └── database.py   # UserProfile, Holding SQLModel tables
│       ├── schemas/          # Pydantic request/response schemas
│       └── api/
│           ├── profile.py    # GET/POST /api/v1/profile/{user_id}
│           ├── portfolio.py  # CRUD    /api/v1/portfolio/{user_id}
│           ├── intelligence.py # POST  /api/v1/intelligence/analyze
│           ├── suitability.py  # POST  /api/v1/suitability/recommend
│           └── chat.py       # POST   /api/v1/chat/ask  (Gemini 2.0 Flash)
│
└── frontend/
    ├── index.html
    ├── package.json
    └── src/
        ├── App.tsx
        ├── context/
        │   ├── AuthContext.tsx         # Firebase auth + investor profile
        │   ├── PortfolioContext.tsx    # Holdings CRUD
        │   └── IntelligenceContext.tsx # Portfolio scoring
        ├── pages/
        │   ├── Auth/             # Login.tsx, Signup.tsx
        │   ├── Dashboard.tsx
        │   ├── Portfolio.tsx
        │   ├── Intelligence.tsx
        │   ├── Investments.tsx   # Smart Investment Hub + intent quiz
        │   ├── Assistant.tsx     # Gemini AI chat with history
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
| `POST` | `/api/v1/chat/ask` | Send message to Gemini AI assistant |

Interactive API docs: **http://localhost:8000/docs**

---

## Getting Started

### Prerequisites
- Python **3.11+**
- Node.js **18+**
- A [Firebase](https://console.firebase.google.com) project with **Email/Password** authentication enabled
- A [Neon](https://neon.tech) (or any PostgreSQL) database
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key for Gemini

### 1. Clone the Repository

```bash
git clone https://github.com/Hemanthsai456/nidhi.git
cd nidhi
```

### 2. Configure Environment Variables

The project uses **two separate `.env` files** — one for the backend (root) and one for the frontend.

#### Root `.env` — Backend secrets

```bash
cp .env.example .env
```

Fill in:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
GEMINI_API_KEY=your_google_gemini_api_key_here
```

#### `frontend/.env` — Frontend secrets

```bash
cp .env.example frontend/.env
```

Fill in:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:8000
```

> **`VITE_API_URL`** tells the frontend where the backend is running.
> For local development use `http://localhost:8000`. For a deployed backend, use its public URL.

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate — Windows
venv\Scripts\activate
# Activate — macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn app.main:app --reload --port 8000
```

On first startup, **database tables are created automatically** via SQLModel's `init_db()`. No migration tool required.

The console will confirm Gemini is connected:
```
[NIDHI] Gemini AI connected via google.genai SDK (gemini-2.5-flash)
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173** (or `:5174` if that port is busy).

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

### Backend (`root .env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string. Falls back to local SQLite if empty |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key. Falls back to local rule engine if missing |
| `FRONTEND_URL` | ⚙️ Production only | Allowed CORS origin for production frontend deployment |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_API_KEY` | ✅ | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | ✅ | Firebase app ID |
| `VITE_API_URL` | ✅ | Backend base URL (e.g. `http://localhost:8000`) |

---

## What's NOT in the Repository

These files/folders are gitignored and must be created locally:

| Path | How to get it |
|------|--------------|
| `.env` | `cp .env.example .env` then fill in credentials |
| `frontend/.env` | `cp .env.example frontend/.env` then fill in credentials |
| `backend/venv/` | `python -m venv venv && pip install -r requirements.txt` |
| `frontend/node_modules/` | `npm install` |
| `frontend/dist/` | `npm run build` (production only) |

---

## 🚀 Future Improvements

### 🔗 Real Broker Integration
- Replace simulated Zerodha/Groww drawers with live **Kite Connect API** (Zerodha) and **Groww Open API** connections
- OAuth-based broker authentication for automatic portfolio sync
- Real-time order placement and execution tracking
- Automatic holdings sync on every login — no manual CSV imports needed

### 📈 Live Market Data
- WebSocket integration for **real-time price feeds** (NSE/BSE) via market data providers
- Live P&L updates that refresh without page reloads
- Historical NAV data for mutual funds and ETFs to show accurate XIRR returns
- Price alerts — notify users when a holding crosses a defined target or stop-loss

### 🧠 Advanced AI Capabilities
- **Multi-model support** — switch between Gemini, GPT-4, and Claude via settings
- Voice-to-text input for the AI assistant
- Proactive AI nudges — "Your equity allocation drifted 15% from target, time to rebalance"
- AI-generated weekly portfolio performance reports delivered to email
- Goal tracker — visualize progress toward retirement/child education corpus targets

### 🏗️ Production Deployment
- **Docker + Docker Compose** setup for one-command local/cloud deployment
- CI/CD pipeline (GitHub Actions) for automated testing and deployment
- Deploy backend to **Railway / Render** and frontend to **Vercel / Netlify**
- Rate limiting and API key authentication for the backend
- Redis caching for intelligence scores and suitability recommendations

### 📱 Mobile App
- React Native mobile app sharing the same FastAPI backend
- Biometric login (Face ID / Fingerprint)
- Push notifications for price alerts, rebalancing reminders, and market events
- Offline mode with local portfolio cache

### 👥 Social & Community Features
- Anonymous portfolio benchmarking — compare your risk/return profile against peers by age group
- Community watchlists and trending asset discussions
- Financial advisor mode — advisors can view and manage multiple client portfolios

### 📊 Enhanced Analytics
- **XIRR / CAGR** calculation for each holding and overall portfolio
- Tax Harvest Dashboard — identify LTCG harvest opportunities before financial year end
- Monte Carlo simulation for retirement corpus probability modelling
- Custom report export (PDF) with charts and AI-generated insights

### 🪪 Government ID & KYC Verification
- **Aadhaar-based eKYC** — OTP verification via UIDAI APIs to instantly confirm investor identity without physical documents
- **PAN card verification** — validate PAN number against ITD database to meet SEBI KYC requirements before enabling investment features
- **DigiLocker integration** — let users pull verified documents (Aadhaar, PAN, bank statements) directly from their DigiLocker vault
- **SEBI KRA linkage** — check existing KYC status from CDSL/NSDL KYC Registration Agencies so already-verified investors skip re-verification
- **Video KYC (V-KYC)** — live video call with AI-assisted face-match and liveness detection for full remote onboarding compliance
- Re-KYC reminders and expiry tracking in the Settings page

---

## 🤝 Contributors

We welcome contributions from the community! Whether it's fixing bugs, improving documentation, enhancing the UI, or adding new features, every contribution is appreciated.

### Core Team

| Name | GitHub |
|------|--------|
| Hemanth Sai | @Hemanthsai456 |
| Srujan | @srujangandla |
| Babji | @bab109 |
| Chaitanya | @chaithanyakumarreddy57-spec |

---


## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for retail investors in India by Team NIDHI.

</div>
