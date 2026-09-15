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
