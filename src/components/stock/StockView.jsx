import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { $$ } from "../../utils/helpers";

function isLowStock(p) {
  return p.stock <= (p.minStock ?? 5);
}

export default function StockView({ products, sales, theme }) {
  const [range, setRange] = useState("all");
  const [stockTab, setStockTab] = useState("analytics");

  const card = {
    background: theme.card,
    color: theme.text,
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  };

  const filteredSales = useMemo(() => {
    if (range === "all") return sales;
    const days = range === "30" ? 30 : 7;
    const now = Date.now();
    return sales.filter((sale) => {
      const diff = (now - new Date(sale.date).getTime()) / (1000 * 60 * 60 * 24);
      return diff <= days;
    });
  }, [sales, range]);

  const lowStock = useMemo(() => products.filter(isLowStock), [products]);

  const bestSellers = useMemo(() => {
    const totals = {};
    filteredSales.forEach((sale) => {
      sale.items.forEach((item) => {
        const key = item.productName || item.name || "Sin nombre";
        totals[key] = (totals[key] || 0) + item.quantity;
      });
    });
    return Object.entries(totals).map(([name, qty]) => ({ name, qty }));
  }, [filteredSales]);

  const salesTrend = useMemo(() => {
    const grouped = {};
    filteredSales.forEach((sale) => {
      const day = new Date(sale.date).toLocaleDateString("es-AR");
      grouped[day] = (grouped[day] || 0) + sale.total;
    });
    return Object.entries(grouped).map(([day, total]) => ({ day, total }));
  }, [filteredSales]);

  const totalProfit = filteredSales.reduce(
    (acc, sale) => acc + (sale.profit || 0),
    0
  );

  const topProduct = [...bestSellers].sort((a, b) => b.qty - a.qty)[0];
  const lowProduct = [...bestSellers].sort((a, b) => a.qty - b.qty)[0];
  const criticalProduct = lowStock[0];

  const productMovement = products.map((product) => {
    let sold = 0;
    filteredSales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (item.productId === product.id || item.productName === product.name) {
          sold += item.quantity;
        }
      });
    });
    return { name: product.name, sold, stock: product.stock };
  });

  const tabBtn = (id, label) => (
    <button
      type="button"
      onClick={() => setStockTab(id)}
      style={{
        padding: "10px 18px",
        borderRadius: 12,
        background: stockTab === id ? theme.accent : theme.bg,
        color: stockTab === id ? "#fff" : theme.text,
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h1 style={{ color: theme.text }}>📊 Stock y reportes</h1>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="all">Toda la historia</option>
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {tabBtn("analytics", "📈 Analytics")}
        {tabBtn("inventory", "📋 Inventario")}
        {tabBtn("alerts", "⚠️ Alertas")}
      </div>

      {stockTab === "analytics" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {[
              { t: "🔥 Producto estrella", v: topProduct?.name || "—", s: `Vendidos: ${topProduct?.qty || 0}` },
              { t: "📉 Menos vendido", v: lowProduct?.name || "—", s: `Vendidos: ${lowProduct?.qty || 0}` },
              { t: "⚠️ Reponer urgente", v: criticalProduct?.name || "Todo OK", s: `Stock: ${criticalProduct?.stock ?? "—"}` },
              { t: "💸 Ganancia", v: $$(totalProfit), s: "En el período elegido" },
            ].map((k) => (
              <div key={k.t} style={card}>
                <h3 style={{ fontSize: 14, color: theme.secondary }}>{k.t}</h3>
                <h2 style={{ marginTop: 8 }}>{k.v}</h2>
                <p style={{ color: theme.secondary, fontSize: 14 }}>{k.s}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              marginBottom: 24,
            }}
          >
            <div style={card}>
              <h2 style={{ marginBottom: 16 }}>Más vendidos</h2>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={bestSellers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="qty" fill={theme.accent} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={card}>
              <h2 style={{ marginBottom: 16 }}>Tendencia de ventas</h2>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke={theme.accent} strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={card}>
            <h2 style={{ marginBottom: 16 }}>Movimiento por producto</h2>
            {productMovement.map((p) => (
              <div
                key={p.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: `1px solid ${theme.border}`,
                }}
              >
                <span>
                  <strong>{p.name}</strong>
                  <br />
                  <small style={{ color: theme.secondary }}>Vendidos: {p.sold}</small>
                </span>
                <span>Stock: {p.stock}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {stockTab === "inventory" && (
        <div style={card}>
          <h2 style={{ marginBottom: 16 }}>Inventario</h2>
          {products.map((product) => {
            let badge = theme.accent;
            if (product.stock <= 2) badge = theme.danger;
            else if (isLowStock(product)) badge = theme.warning;

            return (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 14,
                  marginBottom: 8,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                }}
              >
                <div>
                  <strong>{product.name}</strong>
                  <br />
                  <small style={{ color: theme.secondary }}>{product.category}</small>
                </div>
                <span
                  style={{
                    background: badge,
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontSize: 13,
                  }}
                >
                  Stock: {product.stock}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {stockTab === "alerts" && (
        <div style={card}>
          <h2 style={{ marginBottom: 16 }}>Alertas de stock</h2>
          {lowStock.length === 0 ? (
            <p style={{ color: theme.secondary }}>No hay alertas.</p>
          ) : (
            lowStock.map((product) => (
              <div
                key={product.id}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  marginBottom: 10,
                  background:
                    product.stock <= 2
                      ? "rgba(220,53,69,0.15)"
                      : "rgba(255,193,7,0.2)",
                }}
              >
                <strong>{product.name}</strong> — Stock: {product.stock} (mín.{" "}
                {product.minStock ?? 5})
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
