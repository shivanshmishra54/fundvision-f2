# FundVision Frontend

Complete React + TypeScript frontend for FundVision financial analysis platform.
Fully connected to the Django backend.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start Django backend first (separate terminal)
```bash
cd fundvision_backend
source venv/Scripts/activate       # Windows Git Bash
daphne -b 0.0.0.0 -p 8000 fundvision.asgi:application
```

### 3. Start React dev server
```bash
npm run dev
```

Open **http://localhost:5173**

---

## What's connected to the backend

| Feature | API Endpoint |
|---|---|
| Search bar (hero + navbar) | `GET /api/v1/stocks/search/?q=` |
| Login page | `POST /api/v1/auth/login/` |
| Register page | `POST /api/v1/auth/register/` |
| Market overview (Nifty, Sensex) | `GET /api/v1/market/overview/` + WebSocket `ws/market/` |
| Company details page | `GET /api/v1/stocks/<SYMBOL>/` |
| Live stock price | WebSocket `ws/stock/<SYMBOL>/` |
| Follow / Unfollow button | `POST /api/v1/auth/watchlist/toggle/` |
| Guest → Login modal trigger | Automatic on 401 responses |

## Auth flow
- JWT tokens stored in `localStorage` (`access_token`, `refresh_token`, `user`)
- Navbar automatically shows Profile icon with initials after login
- Clicking Follow/Export as a guest opens the login modal (no page redirect)
- Token auto-refreshes before expiry

## Project structure
```
src/
├── api/
│   ├── client.ts         ← Axios instance with JWT + token refresh
│   ├── auth.ts           ← login, register, logout, watchlist
│   └── stocks.ts         ← search, stock detail, chart, market
├── app/
│   ├── context/
│   │   ├── AuthContext.tsx   ← global user state
│   │   └── ThemeContext.tsx  ← light/dark/auto theme
│   ├── components/
│   │   ├── Navbar.tsx        ← Profile icon when logged in
│   │   ├── AuthNavbar.tsx    ← Company pages navbar
│   │   ├── SearchBar.tsx     ← Live search with dropdown
│   │   ├── MarketOverview.tsx ← Live Nifty/Sensex
│   │   ├── LoginModal.tsx    ← Auto-triggered popup
│   │   ├── HeroSection.tsx   ← Landing search
│   │   └── company/          ← All financial tab components
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx     ← Real backend auth
│   │   ├── RegisterPage.tsx  ← Real backend auth
│   │   └── CompanyDetailsPage.tsx ← Live data + WebSocket
│   └── App.tsx               ← AuthProvider + LoginModal wrapper
└── styles/
```
