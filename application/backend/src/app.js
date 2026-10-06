const express = require("express");
const cors = require("cors");

const pool = require("./db/database");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error.message);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

module.exports = app;
