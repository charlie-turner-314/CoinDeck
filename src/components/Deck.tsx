import React, { ReactNode } from "react";
import "./Deck.css";
import remove from "../icons/remove.png";
import Ticker from "./Ticker";
import Feed from "./Feed";
import GlobalTicker from "./GlobalTicker";
import Tweet from "./Tweet";
import SearchBar from "./SearchBar";

interface Props {
  coinId: string;
  tweets: number[];
  coinData: {};
  loading: boolean;
}

const Deck = ({ tweets, coinId, coinData, loading }: Props) => {
  if (coinId === "global") {
    return (
      <div className="deck">
        <GlobalTicker />
      </div>
    );
  }
  return (
    <div className="deck">
      <Ticker data={coinData} loading={loading} />
      <SearchBar />
      {tweets.map((tweet, idx) => {
        // return <Tweet id={tweet} key={`${idx}tweet`} />;
        return <span key={`${idx}-${coinId}`}> {tweet} </span>;
      })}
    </div>
  );
};
export default Deck;
