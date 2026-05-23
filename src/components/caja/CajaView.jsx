import { PMT_LBL } from "../../utils/constants";
import { $$, dlCSV, fmtD } from "../../utils/helpers";

export default function CajaView({ sales, theme }) {
  const total = sales.reduce((acc, sale) => acc + sale.total, 0);
  const count = sales.length;
  const average = count > 0 ? total / count : 0;

  const byMethod = (method) =>
    sales
      .filter((s) => s.paymentMethod === method)
      .reduce((acc, sale) => acc + sale.total, 0);

  const cards = [
    { title: "Total vendido", value: $$(total) },
    { title: "Cantidad de ventas", value: count },
    { title: "Ticket promedio", value: $$(average) },
    { title: "Efectivo", value: $$(byMethod("efectivo")) },
    { title: "Mercado Pago", value: $$(byMethod("mercadopago")) },
    { title: "Transferencia", value: $$(byMethod("transferencia")) },
    { title: "Tarjeta", value: $$(byMethod("tarjeta")) },
  ];

  const cardStyle = {
    background: theme.card,
    color: theme.text,
    padding: 24,
    borderRadius: 18,
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 30,
        }}
      >
        <h1 style={{ color: theme.text }}>💵 Caja</h1>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => dlCSV(sales)}
          disabled={sales.length === 0}
        >
          ⬇️ Exportar ventas (CSV)
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {cards.map((c) => (
          <div key={c.title} style={cardStyle}>
            <p style={{ color: theme.secondary, marginBottom: 8 }}>{c.title}</p>
            <h2>{c.value}</h2>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <h2 style={{ marginBottom: 16, color: theme.text }}>Últimas ventas</h2>
        {sales.length === 0 ? (
          <p style={{ color: theme.secondary }}>Sin ventas registradas.</p>
        ) : (
          sales.slice(0, 8).map((sale) => (
            <div key={sale.id} style={{ ...cardStyle, marginBottom: 12 }}>
              <h3>{ $$(sale.total) }</h3>
              <p style={{ color: theme.secondary }}>
                {fmtD(sale.date)} · {PMT_LBL[sale.paymentMethod] || sale.paymentMethod}
              </p>
              <p style={{ fontSize: 14, marginTop: 6 }}>
                {sale.items
                  .map((i) => `${i.productName} ×${i.quantity}`)
                  .join(" · ")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
