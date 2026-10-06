require("dotenv").config();

const app = require("./app");
const pool = require("./db/database");

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = async () => {
  console.log("Shutting down server...");

  server.close(async () => {
    await pool.end();
    console.log("Database connection pool closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
