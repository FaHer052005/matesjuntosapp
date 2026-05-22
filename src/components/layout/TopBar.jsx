const TITLES = {
  dashboard: "Dashboard",
  products: "Productos",
  sales: "Ventas",
  stock: "Stock",
  caja: "Caja",
};

export default function TopBar({
  view,
  setSidebarOpen,
  darkMode,
  setDarkMode,
}){

  return (
    <div
      style={{
        background: "white",

        padding: 20,

        borderBottom:
          "1px solid #ddd",

        display: "flex",

        justifyContent:
          "space-between",

        alignItems: "center",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >

        {/* MENU */}
        <button
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          ☰
        </button>

        <div>

          <h2>
            {TITLES[view]}
          </h2>

          <p
            style={{
              color: "#666",
            }}
          >
            Panel de gestión
          </p>

        </div>

      </div>

      {/* DATE */}
      <div
        style={{
          background: "#F5EEE0",

          padding: "10px 14px",

          borderRadius: 12,
        }}
      >
        {new Date().toLocaleDateString(
          "es-AR"
        )}
      </div>

    </div>
  );
}