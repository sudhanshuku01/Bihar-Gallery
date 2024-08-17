import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const DB = process.env.DATABASE_URI;

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error", err));
