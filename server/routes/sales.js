import { Router } from "express";

import { pool } from "../db.js";
import { mapSale, mapSaleItem } from "../mappers.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

async function fetchSalesWithItems() {
  const { rows: sales } = await pool.query(
    `SELECT * FROM sales ORDER BY sale_date DESC`
  );

  if (sales.length === 0) return [];

  const { rows: items } = await pool.query(
    `SELECT * FROM sale_items WHERE sale_id = ANY($1::int[])`,
    [sales.map((s) => s.id)]
  );

  const bySale = new Map();
  for (const item of items) {
    if (!bySale.has(item.sale_id)) bySale.set(item.sale_id, []);
    bySale.get(item.sale_id).push(item);
  }

  return sales.map((s) => mapSale(s, bySale.get(s.id) || []));
}

router.get("/", async (_req, res) => {
  try {
    res.json(await fetchSalesWithItems());
  } catch (err) {
    console.error("GET sales", err);
    res.status(500).json({ error: "No se pudieron cargar las ventas" });
  }
});

router.post("/", async (req, res) => {
  const { paymentMethod, items, total, profit, note, date } = req.body;

  if (!paymentMethod || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Venta inválida" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const item of items) {
      const pid = Number(item.productId);
      if (!Number.isInteger(pid)) continue;

      const { rows } = await client.query(
        `SELECT stock, name FROM products WHERE id = $1 AND is_active = TRUE FOR UPDATE`,
        [pid]
      );

      if (!rows[0]) {
        throw new Error(`PRODUCT_NOT_FOUND:${item.productName}`);
      }

      if (rows[0].stock < item.quantity) {
        throw new Error(`STOCK:${rows[0].name}`);
      }
    }

    const { rows: saleRows } = await client.query(
      `INSERT INTO sales (user_id, sale_date, payment_method, total, profit, note)
       VALUES ($1, COALESCE($2::timestamptz, NOW()), $3, $4, $5, $6)
       RETURNING *`,
      [
        req.user.sub,
        date || null,
        paymentMethod,
        total,
        profit ?? 0,
        note || "",
      ]
    );

    const sale = saleRows[0];

    for (const item of items) {
      const pid = Number(item.productId);

      await client.query(
        `INSERT INTO sale_items (sale_id, product_id, product_name, category, quantity, unit_price, unit_cost)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          sale.id,
          Number.isInteger(pid) ? pid : null,
          item.productName,
          item.category,
          item.quantity,
          item.unitPrice,
          item.unitCost ?? 0,
        ]
      );

      if (Number.isInteger(pid)) {
        await client.query(
          `UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2`,
          [item.quantity, pid]
        );

        await client.query(
          `INSERT INTO stock_movements (product_id, user_id, delta, reason, reference_sale_id)
           VALUES ($1, $2, $3, 'sale', $4)`,
          [pid, req.user.sub, -item.quantity, sale.id]
        );
      }
    }

    await client.query("COMMIT");

    const { rows: itemRows } = await pool.query(
      `SELECT * FROM sale_items WHERE sale_id = $1`,
      [sale.id]
    );

    res.status(201).json(mapSale(sale, itemRows));
  } catch (err) {
    await client.query("ROLLBACK");

    if (err.message?.startsWith("STOCK:")) {
      return res.status(400).json({
        error: `Stock insuficiente para ${err.message.slice(6)}`,
      });
    }

    console.error("POST sale", err);
    res.status(500).json({ error: "No se pudo registrar la venta" });
  } finally {
    client.release();
  }
});

export default router;
