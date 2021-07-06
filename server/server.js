import http from "http";
import path from "path";
import express from "express";
import { Server } from "socket.io";
import needle from "needle";
import { config } from "dotenv";
const TOKEN = process.env.TWITTER_BEARER_TOKEN;
let PORT = process.env.port || 3000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL =
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id";

const rules = [
  {
    value: "btc lang:en",
  },
];
//Get stream rules
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
  return response.body;
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

function streamTweets(socket, retryAttempt = 0) {
  const stream = needle.get(streamURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    timeout: 10000,
  });

  stream
    .on("data", (data) => {
      try {
        const json = JSON.parse(data);
        socket.emit("tweet", json);
      } catch (error) {
        console.error(error);
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
          console.warn("A connection error occurred. Reconnecting...");
          streamTweets(socket, ++retryAttempt);
        }, 2 ** retryAttempt);
      }
    });

  return stream;
}

io.on("connection", async () => {
  console.log("client connected");

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

  streamTweets(io);
});

io.on("add_rule", async (rule) => {
  console.log(`New rule ${rule}`);
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
