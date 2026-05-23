import { Router } from "express";
import bcrypt from "bcryptjs";

import { pool } from "../db.js";
import { mapUser } from "../mappers.js";
import { requireAuth, signToken } from "../middleware/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, username, password_hash, display_name, role, is_active
       FROM users WHERE username = $1`,
      [username.trim().toLowerCase()]
    );

    const user = rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const publicUser = mapUser(user);
    const token = signToken(publicUser);

    res.json({ token, user: publicUser });
  } catch (err) {
    console.error("login", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, username, display_name, role FROM users WHERE id = $1 AND is_active = TRUE`,
      [req.user.sub]
    );

    if (!rows[0]) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    res.json({ user: mapUser(rows[0]) });
  } catch (err) {
    console.error("me", err);
    res.status(500).json({ error: "Error al verificar sesión" });
  }
});

export default router;
