import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 9000;
const __dirname = path.resolve();
console.log(__dirname);


// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const ALLOWED_ORIGINS = [
    process.env.URL,         // Production Render Domain
    "http://localhost:5173"  // Local Dev Domain (Vite default)
];

const corsOptions = {
  origin: ALLOWED_ORIGINS,
  credentials: true,
};
app.use(cors(corsOptions));

// Routes and API
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname,"/Frontend/dist")));
app.get(/^\/(?!api).*/,(req,res)=>{
  res.sendFile(path.resolve(__dirname,"Frontend","dist","index.html"));
})

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on PORT: ${PORT}`);
});
