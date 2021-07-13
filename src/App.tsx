import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { produce } from "immer";
import Deck from "./components/Deck";
import "./App.css";
import Navbar from "./components/Navbar";
import { socket } from "./services/socket";

interface deckInfo {
  [index: string]: {
    tweets: number[];
    coinData: {};
    loading: boolean;
  };
}

function App() {
  const [decks, setDecks] = useState<deckInfo>({});

  const addDeck = (coinId: string = "_null") => {
    if (coinId === "_null") coinId = prompt("whats the symbol pair") as string;
    const searchTerm = prompt("search term:") as string;
    if (coinId === "") return console.error("Not a string");
    if (searchTerm === "") return console.error("Not a string");
    setDecks((d) =>
      produce(d, (decksCopy: any) => {
        decksCopy[coinId] = { tweets: [], coinData: {}, loading: true };
      })
    );
    if (!(coinId === "global")) {
      socket.emit("add_rule", [coinId, searchTerm]);
    }
  };

  const removeDeck = (id: string) => {
    if (!(id === "global")) socket.emit("delete_rule", id);
    const newDecks = produce(decks, (decksCopy: any) => {
      delete decksCopy[id];
    });
    setDecks(newDecks);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server...");
    });
    socket.on("tweet", (tweet_json) => {
      const matching_deck: string = tweet_json.matching_rules[0].tag; // String with coinId (from when the rule was set)
      setDecks((d) =>
        produce(d, (decksCopy) => {
          if (matching_deck in decksCopy) {
            decksCopy[matching_deck].tweets.unshift(tweet_json.data.id);
          }
          return decksCopy;
        })
      );
    });
    socket.on("price_update", (data) => {
      setDecks((d) =>
        produce(d, (decksCopy) => {
          try {
            decksCopy[data.symbol].coinData = data;
            decksCopy[data.symbol].loading = false;
          } catch (err) {
            console.error(err);
          }
          return decksCopy;
        })
      );
    });
  }, []);

  return (
    <>
      <Navbar addNewDeck={() => addDeck()} />
      <div className="content-container">
        {Object.keys(decks).map((coinId, idx) => {
          return (
            <Deck
              key={`${idx}-deck`}
              coinId={coinId}
              tweets={decks[coinId].tweets}
              coinData={decks[coinId].coinData}
              loading={decks[coinId].loading}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
