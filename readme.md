# StockPilot AI — Project Overview

This repository implements StockPilot AI: a full-stack application with a FastAPI backend that provides stock data, AI-driven analysis, portfolio management and a React + Vite frontend.

The document below explains the architecture, data flow, key components, deployment/run instructions, security and operational considerations, plus a focused Q&A-style section covering likely technical questions and concise answers.

**Repository Layout**
- **Backend**: [backend](backend)
  - FastAPI application entry: [backend/main.py](backend/main.py)
  - Core config & security: [backend/app/core](backend/app/core)
  - API routers: [backend/app/api](backend/app/api)
  - DB models: [backend/app/models](backend/app/models)
  - Pydantic schemas: [backend/app/schemas](backend/app/schemas)
  - Services (business logic): [backend/app/services](backend/app/services)
  - Dependencies (auth guards): [backend/app/dependencies](backend/app/dependencies)
- **Frontend**: [frontend](frontend)
  - React + Vite app under [frontend/src](frontend/src)
  - API client code: [frontend/src/api](frontend/src/api)
  - Services that call backend: [frontend/src/services](frontend/src/services)
  - Components & pages: [frontend/src/components](frontend/src/components) and [frontend/src/pages](frontend/src/pages)

 **High-level Architecture**
 - Frontend (React) communicates with the backend via REST calls to FastAPI. The UI authenticates users and stores a Bearer token in localStorage.
 - Backend exposes modular routers for Stocks, Analysis, Portfolio and Authentication. Business logic is implemented in service modules and uses third-party providers (yfinance, Google RSS/Yahoo news, OpenAI) to gather market and news data and produce AI analysis.
 - Add VADER-based sentiment quickly and return enriched news in `analysis` responses.  
 - Implemented a LangGraph-style pipeline (local lightweight implementation) that composes market fetch, news fetch, sentiment, and LLM analysis.

**Architecture Diagram**
Below is a visual architecture diagram (Mermaid) that illustrates the main components and data flow.

```mermaid
flowchart LR
  subgraph Frontend
    UI[React + Vite UI]
  end

  subgraph Backend
    API[FastAPI]
    Routes[API Routes]
    Pipeline[LangGraph-style Pipeline]
    Market[market_service]
    News[news_service]
    Sentiment[sentiment_service]
    AI[ai_analysis_service]
    Celery[Celery Worker]
    Redis[(Redis Cache)]
    DB[(Postgres DB)]
  end

  subgraph External
    YF[yfinance]
    RSS[feedparser / Google RSS / Yahoo]
    OPENAI[(OpenAI LLM)]
  end

  UI -->|REST /auth, /api, /analysis| API
  API --> Routes
  Routes --> Pipeline

  Pipeline --> Market
  Pipeline --> News
  News --> Sentiment
  Pipeline --> AI
  AI -->|LLM calls| OPENAI

  Market -->|market data| YF
  News -->|news feed| RSS

  API -->|enqueue background job| Celery
  Celery --> Pipeline
  Pipeline -->|store/cache results| Redis
  API -->|read/write| Redis

  API --> DB

  classDef external fill:#f9f,stroke:#333,stroke-width:1px;
  class YF,RSS,OPENAI external;
```

The diagram maps the primary request path: UI -> FastAPI -> Pipeline (market, news, sentiment, AI) with optional background execution via Celery and caching in Redis. External data sources are `yfinance`, RSS feeds, and OpenAI for LLM analysis.

---

Changes made in this update
- Added VADER-based sentiment analysis service: [backend/app/services/sentiment_service.py](backend/app/services/sentiment_service.py)
- Added a lightweight LangGraph-style pipeline orchestrator: [backend/app/services/langgraph_pipeline.py](backend/app/services/langgraph_pipeline.py)
- AI response validation: [backend/app/services/ai_analysis_service.py](backend/app/services/ai_analysis_service.py) now defensively parses LLM output and validates using Pydantic schema
- New Pydantic schemas for AI analysis and enriched articles: [backend/app/schemas/analysis.py](backend/app/schemas/analysis.py)
- `analysis` route now uses the pipeline and returns enriched `news_articles` with sentiment and `clean_text`: [backend/app/api/analysis_routes.py](backend/app/api/analysis_routes.py)
- Added required backend dependencies: [backend/requirements.txt](backend/requirements.txt)

How the new pipeline works (brief)
1. `market_service.get_stock_data` — retrieve market fundamentals
2. `news_service.get_stock_news` — fetch and deduplicate news
3. `sentiment_service.analyze_articles` — attach VADER sentiment and `clean_text` to each article
4. `ai_analysis_service.analyze_stock` — call OpenAI, parse JSON response and validate against `AnalysisResponse`

Developer notes
- The LangGraph pipeline here is a local, dependency-free orchestration (file: `backend/app/services/langgraph_pipeline.py`) so you can iterate without adding a third-party runtime. If you want, I can swap this for an official `langgraph` package integration and wire real graph nodes and a UI.
- VADER is a lightweight NLP tool good for short texts (news headlines and summaries). For higher accuracy consider a transformer-based sentiment model later.

Next steps I can take for you
- Swap local pipeline for official LangGraph package nodes and add observability.
- Implement Redis caching + background job queue for LLM analysis.
- Add unit tests for pipeline nodes and CI configuration.

---

New features implemented in this iteration
- LangGraph-style pipeline (local implementation) orchestrates market/news/sentiment/LLM analysis.
- Background processing using Celery with Redis: analyses can be enqueued and results cached.
- Sentiment: transformer-based sentiment is used when `transformers` is available; otherwise VADER fallback.
- Pydantic validation of AI responses to ensure the API returns consistent structured JSON.
- Unit tests + GitHub Actions CI to run backend tests.

How to run the background worker and Redis
1. Install Redis locally (macOS Homebrew example):

```bash
brew install redis
brew services start redis
```

2. Ensure `REDIS_URL` is set in your `.env` (example in `backend/.env.example`).

3. Start the Celery worker from the repository root:

```bash
cd backend
source .venv/bin/activate
# run worker (named stockpilot)
celery -A celery_app.celery_app worker --loglevel=info
```

4. To enqueue an analysis via the API, call:

```
GET /analysis/{ticker}?background=true
```

5. Check task status:

```
GET /analysis/status/{task_id}
```

Transformer sentiment notes
- If you install `transformers` + `torch` (large dependency), the sentiment service will automatically use a HF sentiment pipeline. For modest environments, the fallback VADER remains available.

Testing & CI
- Run backend tests locally:

```bash
cd backend
pytest -q
```

- CI: a GitHub Actions workflow is included at `.github/workflows/ci.yml` and runs tests on pushes/PRs to `main`.

**Benchmarks**
- **Test Summary:** 3 passed, 0 failed, 2 warnings — `pytest -q` — duration: 29.62s.
- **Virtualenv Size:** 1.1G (`du -sh .venv`).
- **Installed Packages:** 118 packages in the backend virtualenv (`pip list --format=freeze | wc -l`).
- **Top packages by disk usage:**
  - **torch:** 583M
  - **transformers:** 110M
  - **sympy:** 72M
  - **pandas:** 70M
  - **numpy:** 34M
  - **openai:** 23M
  - **lxml:** 20M
  - **sqlalchemy:** 18M
  - **networkx:** 17M
  - **pip:** 12M

Commands used to collect these metrics (run from `backend`):

```bash
cd backend
source .venv/bin/activate
pytest -q
du -sh .venv
pip list --format=freeze | wc -l
du -sh .venv/lib/python*/site-packages/* | sort -hr | head -n 10
```

**Resume Data & Benchmarks**
- **Purpose:** Concrete, resume-friendly metrics and sample output from local runs (useful for bullet points on CV/LinkedIn).

- **Pipeline Sample (AAPL)**
  - **Ticker / Company:** AAPL / Apple Inc.
  - **Market fetch time:** 1.77 s
  - **News fetched:** 10 articles
  - **News fetch time:** 0.81 s
  - **Sentiment processing time:** 0.75 s (transformer fallback used)
  - **Sentiment distribution (sample run):** 4 positive, 6 negative, 0 neutral

- **Sample article (trimmed):**

  {
    "title": "Amazon Could Buy Up to $60 Billion From Qualcomm Just as Apple Brings Modems In-House. Is the AI Pivot Real?",
    "source": "Insider Monkey",
    "published_at": "2026-09-15T04:11:25Z",
    "url": "https://finance.yahoo.com/technology/ai/articles/amazon-could-buy-60-billion-041125286.html",
    "sentiment": {"label": "NEGATIVE", "score": 0.997}
  }

- **Commands used to gather metrics (from `backend`):**

```bash
source .venv/bin/activate
# run tests
pytest -q
# quick pipeline benchmark (example script calls market_service, news_service, sentiment_service)
python tools/bench_pipeline.py  # (or run the quick script shown earlier from the repo root)

# environment metrics
du -sh .venv
pip list --format=freeze | wc -l
du -sh .venv/lib/python*/site-packages/* | sort -hr | head -n 10
```

- **Resume-ready bullets (pick/adapt):**
  - **Implemented an AI-driven equity research pipeline** (FastAPI) that fetches market data, aggregates news, annotates articles with transformer/VADER sentiment, and prepares structured prompts for LLM analysis — validated by unit tests (3 passed).
  - **Built a news + sentiment microservice** that annotates ~10 recent articles per ticker and completes news+sentiment processing in ~1.6s (sample AAPL run: 0.81s news fetch + 0.75s sentiment).
  - **Hardened LLM integration** with defensive parsing and Pydantic validation to guarantee structured JSON outputs and prevent malformed responses from breaking downstream consumers.
  - **Scaled expensive operations** via Celery background tasks and Redis caching (TTL 1 hour) to reduce repeated LLM calls and improve user-facing latency.
  - **Maintained CI & reproducible dev environment** — local test suite runs in ~30s; development virtualenv footprint ~1.1GB (includes optional transformer runtime).

- **Caveats to include when presenting these numbers:**
  - OpenAI LLM call timings and cost were not included in the pipeline benchmark (requires `OPENAI_API_KEY`). End-to-end latency and cost vary by chosen model and network conditions.
  - The transformer sentiment fallback requires heavy dependencies (`torch`, `transformers`) that increase dev environment size; VADER provides a lightweight local fallback.
  - These metrics were collected on a developer MacBook (local environment) and will differ in cloud or production deployments (CPU vs GPU, network latency).

If you want, I can convert the bullets into 1-line LinkedIn-ready variants and add them to the top of `README.md` as a short "Elevator Summary" suitable for résumés and project pages.

Operational notes & caveats
- `torch` installation can be heavy; you may prefer CPU-only wheels or to use a remote inference service for transformer-based sentiment.
- Celery requires Redis (or another broker) to be configured; set `REDIS_URL` in `.env`.
- The pipeline caches analysis results in Redis for 1 hour (configurable).

- Persistence: SQLAlchemy ORM with PostgreSQL (connection configured in [backend/app/core/database.py](backend/app/core/database.py)). Models include `User` and `PortfolioHolding`.
- Authentication: JWT tokens are created/verified in [backend/app/core/jwt_handler.py](backend/app/core/jwt_handler.py). Password hashing uses `passlib` via [backend/app/core/security.py](backend/app/core/security.py).

Data flow (typical analysis request):
1. Frontend calls `GET /analysis/{ticker}` ([backend/app/api/analysis_routes.py](backend/app/api/analysis_routes.py)).
2. Backend fetches market data via Yahoo (yfinance) in `market_service` and retrieves news via `news_service`.
3. `build_news_context` converts articles into a string context.
4. `ai_analysis_service` sends prompt+context to OpenAI and returns structured JSON analysis.

Key files to inspect for behavior and logic:
- [backend/main.py](backend/main.py) — app setup and router registration
- [backend/app/api/stock_routes.py](backend/app/api/stock_routes.py) — public stock endpoints using `/api/stocks`
- [backend/app/api/analysis_routes.py](backend/app/api/analysis_routes.py) — analysis workflow
- [backend/app/services/ai_analysis_service.py](backend/app/services/ai_analysis_service.py) — OpenAI prompt and response parsing
- [backend/app/services/news_service.py](backend/app/services/news_service.py) — Google/Yahoo news harvesting and deduplication
- [backend/app/services/portfolio_services.py](backend/app/services/portfolio_services.py) — CRUD for portfolio holdings
- [backend/app/services/auth_services.py](backend/app/services/auth_services.py) — user creation and login
- [frontend/src/services/*](frontend/src/services) — wrappers that call backend endpoints

Environment & Secrets
- Backend expects environment variables configured via `.env` (see [backend/app/core/config.py](backend/app/core/config.py)): `OPENAI_API_KEY`, `NEWS_API_KEY`, `SECRET_KEY`.
- Database connection string is in [backend/app/core/database.py](backend/app/core/database.py) (currently: `postgresql://stockpilot_user:stockpilot123@localhost:5432/stockpilot`). Replace for production.

Run / Development Instructions
- Backend (Python, FastAPI)
  - Create virtualenv and install `requirements.txt` in `backend/`.
  - Export env vars or create `.env` at backend root with required keys.
  - Run with Uvicorn:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# ensure Postgres is running and reachable
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Frontend (React + Vite)
  - Install and run dev server:

```bash
cd frontend
npm install
npm run dev
```

API Endpoints (summary)
- Authentication
  - POST `/auth/signup` — register ([backend/app/api/auth_routes.py](backend/app/api/auth_routes.py))
  - POST `/auth/login` — login (returns bearer token)
  - GET `/auth/me` — current user (protected)
  - GET `/auth/protected` — sample protected route
- Stocks
  - GET `/api/stocks/{ticker}` — current stock info ([backend/app/api/stock_routes.py](backend/app/api/stock_routes.py))
  - GET `/api/stocks/{ticker}/history?period=1y` — historical data (allowed periods validated)
- Analysis
  - GET `/analysis/{ticker}` — full analysis (market, news, AI) — protected by token if client includes it
- Portfolio
  - POST `/portfolio` — add holding
  - GET `/portfolio` — get all holdings for current user
  - GET `/portfolio/{id}` — get single holding
  - PUT `/portfolio/{id}` — update holding
  - DELETE `/portfolio/{id}` — delete holding

Security & Auth Details
- Authentication uses JWT (`HS256`) with `SECRET_KEY` from environment. Token creation/verification in [backend/app/core/jwt_handler.py](backend/app/core/jwt_handler.py). Tokens encode `sub` as the user id.
- Passwords are hashed with bcrypt via `passlib` in [backend/app/core/security.py](backend/app/core/security.py).
- Protected routes use an HTTP Bearer dependency implemented in [backend/app/dependencies/auth.py](backend/app/dependencies/auth.py) that extracts the token, verifies it, and loads the `User` from DB.

Third-party integrations
- yfinance (`yfinance`) — stock metrics and news (backup) ([backend/app/services/market_service.py](backend/app/services/market_service.py), [backend/app/services/stock_services.py](backend/app/services/stock_services.py)).
- Google News RSS via `feedparser` — primary news source in `[backend/app/services/news_service.py](backend/app/services/news_service.py)`.
- OpenAI — used in `ai_analysis_service` to generate structured JSON analysis. The prompt enforces a JSON return; responses are parsed with `json.loads`.

Operational notes & gotchas
- OpenAI responses are not guaranteed to be valid JSON — `ai_analysis_service` currently wraps the call in try/except and returns None on parsing errors. Consider adding response sanitization or using the responses API's structured outputs.
- `news_service.get_yahoo_news` depends on `yfinance`'s `.news` which can have variable shapes; code defensively handles missing fields but tests should cover edge cases.
- Database migrations are not included; `Base.metadata.create_all(bind=engine)` is run in `main.py` to create tables. For production, adopt Alembic migrations.
- CORS currently allows `http://localhost:5173` only. Adjust for deployment.

Testing
- Backend has tests under `backend/test_analysis.py` and `backend/test_news.py`. Run them with pytest after installing dev requirements.

Design & Extensibility Notes
- Service layer separation: business logic lives in `backend/app/services/*`. Routes glue HTTP to services and schemas.
- Adding providers: `news_service` is easy to extend with other providers (e.g., NewsAPI) and to make provider selection pluggable.
- AI safety: limit prompt injection by sanitizing article text, and add rate-limiting and retries for the OpenAI calls.

Q&A-style analysis (concise technical questions and answers)

**Authentication & Security**
- Q: How are passwords stored and verified?
  - A: Passwords are hashed using bcrypt via `passlib` in [backend/app/core/security.py](backend/app/core/security.py). Verification uses `pwd_context.verify`.

- Q: How does the JWT flow work?
  - A: On successful login, `create_access_token` produces a JWT with `sub` set to the user id and an expiration of 60 minutes. `verify_token` decodes the token using `SECRET_KEY` and `HS256`.

- Q: Where is token validation enforced?
  - A: The dependency `get_current_user` in [backend/app/dependencies/auth.py](backend/app/dependencies/auth.py) is used by protected routes (via `Depends`) to verify tokens and load the `User` instance.

**Database & Models**
- Q: What database and ORM are used?
  - A: PostgreSQL (connection string in code) with SQLAlchemy ORM. Declarative base is defined in [backend/app/core/database.py](backend/app/core/database.py).

- Q: What are the main models and constraints?
  - A: `User` with unique email and username ([backend/app/models/user.py](backend/app/models/user.py)). `PortfolioHolding` contains `user_id`, `ticker`, `company_name`, `quantity`, `average_price`, and a unique constraint per user/ticker (`unique_user_ticker`) ([backend/app/models/portfolio.py](backend/app/models/portfolio.py)).

**API & Business Logic**
- Q: How is stock market data fetched?
  - A: Via `yfinance` in `market_service` and `stock_services`. `get_stock_data` gathers multiple metrics from `stock.info`; `get_stock_history` fetches historical close prices.

- Q: How are news articles aggregated and deduplicated?
  - A: `news_service.get_stock_news` calls `get_google_news` (RSS via `feedparser`) and `get_yahoo_news` (via yfinance), concatenates results and deduplicates by normalized title.

- Q: How does the AI analysis get invoked and what format does it return?
  - A: `analysis_routes.analyze_ticker` constructs market_data and news_context and passes them to `ai_analysis_service.analyze_stock`, which calls OpenAI with a prompt that requests strict JSON. The service returns parsed JSON with keys: `summary`, `bullish_factors`, `bearish_factors`, `opportunities`, `risks`, `recommendation`, `confidence_score`.

**Frontend**
- Q: How is authentication handled on the frontend?
  - A: The app stores the token in `localStorage` under `token`. `AuthContext` on load calls `getCurrentUser` (`frontend/src/services/authService.ts`) which calls `/auth/me` to validate token and load user.

- Q: How does the frontend fetch stock and analysis data?
  - A: `frontend/src/api/stockApi.ts` wraps the `/api/stocks` endpoints. `frontend/src/services/analysisService.ts` calls `/analysis/{ticker}`. Portfolio operations use `frontend/src/services/portfolioService.ts` and include the `Authorization` header using the token helper.

**Reliability, Performance & Scaling**
- Q: What are the main bottlenecks or failure points?
  - A: External dependencies (OpenAI, yfinance, RSS endpoints) — network latency and rate limits. OpenAI calls may be slow; consider async queues, caching, and background tasks for analysis.

- Q: How to scale the AI analysis?
  - A: Add an async job queue (e.g., Celery/RQ) and return job IDs from the analysis endpoint. Cache recent analyses in Redis to avoid repeated OpenAI calls for same ticker/time window.

**Improvements & TODOs**
- Add proper DB migrations (Alembic) instead of create_all in `main.py`.
- Harden OpenAI response parsing: use schema validation and fallback strategies.
- Add rate-limiting and exponential backoff for external API calls.
- Move secrets to a secure store (Vault / environment), and remove plaintext DB creds from code.
- Add integration tests and CI pipeline.

Where to look next
- For authentication flow: [backend/app/services/auth_services.py](backend/app/services/auth_services.py) and [backend/app/dependencies/auth.py](backend/app/dependencies/auth.py).
- For AI prompt behavior: [backend/app/services/ai_analysis_service.py](backend/app/services/ai_analysis_service.py).
- For frontend data flow: [frontend/src/context/AuthContext.tsx](frontend/src/context/AuthContext.tsx) and [frontend/src/services/*](frontend/src/services).

If you want, I can:
- run the backend tests and report failures
- add input validation for the OpenAI response and a safer parse path
- extract the DB URL into `.env` and add an example `.env.example`

---
Generated from scanning the repository; let me know which section you want expanded into diagrams, code examples, or sample answers tailored to a particular role or depth level.
