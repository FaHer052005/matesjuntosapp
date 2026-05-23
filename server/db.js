import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://mates:mates123@localhost:5432/matesjuntos",
});

pool.on("error", (err) => {
  console.error("Error inesperado en PostgreSQL:", err);
});
