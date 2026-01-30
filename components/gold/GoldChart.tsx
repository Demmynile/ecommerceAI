import React, { useEffect, useRef } from "react";

// TradingView widget embed for gold price (XAUUSD)
export function GoldChart() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Remove previous widget if any
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "OANDA:XAUUSD",
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "1D",
      colorTheme: "light",
      isTransparent: false,
      autosize: true,
      largeChartUrl: "https://www.tradingview.com/symbols/XAUUSD/"
    });
    ref.current.appendChild(script);
  }, []);

  return (
    <div className="w-full h-64" ref={ref} />
  );
}
