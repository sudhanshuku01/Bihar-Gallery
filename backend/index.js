import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import "./db/Connection.js";
import AuthRoute from "./routes/AuthRoute.js";
import MediaRoute from "./routes/MediaRoute.js";
import BlogRoute from "./routes/BlogRoute.js";
import { redisClient } from "./Redis.js";
dotenv.config();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: ["https://www.bihargallery.com", "https://bihargallery.com"],
    // origin: ["http://localhost:5173/", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(async (req, res, next) => {
  try {
    await redisClient.incr("visitor_count");
    next();
  } catch (err) {
    console.error("Error updating visitor count", err);
    next();
  }
});

app.get("/api/visitor-count", async (req, res) => {
  try {
    const count = await redisClient.get("visitor_count");
    res.status(200).json({ visitors: count || 0 });
  } catch (err) {
    console.error("Error retrieving visitor count", err);
    res.status(500).json({ message: "Failed to retrieve visitor count" });
  }
});

app.get("/", (req, res) => {
  res.send("server running nicely!");
});

app.use("/api/auth", AuthRoute);

app.use("/api/media", MediaRoute);

app.use("/api/blog", BlogRoute);

app.listen(PORT, () => {
  console.log(`Server started at port no ${PORT}`);
});
