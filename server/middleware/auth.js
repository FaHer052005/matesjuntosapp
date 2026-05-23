import jwt from "jsonwebtoken";

const secret = () =>
  process.env.JWT_SECRET || "dev-secret-cambiar-en-produccion";

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    secret(),
    { expiresIn: "7d" }
  );
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Debés iniciar sesión" });
  }

  try {
    const payload = jwt.verify(header.slice(7), secret());
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Sesión expirada o inválida" });
  }
}
