# NIDHI - AI Investor Super App

## Project Overview

NIDHI is an AI-powered Investor Super App designed to solve one of the biggest problems faced by retail investors in India—fragmented investments and limited awareness of alternative investment products.

Instead of acting as another investment marketplace, NIDHI serves as an AI Financial Copilot that helps users understand their complete financial picture before making investment decisions.

The philosophy of the application is:

> Understand the investor first. Recommend investments second.

---

# Problem Statement

Retail investors usually invest through multiple brokers, banks and investment platforms.

As a result,

- investments are scattered across multiple applications
- users cannot easily understand their total wealth
- portfolio risks remain hidden
- diversification is poor
- awareness of investment products like REITs, InvITs and Corporate Bonds is limited

NIDHI solves these problems by aggregating investments into one intelligent dashboard and providing AI-driven portfolio analysis, suitability assessment and explainable investment recommendations.

---

# Core Features

## 1. Unified Portfolio

Aggregate investments from multiple sources.

Supported sources

- Account Aggregator (AA)
- Unified Investor Platform (UIP)
- Broker APIs
- Banks
- Manual Portfolio Import (MVP)

Features

- Unified Holdings
- Net Worth
- Portfolio Performance
- Asset Allocation
- Source Tracking
- Investment History

---

## 2. Portfolio Intelligence

The application analyzes the complete portfolio.

Metrics include

- Portfolio Health Score
- Diversification Score
- Sector Exposure
- Asset Allocation
- Liquidity Analysis
- Risk Score
- Portfolio Insights

The application explains every insight using simple language.

---

## 3. AI Suitability Engine

Before recommending investments the system evaluates

- User Goals
- Risk Appetite
- Investment Horizon
- Existing Investments
- Current Portfolio Allocation

Recommendations are based on portfolio gaps instead of generic product marketing.

Possible recommendations include

- REITs
- InvITs
- ETFs
- Corporate Bonds
- Government Securities
- Mutual Funds

---

## 4. AI Explanation Engine

Every recommendation must answer

- Why this recommendation?
- What portfolio problem does it solve?
- Benefits
- Risks
- Expected role in the portfolio

The AI should explain financial concepts in language understandable by beginners.

---

## 5. Financial Learning Center

Interactive education covering

- Stocks
- Mutual Funds
- ETFs
- REITs
- InvITs
- Bonds
- Government Securities

Users learn while investing.

---

## 6. Investment Marketplace

After receiving AI recommendations, users can invest directly through trusted partner platforms.

Flow

AI Recommendation

↓

View Details

↓

Invest Now

↓

Redirect to Partner Platform

↓

Investment Completed

↓

Portfolio Refresh

The application itself does not execute trades during the hackathon MVP.

---

# AI Workflow

Portfolio Data

↓

Portfolio Intelligence Engine

↓

Risk Analysis

↓

Diversification Analysis

↓

Portfolio Gap Detection

↓

Suitability Engine

↓

Recommendation Engine

↓

Gemini Explanation Layer

↓

Investor Dashboard

Important:

Gemini generates explanations only.

Investment logic must come from application rules and portfolio analysis.

---

# Tech Stack

Frontend

- React
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts

Backend

- FastAPI

Database

- PostgreSQL (Neon)

Authentication

- Firebase Authentication

AI

- Gemini API

Deployment

Frontend → Vercel

Backend → Render

Database → Neon PostgreSQL

---

# Coding Standards

- Use TypeScript.
- Build reusable components.
- Keep components small.
- Use shadcn/ui wherever possible.
- Use TailwindCSS.
- Use React Query for API calls if required.
- Keep API logic separate from UI.
- Maintain clean folder structure.
- Write readable and modular code.
- Use dummy/mock data until backend APIs are connected.

---

# UI Philosophy

Modern FinTech application.

Characteristics

- Clean
- Minimal
- Professional
- Premium
- Data-focused

Avoid clutter.

Every page should help investors make better financial decisions.

---

# Goal

Build a production-quality hackathon MVP demonstrating

- Portfolio Aggregation
- Portfolio Intelligence
- AI Suitability Analysis
- Explainable AI
- Financial Education
- Seamless Investment Access

The project should feel like a real fintech startup product rather than a college project.






