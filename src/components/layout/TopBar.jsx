const TITLES = {
  dashboard: "Dashboard",
  products: "Productos",
  sales: "Ventas",
  history: "Historial",
  stock: "Stock",
  caja: "Caja",
};

export default function TopBar({ view, setSidebarOpen, theme, user }) {
  return (
    <header
      style={{
        background: theme.card,
        color: theme.text,
        padding: "16px 20px",
        borderBottom: `1px solid ${theme.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <div>
          <h2 style={{ color: theme.text }}>{TITLES[view]}</h2>
          <p style={{ color: theme.secondary, fontSize: 14 }}>
            Panel de gestión
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {user && (
          <span
            style={{
              fontSize: 13,
              color: theme.secondary,
              display: "none",
            }}
            className="topbar-user"
          >
            {user.displayName}
          </span>
        )}
        <div
          style={{
            background: theme.bg,
            color: theme.text,
            padding: "10px 14px",
            borderRadius: 12,
            fontSize: 14,
            whiteSpace: "nowrap",
          }}
        >
          {new Date().toLocaleDateString("es-AR", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </div>
      </div>
    </header>
  );
}
