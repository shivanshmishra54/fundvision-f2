import { useEffect, useState } from "react";

// Fallback mock data if the user goes offline
const MOCK = {
  sensex: { price: 73648.62, change: 312.45, changePct: 0.43 },
  nifty:  { price: 22326.90, change:  97.30, changePct: 0.44 },
};

// Fetching from Groww's unauthenticated live market endpoints
async function fetchIndex(exchange: string, symbol: string) {
  const targetUrl = `https://groww.in/v1/api/stocks_data/v1/tr_live_indices/exchange/${exchange}/segment/CASH/${symbol}/latest?t=${Date.now()}`;
  const proxyUrl  = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

  // Manual timeout — avoids AbortError from AbortSignal.timeout()
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), 6000)
  );

  const res = await Promise.race([fetch(proxyUrl), timeout]);
  if (!res.ok) throw new Error(`Failed to fetch ${symbol}`);

  const data     = await res.json();
  const liveData = data.livePriceDto;

  return {
    price:     liveData.ltp        as number,
    change:    liveData.dayChange  as number,
    changePct: liveData.dayChangePerc as number,
  };
}

function getMarketStatus() {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const h = istTime.getHours();
  const m = istTime.getMinutes();
  const d = istTime.getDay();
  
  const isWeekend = d === 0 || d === 6;
  // Market is open 9:15 AM to 3:30 PM IST
  const isOpen =
    !isWeekend &&
    (h > 9 || (h === 9 && m >= 15)) &&
    (h < 15 || (h === 15 && m <= 30));
    
  return { isOpen, isWeekend };
}

export function StatsRow() {
  const [statsData, setStatsData] = useState([
    { label: "Sensex",        value: "...",        change: "Loading..." },
    { label: "Nifty 50",      value: "...",        change: "Loading..." },
    { label: "Market Status", value: "...",        change: "" },
    { label: "Data Source",   value: "Fetching…",  change: "" },
  ]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const { isOpen, isWeekend } = getMarketStatus();
      let sensex = MOCK.sensex;
      let nifty  = MOCK.nifty;
      let source = "Mock Data";
      let sourceNote = "Live API unavailable";

      try {
        // Fetch BSE (Sensex) and NSE (Nifty) simultaneously
        const [s, n] = await Promise.all([
          fetchIndex("BSE", "SENSEX"),
          fetchIndex("NSE", "NIFTY"),
        ]);
        sensex = s;
        nifty  = n;
        source = "Live Market Data";
        sourceNote = "Real-time via Groww";
      } catch {
        // Silently fall back to mock data — proxy/API unavailable in this environment
      }

      if (!isMounted) return;

      setStatsData([
        {
          label:  "Sensex",
          value:  sensex.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          change: `${sensex.change >= 0 ? "+" : ""}${sensex.change.toFixed(2)} (${sensex.changePct.toFixed(2)}%)`,
        },
        {
          label:  "Nifty 50",
          value:  nifty.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          change: `${nifty.change >= 0 ? "+" : ""}${nifty.change.toFixed(2)} (${nifty.changePct.toFixed(2)}%)`,
        },
        {
          label:  "Market Status",
          value:  isOpen ? "Open" : "Closed",
          change: isWeekend ? "Weekend" : "9:15 AM – 3:30 PM IST",
        },
        {
          label:  "Data Source",
          value:  source,
          change: sourceNote,
        },
      ]);
    }

    load();
    // Refresh every 60 seconds to avoid hitting proxy rate limits
    const interval = setInterval(load, 60000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12 bg-white dark:bg-[#1F2937]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {statsData.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#4B5563] rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-xl md:text-3xl font-semibold text-[#111827] dark:text-white">
              {stat.value}
            </div>
            <div className="text-xs md:text-sm text-[#9CA3AF] mt-1">
              {stat.label}
            </div>
            <div
              className={`text-xs md:text-sm mt-1 ${
                stat.label === "Market Status" || stat.label === "Data Source"
                  ? "text-[#9CA3AF]"
                  : stat.change?.startsWith("-")
                  ? "text-[#DC2626]"
                  : "text-[#16A34A]"
              }`}
            >
              {stat.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}