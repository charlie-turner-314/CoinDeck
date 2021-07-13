import dotenv from "dotenv";
import http from "http";
import path from "path";
import express from "express";
import { Server } from "socket.io";
import needle from "needle";
import Binance from "node-binance-api";
dotenv.config();
const TOKEN = process.env.TWITTER_BEARER_TOKEN;
let PORT = process.env.port || 3000;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const binance = new Binance({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL = "https://api.twitter.com/2/tweets/search/stream";

const rules = [];
const symbols = [];

//Get current stream rules
async function getRules() {
  const response = await needle("get", rulesURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.body;
}

// Set stream rules
async function setRules() {
  const data = {
    add: rules,
  };
  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  console.log(response);
}
// delete stream rules
async function deleteRules(rules) {
  if (!Array.isArray(rules.data)) return null;

  const ids = rules.data.map((rule) => rule.id);

  const data = {
    delete: {
      ids: ids,
    },
  };

  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response;
}

const deleteRule = async (ruleIndex) => {
  rules.splice(ruleIndex, 1);

  let currentRules;
  try {
    // get all stream rules
    currentRules = await getRules();

    //delete all stream rules
    await deleteRules(currentRules);

    // set rules based on above array
    await setRules();
  } catch (error) {
    process.exit(1);
  }
};

const addRule = async (rule) => {
  if (rule) {
    rules.push(rule);
  }
  let currentRules;
  try {
    // get all stream rules
    currentRules = await getRules();

    //delete all stream rules
    await deleteRules(currentRules);

    // set rules based on above array
    await setRules();
  } catch (error) {
    process.exit(1);
  }
};

function streamTweets(socket, retryAttempt = 0) {
  const stream = needle.get(streamURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    timeout: 10000,
  });

  stream
    .on("data", (data) => {
      getRules();
      try {
        const json = JSON.parse(data);
        console.log(json);
        socket.emit("tweet", json);
      } catch (error) {
        // console.error(error);
        socket.emit("error", data);
      }
    })
    .on("err", (error) => {
      if (error.code !== "ECONNRESET") {
        console.log(error.code);
        process.exit(1);
      } else {
        // This reconnection logic will attempt to reconnect when a disconnection is detected.
        // To avoid rate limits, this logic implements exponential backoff, so the wait time
        // will increase if the client cannot reconnect to the stream.
        setTimeout(() => {
          socket.emit("error", error);
          console.warn("A connection error occurred. Reconnecting...");
          streamTweets(socket, ++retryAttempt);
        }, 2 ** (retryAttempt * 100));
      }
    });
}

io.on("connection", async (socket) => {
  console.log("client connected");

  socket.on("add_rule", ([coinId, searchTerm]) => {
    const new_rule = { value: searchTerm, tag: coinId };
    addRule(new_rule);
    symbols.push(coinId);
  });

  socket.on("delete_rule", (coinId) => {
    const ids = [];
    rules.map(({ value }, idx) => {
      if (value === coinId) ids.push(idx);
    });
    symbols.splice(ids[0], 1);

    deleteRule(ids[0]);
  });

  // binance shenanigans
  binance.websockets.prevDay(false, (error, response) => {
    if (error) return console.error(error);
    const symbolIndex = symbols.indexOf(response.symbol);
    if (symbolIndex !== -1) {
      io.emit("price_update", {
        symbol: response.symbol,
        price: response.close,
        updateTime: response.closeTime,
        priceChange: response.priceChange,
        percentChange: response.percentChange,
      });
    }
  });
  streamTweets(io);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  PORT = 3001;
}

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
