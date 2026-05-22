export default function Sidebar({
  view,
  setView,
  sidebarOpen,
  setSidebarOpen,
}) {

  const items = [

    {
      id: "dashboard",
      icon: "🏠",
      label: "Dashboard",
    },

    {
      id: "products",
      icon: "📦",
      label: "Productos",
    },
    
    {
      id: "caja",
      icon: "💵",
      label: "Caja",
    },

    {
      id: "sales",
      icon: "💰",
      label: "Ventas",
    },

    {
      id: "stock",
      icon: "📊",
      label: "Stock",
    },
  ];

  return (
    <>
      {/* OVERLAY */}
      {sidebarOpen && (

        <div
          onClick={() =>
            setSidebarOpen(false)
          }

          style={{
            position: "fixed",

            inset: 0,

            background:
              "rgba(0,0,0,0.4)",

            zIndex: 99,
          }}
        />
      )}

      {/* SIDEBAR */}
      <div
        style={{
          width: 260,

          background: "#1E3D2F",

          color: "white",

          padding: 20,

          display: "flex",

          flexDirection: "column",

          gap: 10,

          position: "fixed",

          top: 0,

          left:
            sidebarOpen
              ? 0
              : -280,

          height: "100vh",

          zIndex: 100,

          transition: ".25s",
        }}
      >

        {/* LOGO */}
        <div
          style={{
            padding: 20,
            marginBottom: 20,
          }}
        >

          <h1
            style={{
              color: "white",
            }}
          >
            🧉
          </h1>

          <h2>
            Mates Juntos
          </h2>

        </div>

        {/* ITEMS */}
        {items.map((item) => (

          <div
            key={item.id}

            onClick={() => {

              setView(item.id);

              setSidebarOpen(false);
            }}

            style={{
              padding: 16,

              borderRadius: 14,

              cursor: "pointer",

              background:
                view === item.id
                  ? "#2A6041"
                  : "transparent",

              display: "flex",

              gap: 12,
            }}
          >

            <span>
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>

          </div>

        ))}

      </div>
    </>
  );
}