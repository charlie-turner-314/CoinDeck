import React, { useEffect, useState } from "react";
import { produce } from "immer";
import Deck from "./components/Deck";
import "./App.css";
import Navbar from "./components/Navbar";
import { DeckInfo } from "./types/DeckInfo";
import socketIOClient from "socket.io-client";

function App() {
  const [decks, setDecks] = useState<DeckInfo[]>([
    {
      coin: "bitcoin",
      tweet: { author: "author", text: "this is the cool text" },
    },
  ]);

  const addDeck = () => {
    let coinId = prompt("whats the id") as string;
    setDecks([
      ...decks,
      {
        coin: coinId,
        tweet: {
          author: "elon",
          text: `${Math.random()} is the randoom number`,
        },
      },
    ]);
  };

  const removeDeck = (id: number) => {
    console.log("remove");
    const newDecks = produce(decks, (decksCopy) => {
      decksCopy.splice(id, 1);
    });
    setDecks(newDecks);
  };

  useEffect(() => {
    let socket;

    if (process.env.NODE_ENV === "development") {
      socket = socketIOClient("http://localhost:3001/");
    } else {
      socket = socketIOClient("/");
    }
  }, []);

  return (
    <>
      <Navbar addNewDeck={() => addDeck()} />
      <div className="content-container">
        {decks.map((deck, idx) => {
          return (
            <Deck
              deckId={idx}
              width="15%"
              content={deck}
              removeDeck={removeDeck}
              key={`deck-${idx}`}
            ></Deck>
          );
        })}
      </div>
    </>
  );
}

export default App;
