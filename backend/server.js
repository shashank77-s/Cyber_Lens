import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import analyzeRoute from "./routes/analyze.js";
import draftRoute from "./routes/draft.js";
import authRoute from "./routes/auth.js";
import casesRoute from "./routes/cases.js";
import adminRoute from "./routes/admin.js";
import refineRoute from "./routes/refine.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.get("/api/health", (req, res) => res.json({ status: "CyberShield AI backend is running" }));
app.use("/api/analyze", analyzeRoute);
app.use("/api/draft", draftRoute);
app.use("/api/auth", authRoute);
app.use("/api/cases", casesRoute);
app.use("/api/admin", adminRoute);
app.use("/api/refine", refineRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CyberShield backend running on http://localhost:${PORT}`));
