import React, { useCallback, useEffect, useState } from "react";

import "./Ticker.css";
import UpArrow from "../icons/arrow_up.png";
import DownArrow from "../icons/arrow_down.png";

const CoinGecko = require("coingecko-api");
const dateformat = require("dateformat");
const CoinGeckoClient = new CoinGecko();

interface Props {
  coinId: string;
  removeDeck: () => any;
}

const Ticker = (props: Props) => {
  const [coinData, setCoinData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const getCoinData = useCallback(async () => {
    const { data } = await CoinGeckoClient.coins.markets({
      ids: props.coinId,
      vs_currency: "usd",
    });
    if (!data[0]) {
      alert("Not a valid cryptocurrency identifier");
      props.removeDeck();
      return;
    }
    setCoinData(data[0]);
    setLoading(false);
  }, [props]);

  useEffect(() => {
    getCoinData();
    // refresh data every 5 seconds
    const interval = setInterval(() => {
      getCoinData();
    }, 5000);

    return () => clearInterval(interval);
  }, [getCoinData]);

  return (
    <div className="tickerContainer">
      <p className="info">
        {loading
          ? "..."
          : `${coinData.symbol.toUpperCase()} at ${dateformat(
              coinData.last_updated,
              "dddd, mmmm dS, yyyy, h:MM:ss TT"
            )}`}
      </p>
      <p className="data">
        <span className="price">
          {loading ? "loading" : coinData.current_price}
        </span>
        <span
          className="changeAmount"
          style={{
            color:
              !loading && coinData.price_change_24h > 0
                ? "green"
                : "rgb(200,0,0)",
          }}
        >
          <span className="indicator">
            &nbsp;
            <img
              style={{ filter: "invert()", height: "1rem", width: "auto" }}
              src={
                !loading && coinData.price_change_24h > 0 ? UpArrow : DownArrow
              }
              alt="arrow"
            />
            &nbsp;
          </span>
          {loading
            ? "loading"
            : "$" + Math.round(coinData.price_change_24h * 100) / 100}
        </span>
        <span className="divider">&nbsp;|&nbsp;</span>
        <span
          className="changePercent"
          style={{
            color:
              !loading && coinData.price_change_24h > 0
                ? "green"
                : "rgb(180,50,50)",
          }}
        >
          {loading
            ? "loading"
            : Math.round(coinData.price_change_percentage_24h * 100) / 100}
          %
        </span>
      </p>
    </div>
  );
};

export default Ticker;
