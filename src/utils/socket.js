import { store } from "@/lib/store";
import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token) => {
  if (socket && socket.connected) return socket;

  socket = io(process.env.NEXT_PUBLIC_API_URL, {
    path: "/socket.io",  // MUST match server path
    auth: { token },
    transports: ["websocket"], 
    forceNew: true,
    timeout: 20000,
    reconnectionAttempts: 10
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect_error:", err?.message || err);
  });

  socket.on("reconnect_attempt", (count) => {
    console.log("Socket reconnect attempt:", count);
  });

  return socket;
};

export const getSocket = () => socket;