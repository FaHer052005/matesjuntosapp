import { useMemo } from "react";

import { $$, fmtD } from "../../utils/helpers";
import { PMT_LBL } from "../../utils/constants";

function isLowStock(product) {
  const min = product.minStock ?? 5;
  return product.stock <= min;
}

export default function DashboardView({ products, sales, theme }) {
  const totalSales = useMemo(
    () => sales.reduce((acc, sale) => acc + sale.total, 0),
    [sales]
  );

  const totalProfit = useMemo(
    () => sales.reduce((acc, sale) => acc + (sale.profit || 0), 0),
    [sales]
  );

  const totalItemsSold = useMemo(() => {
    let total = 0;
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        total += item.quantity;
      });
    });
    return total;
  }, [sales]);

  const lowStock = products.filter(isLowStock);

  const card = {
    background: theme.card,
    color: theme.text,
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  };

  const metrics = [
    { label: "💰 Ventas totales", value: $$(totalSales) },
    { label: "📈 Ganancia", value: $$(totalProfit) },
    { label: "📦 Productos", value: products.length },
    { label: "🛒 Unidades vendidas", value: totalItemsSold },
    { label: "⚠️ Bajo stock", value: lowStock.length },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24, color: theme.text }}>🏠 Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {metrics.map((m) => (
          <div key={m.label} style={card}>
            <h3 style={{ fontSize: 14, color: theme.secondary }}>{m.label}</h3>
            <p style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16 }}>⚠️ Productos con bajo stock</h2>
        {lowStock.length === 0 ? (
          <p style={{ color: theme.secondary }}>Todo el stock está bien.</p>
        ) : (
          lowStock.map((product) => (
            <div
              key={product.id}
              style={{
                padding: "10px 0",
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              {product.name} — Stock: {product.stock}{" "}
              <small style={{ color: theme.secondary }}>
                (mínimo {product.minStock ?? 5})
              </small>
            </div>
          ))
        )}
      </div>

      <div style={card}>
        <h2 style={{ marginBottom: 16 }}>🧾 Últimas ventas</h2>
        {sales.length === 0 ? (
          <p style={{ color: theme.secondary }}>Todavía no hay ventas.</p>
        ) : (
          sales.slice(0, 5).map((sale) => (
            <div
              key={sale.id}
              style={{
                padding: "12px 0",
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <strong>{ $$(sale.total) }</strong>
              {" — "}
              {PMT_LBL[sale.paymentMethod] || sale.paymentMethod}
              <br />
              <small style={{ color: theme.secondary }}>
                {fmtD(sale.date)} ·{" "}
                {sale.items
                  .map((i) => `${i.productName} ×${i.quantity}`)
                  .join(", ")}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
