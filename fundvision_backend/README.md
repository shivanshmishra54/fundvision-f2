# FundVision — Django Backend

Production-ready Django REST Framework backend for the FundVision financial analysis platform.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Django 5.0 + Django REST Framework 3.15 |
| Database | MySQL 8.0 (with `select_related` / `prefetch_related` throughout) |
| Auth | JWT via `djangorestframework-simplejwt` |
| Real-time | Django Channels 4 + Redis channel layer (WebSockets) |
| Task Queue | Celery 5 + Redis broker + `django-celery-beat` |
| API Docs | `drf-spectacular` (Swagger UI at `/api/docs/`) |
| CORS | `django-cors-headers` |

---

## Project Structure

```
fundvision_backend/
├── fundvision/                  # Django project package
│   ├── settings.py              # All configuration (DB, JWT, CORS, Channels, Celery)
│   ├── urls.py                  # Root URL conf + Swagger docs
│   ├── asgi.py                  # ASGI entry-point (HTTP + WebSocket)
│   ├── wsgi.py                  # WSGI entry-point (HTTP only)
│   ├── celery.py                # Celery app
│   └── exceptions.py            # Global standardised error handler
│
├── apps/
│   ├── users/                   # Authentication, profiles, watchlist, history
│   │   ├── models.py            # User, UserHistory, Watchlist
│   │   ├── serializers.py       # JWT custom token, registration, profile, watchlist
│   │   ├── views.py             # Auth ViewSets, watchlist CRUD, history
│   │   ├── urls.py
│   │   ├── middleware.py        # GuestAuthMiddleware
│   │   └── permissions.py       # IsAuthenticatedForAction (LOGIN_MODAL trigger)
│   │
│   ├── stocks/                  # Stock data, financials, charts
│   │   ├── models.py            # Stock, StockPrice, ProfitLoss, BalanceSheet, CashFlow, Ratios…
│   │   ├── serializers.py       # All financial serializers matched to React component shapes
│   │   ├── views.py             # StockViewSet, FinancialsView, PeersView, ShareholdingView
│   │   ├── consumers.py         # StockTickerConsumer (WebSocket per symbol)
│   │   ├── routing.py           # ws/stock/<SYMBOL>/
│   │   ├── urls.py
│   │   └── management/commands/seed_stocks.py   # Dev seed data
│   │
│   └── market/                  # Indices, market status, real-time sync
│       ├── models.py            # MarketIndex, IndexPrice, MarketStatus
│       ├── serializers.py
│       ├── views.py             # MarketOverviewView, MarketStatusView
│       ├── consumers.py         # MarketOverviewConsumer (ws/market/)
│       ├── routing.py
│       ├── tasks.py             # Celery: sync_index_data, sync_market_data
│       ├── middleware.py        # JWTAuthMiddlewareStack for WebSockets
│       └── urls.py
│
├── manage.py
├── requirements.txt
└── .env.example
```

---

## Quick Start

### 1. Prerequisites

```bash
# MySQL 8.0+
brew install mysql     # macOS
sudo apt install mysql-server   # Ubuntu

# Redis
brew install redis     # macOS
sudo apt install redis-server   # Ubuntu

# Python 3.12+
python --version
```

### 2. Clone & Setup

```bash
git clone <repo>
cd fundvision_backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your DB credentials, Redis URL, and API keys
```

### 4. Create MySQL Database

```sql
CREATE DATABASE fundvision_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'fundvision_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON fundvision_db.* TO 'fundvision_user'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Run Migrations & Seed

```bash
python manage.py migrate
python manage.py seed_stocks           # Loads sample stocks + financials
python manage.py createsuperuser       # Admin access at /admin/
```

### 6. Start Services

**Terminal 1 — Django (Daphne ASGI for WebSocket support):**
```bash
daphne -b 0.0.0.0 -p 8000 fundvision.asgi:application
```

**Terminal 2 — Celery Worker:**
```bash
celery -A fundvision worker -l info
```

**Terminal 3 — Celery Beat (periodic tasks scheduler):**
```bash
celery -A fundvision beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

**Terminal 4 — Redis (if not running as service):**
```bash
redis-server
```

---

## API Reference

Interactive Swagger docs available at: **`http://localhost:8000/api/docs/`**

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register/` | Create account (rate: 3/hr) |
| POST | `/api/v1/auth/login/` | JWT login → returns tokens + user metadata (rate: 5/min) |
| POST | `/api/v1/auth/logout/` | Blacklist refresh token |
| POST | `/api/v1/auth/token/refresh/` | Rotate access token |
| GET | `/api/v1/auth/check/` | Check-Auth — returns 401 + `LOGIN_MODAL` trigger for guests |
| GET/PATCH | `/api/v1/auth/profile/` | Read/update profile |
| POST | `/api/v1/auth/change-password/` | Change password |

**Login response shape** (used to update frontend header immediately):
```json
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": {
    "id": 1,
    "email": "raj@example.com",
    "full_name": "Raj Kumar",
    "initials": "RK",
    "profile_picture_url": "http://localhost:8000/media/profile_pics/1/profile.jpg"
  }
}
```

### Watchlist (Follow Feature)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/auth/watchlist/` | List all followed stocks |
| POST | `/api/v1/auth/watchlist/` | Follow a stock |
| DELETE | `/api/v1/auth/watchlist/<id>/` | Unfollow |
| POST | `/api/v1/auth/watchlist/toggle/` | Toggle follow/unfollow (used by Follow button) |
| GET | `/api/v1/auth/watchlist/check/<SYMBOL>/` | Is this stock followed? |

**Toggle request body:**
```json
{ "stock_symbol": "RELIANCE", "stock_name": "Reliance Industries Ltd" }
```

**Guest accessing a protected action (Follow, Export):**
```json
HTTP 401
{
  "error": "Login required to perform this action.",
  "code": 401,
  "trigger": "LOGIN_MODAL"
}
```
The frontend checks for `trigger === "LOGIN_MODAL"` and opens the login modal.

### Stocks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/stocks/` | Paginated stock list |
| GET | `/api/v1/stocks/<SYMBOL>/` | Full company detail (all financials in one response) |
| GET | `/api/v1/stocks/search/?q=<query>` | Fast search (rate: 30/min) |
| GET | `/api/v1/stocks/<SYMBOL>/chart/?interval=1d&from_date=2024-01-01` | OHLCV for Recharts |
| GET | `/api/v1/stocks/<SYMBOL>/financials/` | P&L, Balance Sheet, Cash Flow, Ratios, Quarterly |
| GET | `/api/v1/stocks/<SYMBOL>/peers/` | Peer comparison table |
| GET | `/api/v1/stocks/<SYMBOL>/shareholding/` | Investor breakdown |
| GET | `/api/v1/stocks/<SYMBOL>/export/` | 🔒 Requires login |

**Financials response shape** (maps to all four React financial tabs):
```json
{
  "symbol": "COASTALCORP",
  "consolidated": true,
  "profit_loss": [
    { "year": "Mar 2024", "sales": 436, "expenses": 407, "opProfit": 28, "opm": "6%", ... }
  ],
  "balance_sheet": [...],
  "cash_flow": [...],
  "ratios": [...],
  "quarterly": [...]
}
```

### Market

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/market/overview/` | Nifty 50, Sensex + 7-day sparkline (cached 10s) |
| GET | `/api/v1/market/status/` | Market open/closed status |
| GET | `/api/v1/market/index/<SYMBOL>/` | Detailed index data |

### User History

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/auth/history/` | Last 50 viewed stocks |
| DELETE | `/api/v1/auth/history/clear/` | Clear all history |

---

## WebSocket Connections

### Market Overview Stream

```javascript
// Connect (guests allowed — no token needed for read-only data)
const ws = new WebSocket('ws://localhost:8000/ws/market/');

// With auth (for personalized features)
const ws = new WebSocket(`ws://localhost:8000/ws/market/?token=${accessToken}`);

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'market_update') {
    // msg.indices = [{ symbol, current_value, day_change, day_change_pct, ... }]
    updateMarketOverview(msg.indices);
  }
  if (msg.type === 'market_status_change') {
    updateMarketStatus(msg.is_open);
  }
};

// Keepalive
setInterval(() => ws.send(JSON.stringify({ action: 'ping' })), 30000);
```

### Individual Stock Ticker

```javascript
// Subscribe to a specific stock
const ws = new WebSocket(`ws://localhost:8000/ws/stock/RELIANCE/?token=${accessToken}`);

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'price_update') {
    // { symbol, price, change, change_pct, volume, open, high, low, timestamp }
    updateStockPrice(msg);
  }
};
```

**Broadcast flow:**
```
Yahoo Finance / Groww API
    ↓  (every 3–5s via Celery Beat)
Celery Task (sync_index_data / sync_market_data)
    ↓  (group_send)
Redis Channel Layer
    ↓  (fan-out to all connected clients)
MarketOverviewConsumer / StockTickerConsumer
    ↓  (WebSocket message)
React Frontend
```

---

## Architecture Decisions

### N+1 Query Prevention

Every detail view uses `select_related` + `prefetch_related`. For example, the stock detail view:

```python
Stock.objects.filter(symbol=symbol)
    .select_related("overview")
    .prefetch_related(
        "profit_loss", "balance_sheets", "cash_flows",
        "ratios", "quarterly_results", "peers", "shareholding"
    )
```

This executes **9 optimized queries** instead of potentially hundreds.

### Guest Auth / LOGIN_MODAL Flow

```
Guest clicks "Follow" button
  → POST /api/v1/auth/watchlist/toggle/
  → Django: IsAuthenticatedForAction.has_permission() → False
  → Response: HTTP 401 { "trigger": "LOGIN_MODAL" }
  → React frontend: intercepts 401 with LOGIN_MODAL trigger
  → Opens login modal (no page navigation)
  → User logs in → receives tokens + user metadata
  → Header updates with Profile Icon
  → Retries the original action
```

### Standardized Error Responses

All errors across the entire API return the same shape:
```json
{
  "error": "Human-readable message",
  "code": 404,
  "details": { "field": ["Validation error message"] }
}
```

### Rate Limiting (Throttling)

| Endpoint | Limit |
|---|---|
| Login | 5 requests / minute (per IP) |
| Register | 3 requests / hour (per IP) |
| Search | 30 requests / minute |
| Authenticated users | 1000 requests / day |
| Anonymous | 100 requests / day |

### Redis Caching Strategy

| Data | TTL | Reason |
|---|---|---|
| Market overview | 10 seconds | Live data, short TTL |
| Stock chart data | 60 seconds | Near-real-time |
| Financial statements | 5 minutes | Changes daily at most |
| Search results | 30 seconds | High frequency, low change |
| Live price (WebSocket seed) | 60 seconds | Instant on-connect data |

---

## Database Schema

Key indexes for performance:

```sql
-- Stock lookups
CREATE INDEX idx_stock_symbol   ON stocks_stock(symbol);
CREATE INDEX idx_stock_sector   ON stocks_stock(sector);

-- Price time-series (most critical — powers all chart queries)
CREATE INDEX idx_price_stock_ts ON stocks_price(stock_id, timestamp, interval);

-- User history fast lookups
CREATE INDEX idx_history_user_time ON users_history(user_id, viewed_at DESC);

-- Watchlist membership check
CREATE INDEX idx_watchlist_user_symbol ON users_watchlist(user_id, stock_symbol);

-- Index price time-series
CREATE INDEX idx_idxprice_idx_ts ON market_index_price(index_id, timestamp);
```

---

## Development Commands

```bash
# Run all tests
python manage.py test

# Create new migration after model changes
python manage.py makemigrations
python manage.py migrate

# Seed development data
python manage.py seed_stocks
python manage.py seed_stocks --clear    # Wipe and re-seed

# Inspect Celery tasks
celery -A fundvision inspect active

# Open Django shell with all models imported
python manage.py shell_plus             # requires django-extensions

# Check for security issues
python manage.py check --deploy
```

---

## Frontend Integration Checklist

- [ ] Set `Authorization: Bearer <access_token>` header on all authenticated requests
- [ ] Store `access` and `refresh` tokens in `httpOnly` cookies or `localStorage`
- [ ] On 401 response with `"trigger": "LOGIN_MODAL"` → open login modal
- [ ] On login success → update header using `user.initials` and `user.profile_picture_url`
- [ ] Connect `ws://host/ws/market/` for MarketOverview.tsx live data
- [ ] Connect `ws://host/ws/stock/<SYMBOL>/` on CompanyDetailsPage mount
- [ ] Call `/api/v1/auth/check/` on app load to restore session
- [ ] Call `/api/v1/auth/token/refresh/` before access token expiry (60 min window)
