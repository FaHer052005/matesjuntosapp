export default function Sidebar({
  view,
  setView,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  theme,
  user,
  onLogout,
}) {
  const items = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "products", icon: "📦", label: "Productos" },
    { id: "sales", icon: "💰", label: "Ventas" },
    { id: "history", icon: "🧾", label: "Historial" },
    { id: "stock", icon: "📊", label: "Stock" },
    { id: "caja", icon: "💵", label: "Caja" },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 99,
          }}
          aria-hidden="true"
        />
      )}

      <nav
        style={{
          width: 260,
          background: theme.sidebar,
          color: "white",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : -280,
          height: "100vh",
          zIndex: 100,
          transition: "left 0.25s ease",
        }}
      >
        <div style={{ padding: "8px 4px 24px" }}>
          <div style={{ fontSize: 32 }}>🧉</div>
          <h2 style={{ color: "white", marginTop: 8 }}>Mates Juntos</h2>
          <p style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
            Gestión del negocio
          </p>
        </div>

        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setView(item.id);
              setSidebarOpen(false);
            }}
            style={{
              padding: 14,
              borderRadius: 14,
              cursor: "pointer",
              background:
                view === item.id ? theme.sidebarActive : "transparent",
              color: "white",
              display: "flex",
              gap: 12,
              alignItems: "center",
              textAlign: "left",
              width: "100%",
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

        <div style={{ marginTop: "auto", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {user && (
            <p style={{ fontSize: 13, opacity: 0.85, padding: "0 4px" }}>
              👤 {user.displayName || user.username}
            </p>
          )}
          <button
            type="button"
            className="btn-ghost"
            onClick={onLogout}
            style={{
              width: "100%",
              color: "white",
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            🚪 Salir
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: "100%",
              color: "white",
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            {darkMode ? "☀️ Modo claro" : "🌙 Modo oscuro"}
          </button>
        </div>
      </nav>
    </>
  );
}
