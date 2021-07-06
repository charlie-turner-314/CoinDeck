import React, { ReactNode } from "react";
import "./Deck.css";
import remove from "../icons/remove.png";
import Ticker from "./Ticker";
import { DeckInfo } from "../types/DeckInfo";
import Feed from "./Feed";

interface Props {
  deckId: number;
  content: DeckInfo;
  width: string;
  children?: ReactNode;
  removeDeck: any;
}

const Deck = (props: Props) => {
  return (
    <div className="deck" style={{ width: `${props.width}` }}>
      <div className="menu-bar">
        <img
          src={remove}
          alt="open menu"
          onClick={() => props.removeDeck(props.deckId)}
        />
      </div>
      <Ticker
        coinId={props.content.coin}
        removeDeck={() => props.removeDeck(props.deckId)}
      />
      <Feed />
    </div>
  );
};
export default Deck;
