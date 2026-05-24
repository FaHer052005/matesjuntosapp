import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 
    "postgresql://matesuser:1234@localhost:5432/matesjuntos",
});

pool.on("error", (err) => {
  console.error("Error inesperado en PostgreSQL:", err);
});
