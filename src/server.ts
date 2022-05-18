import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const URI = process.env.MONGODB_URL!;
const connect = async () => {
  try {
    await mongoose.connect(URI, {
      autoIndex: false,
    });
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

const port = process.env.PORT!;
app.listen(port, () => {
  connect();
  console.log("Server is running on port", port);
});
