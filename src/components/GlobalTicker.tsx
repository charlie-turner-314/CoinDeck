import React, { useCallback, useEffect, useState } from "react";
import { CoinGeckoClient } from "../services/coinGecko";
import "./Ticker.css";
const dateformat = require("dateformat");

const GlobalTicker = () => {
  const [marketData, setMarketData] = useState<any>(null);
  const [totalMarketCap, setTotalMarketCap] = useState<string>("loading");
  const [loading, setLoading] = useState(true);
  const getMarketData = useCallback(async () => {
    const { data } = await CoinGeckoClient.global();
    if (!data.data) {
      alert("Can't connect to coingecko");
      return;
    } else {
      setMarketData(data.data);
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    getMarketData();
  }, [getMarketData]);
  return (
    <div className="tickerContainer">
      <p className="info">
        {loading
          ? "..."
          : `Global market cap (USD) at ${dateformat(
              marketData.updated_at * 1000,
              "dddd, mmmm dS, yyyy, h:MM:ss TT"
            )}`}
      </p>
      <p className="data">
        <span
          className="changePercent"
          style={{
            color:
              !loading && marketData.market_cap_change_percentage_24h_usd > 0
                ? "green"
                : "rgb(180,50,50)",
          }}
        >
          {loading
            ? "loading"
            : Math.round(
                marketData.market_cap_change_percentage_24h_usd * 100
              ) / 100}
          %
        </span>
        <span></span>
        <span></span>
      </p>
      {loading ? "loading" : Math.round(marketData.total_market_cap.usd)}
    </div>
  );
};

export default GlobalTicker;
