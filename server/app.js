import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { requireAuth } from "./middleware/authMiddleware.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import checkinRoutes from "./routes/checkinRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";

dotenv.config();

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true, app: "CodeTrail" }));
app.use("/api", requireAuth);
app.use("/api/tracks", trackRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/stats", statsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
