/**
 * Crea tablas (si faltan) y carga usuarios, productos y ventas de ejemplo.
 * Uso: npm run db:init
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import pg from "pg";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://mates:mates123@localhost:5432/matesjuntos",
});

const SEED_PRODUCTS = [
  { name: "Mate Calabaza Natural", description: "Mate tradicional de calabaza curada a mano", price: 1800, cost: 800, stock: 20, min_stock: 5, category: "mate" },
  { name: "Mate Silicona Estampado", description: "Diseños exclusivos Mates Juntos", price: 2500, cost: 1100, stock: 15, min_stock: 5, category: "mate" },
  { name: "Mate Madera Tornillo", description: "Artesanal, curado, con pico de metal", price: 3200, cost: 1400, stock: 8, min_stock: 3, category: "mate" },
  { name: "Bombilla Alpaca Espiral", description: "Filtro espiral premium, alpaca", price: 950, cost: 380, stock: 30, min_stock: 8, category: "bombilla" },
  { name: "Bombilla Acero Cebador", description: "Acero inox, cebado perfecto", price: 1400, cost: 560, stock: 4, min_stock: 8, category: "bombilla" },
  { name: "Termo Stanley 750ml", description: "Stanley verde mate, 750ml", price: 12500, cost: 7000, stock: 8, min_stock: 3, category: "termo" },
  { name: "Termo Lumilagro 1L", description: "Lumilagro clásico, 1 litro", price: 3800, cost: 1900, stock: 2, min_stock: 4, category: "termo" },
  { name: "Yerba CBSé 500g", description: "Suave, equilibrada, 500g", price: 890, cost: 520, stock: 40, min_stock: 10, category: "yerba" },
  { name: "Yerba Taragüi 1kg", description: "Taragüi tradicional, 1 kilogramo", price: 1650, cost: 980, stock: 25, min_stock: 8, category: "yerba" },
  { name: "Yerbera Cerámica", description: "Artesanal esmaltada", price: 2200, cost: 950, stock: 12, min_stock: 4, category: "accesorio" },
  { name: "Kit Mate Completo", description: "Mate + bombilla + yerbera", price: 4500, cost: 2100, stock: 6, min_stock: 3, category: "accesorio" },
];

const USERS = [
  { username: "admin", password: "admin123", display_name: "Administrador" },
  { username: "mates", password: "matesjuntos", display_name: "Mates Juntos" },
];

const PMTS = ["efectivo", "mercadopago", "transferencia", "tarjeta"];

async function runSchema() {
  const schemaPath = path.join(__dirname, "../../database/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  await pool.query(sql);
  console.log("✓ Esquema aplicado");
}

async function seedUsers() {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS c FROM users`);
  if (rows[0].c > 0) {
    console.log("· Usuarios ya existen, se omiten");
    return;
  }

  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      `INSERT INTO users (username, password_hash, display_name, role)
       VALUES ($1, $2, $3, 'admin')`,
      [u.username, hash, u.display_name]
    );
    console.log(`✓ Usuario: ${u.username} / ${u.password}`);
  }
}

async function seedProducts() {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS c FROM products`);
  if (rows[0].c > 0) {
    console.log("· Productos ya existen, se omiten");
    return (await pool.query(`SELECT id, price, cost, name, category FROM products`)).rows;
  }

  const inserted = [];

  for (const p of SEED_PRODUCTS) {
    const { rows } = await pool.query(
      `INSERT INTO products (name, description, price, cost, stock, min_stock, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, price, cost, name, category`,
      [p.name, p.description, p.price, p.cost, p.stock, p.min_stock, p.category]
    );
    inserted.push(rows[0]);
  }

  console.log(`✓ ${inserted.length} productos cargados`);
  return inserted;
}

async function seedSales(products) {
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS c FROM sales`);
  if (rows[0].c > 0) {
    console.log("· Ventas ya existen, se omiten");
    return;
  }

  const { rows: userRows } = await pool.query(`SELECT id FROM users LIMIT 1`);
  const userId = userRows[0]?.id;
  const now = new Date();
  let count = 0;

  for (let d = 29; d >= 0; d--) {
    const dt = new Date(now);
    dt.setDate(dt.getDate() - d);
    const n = Math.floor(Math.random() * 4);

    for (let j = 0; j < n; j++) {
      const used = new Set();
      const items = [];
      let tot = 0;
      let prft = 0;
      const ni = Math.floor(Math.random() * 2) + 1;

      for (let k = 0; k < ni; k++) {
        let i;
        do {
          i = Math.floor(Math.random() * products.length);
        } while (used.has(i));
        used.add(i);

        const p = products[i];
        const q = Math.floor(Math.random() * 2) + 1;
        items.push({ product: p, quantity: q });
        tot += Number(p.price) * q;
        prft += (Number(p.price) - Number(p.cost)) * q;
      }

      const { rows: saleRows } = await pool.query(
        `INSERT INTO sales (user_id, sale_date, payment_method, total, profit)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          userId,
          dt.toISOString(),
          PMTS[Math.floor(Math.random() * PMTS.length)],
          tot,
          prft,
        ]
      );

      const saleId = saleRows[0].id;

      for (const { product, quantity } of items) {
        await pool.query(
          `INSERT INTO sale_items (sale_id, product_id, product_name, category, quantity, unit_price, unit_cost)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            saleId,
            product.id,
            product.name,
            product.category,
            quantity,
            product.price,
            product.cost,
          ]
        );
      }

      count++;
    }
  }

  console.log(`✓ ${count} ventas de ejemplo (sin descontar stock del seed)`);
}

async function main() {
  try {
    await runSchema();
    await seedUsers();
    const products = await seedProducts();
    await seedSales(products);
    console.log("\nListo. Iniciá con: npm run dev");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
