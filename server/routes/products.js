import { Router } from "express";

import { pool } from "../db.js";
import { mapProduct } from "../mappers.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM products WHERE is_active = TRUE ORDER BY name ASC`
    );
    res.json(rows.map(mapProduct));
  } catch (err) {
    console.error("GET products", err);
    res.status(500).json({ error: "No se pudieron cargar los productos" });
  }
});

router.post("/", async (req, res) => {
  const { name, category, price, cost, stock, minStock, image, desc } = req.body;

  if (!name?.trim() || !category) {
    return res.status(400).json({ error: "Nombre y categoría son obligatorios" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO products (name, description, price, cost, stock, min_stock, category, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name.trim(),
        desc || "",
        price ?? 0,
        cost ?? 0,
        stock ?? 0,
        minStock ?? 5,
        category,
        image || null,
      ]
    );

    const product = rows[0];

    if (Number(stock) > 0) {
      await client.query(
        `INSERT INTO stock_movements (product_id, user_id, delta, reason, note)
         VALUES ($1, $2, $3, 'restock', 'Stock inicial')`,
        [product.id, req.user.sub, stock]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(mapProduct(product));
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("POST product", err);
    res.status(500).json({ error: "No se pudo crear el producto" });
  } finally {
    client.release();
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, category, price, cost, stock, minStock, image, desc } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE products SET
         name = COALESCE($2, name),
         description = COALESCE($3, description),
         price = COALESCE($4, price),
         cost = COALESCE($5, cost),
         stock = COALESCE($6, stock),
         min_stock = COALESCE($7, min_stock),
         category = COALESCE($8, category),
         image_url = COALESCE($9, image_url),
         updated_at = NOW()
       WHERE id = $1 AND is_active = TRUE
       RETURNING *`,
      [
        id,
        name?.trim(),
        desc,
        price,
        cost,
        stock,
        minStock,
        category,
        image ?? null,
      ]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(mapProduct(rows[0]));
  } catch (err) {
    console.error("PUT product", err);
    res.status(500).json({ error: "No se pudo actualizar el producto" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    await pool.query(
      `UPDATE products SET is_active = FALSE, updated_at = NOW() WHERE id = $1`,
      [id]
    );
    res.status(204).end();
  } catch (err) {
    console.error("DELETE product", err);
    res.status(500).json({ error: "No se pudo eliminar el producto" });
  }
});

export default router;
