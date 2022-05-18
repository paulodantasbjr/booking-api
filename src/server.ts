import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/authRoute";
import { errorHandler } from "./controllers/errorControllers";

//env
dotenv.config();

//middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//DB
const URI = process.env.MONGODB_URL!;
const connect = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(URI, {
      appName: "booking-app",
      dbName: "booking-app",
    });
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// Routes
app.use("/api/auth", authRoute);

app.use(errorHandler);

//start server
const port = process.env.PORT!;
app.listen(port, () => {
  connect();
  console.log("Server is running on port", port);
});
