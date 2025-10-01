import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ task /ping
app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

// health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend running: http://localhost:${PORT}`));
