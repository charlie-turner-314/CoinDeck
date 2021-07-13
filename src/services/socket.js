import { io } from "socket.io-client";
let SOCKET_URL;

if (process.env.NODE_ENV === "development") {
  SOCKET_URL = "http://localhost:3001/";
} else {
  SOCKET_URL = "/";
}

export const socket = io(SOCKET_URL);
