import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = [
    process.env.URL, // Production Render domain
    "http://localhost:5173" // Local development domain
];

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
  },
  transports: ['websocket'],
});

const userSocketMap = {}; // it stores userId -> socketId (we can fine online users from this)

export const getReceiverSocketId = (receiverId) => {
  console.log("receiver Scoket id", userSocketMap[receiverId]);
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(`User connected: UserId = ${userId}, SocketId = ${socket.id}`);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    if (userId && userId !== "undefined") {
      console.log(
        `User disconnected: UserId = ${userId}, SocketId = ${socket.id}`
      );
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
