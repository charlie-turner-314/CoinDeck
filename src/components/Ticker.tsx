import React, { useCallback, useEffect, useState } from "react";

import "./Ticker.css";
import UpArrow from "../icons/arrow_up.png";
import DownArrow from "../icons/arrow_down.png";

const dateformat = require("dateformat");

interface Props {
  data: any;
  loading: boolean;
}

const Ticker = ({ data, loading }: Props) => {
  return (
    <div className="tickerContainer">
      <p className="info">
        {loading
          ? "..."
          : `${data.symbol} at ${dateformat(
              data.updateTime,
              "dddd, mmmm dS, yyyy, h:MM:ss TT"
            )}`}
      </p>
      <p className="data">
        <span className="price">
          {loading ? "loading" : `$${Math.round(data.price * 100) / 100}`}
        </span>
        <span
          className="changeAmount"
          style={{
            color: !loading && data.priceChange > 0 ? "green" : "rgb(200,0,0)",
          }}
        >
          <span className="indicator">
            &nbsp;
            <img
              style={{ filter: "invert()", height: "1rem", width: "auto" }}
              src={!loading && data.priceChange > 0 ? UpArrow : DownArrow}
              alt="arrow"
            />
            &nbsp;
          </span>
          {loading ? "loading" : "$" + Math.round(data.priceChange * 100) / 100}
        </span>
        <br />
        <span
          className="changePercent"
          style={{
            color:
              !loading && data.priceChange > 0 ? "green" : "rgb(180,50,50)",
          }}
        >
          {loading ? "loading" : Math.round(data.percentChange * 100) / 100}%
        </span>
      </p>
    </div>
  );
};

export default Ticker;
