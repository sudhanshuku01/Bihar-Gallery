import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import "./db/Connection.js";
import AuthRoute from "./routes/AuthRoute.js";
import MediaRoute from "./routes/MediaRoute.js";
import BlogRoute from "./routes/BlogRoute.js";

dotenv.config();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("server running nicely!");
});

app.use("/api/auth", AuthRoute);

app.use("/api/media", MediaRoute);

app.use("/api/blog", BlogRoute);

app.listen(PORT, () => {
  console.log(`Server started at port no ${PORT}`);
});
