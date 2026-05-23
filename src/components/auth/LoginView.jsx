import { useState } from "react";

import { login } from "../../api/data";
import { setToken } from "../../api/client";

export default function LoginView({ onSuccess, theme }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await login(username, password);
      setToken(token);
      onSuccess(user);
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: theme.bg,
      }}
    >
      <form
        onSubmit={submit}
        className="card"
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          textAlign: "left",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 48 }}>🧉</div>
          <h1 style={{ color: theme.text, marginTop: 8 }}>Mates Juntos</h1>
          <p style={{ color: theme.secondary, fontSize: 14 }}>
            Ingresá usuario y contraseña
          </p>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 14, color: theme.secondary }}>Usuario</span>
          <input
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ej. admin"
            required
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 14, color: theme.secondary }}>Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error && (
          <p style={{ color: theme.danger, fontSize: 14 }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Ingresando…" : "Ingresar"}
        </button>

        <p style={{ fontSize: 12, color: theme.secondary, textAlign: "center" }}>
          Demo: admin / admin123 · mates / matesjuntos
        </p>
      </form>
    </div>
  );
}
