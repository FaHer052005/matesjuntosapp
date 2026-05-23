import { useMemo, useState } from "react";

import SelectField from "../ui/SelectField";
import { PMTS, PMT_LBL } from "../../utils/constants";
import { $$, dlCSV, fmtD } from "../../utils/helpers";
import {
  filterSales,
  groupSalesByPeriod,
  parseSaleDate,
} from "../../utils/salesHistory";

const PERIOD_OPTIONS = [
  { value: "day", label: "Por día" },
  { value: "week", label: "Por semana" },
  { value: "month", label: "Por mes" },
  { value: "year", label: "Por año" },
  { value: "all", label: "Todas juntas" },
];

const paymentFilterOptions = [
  { value: "all", label: "Todos los pagos" },
  ...PMTS.map((m) => ({ value: m, label: PMT_LBL[m] })),
];

function fmtTime(iso) {
  const d = parseSaleDate({ date: iso });
  if (!d) return "";
  return d.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryView({ sales, theme }) {
  const [period, setPeriod] = useState("day");
  const [productQuery, setProductQuery] = useState("");
  const [payment, setPayment] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(
    () =>
      filterSales(sales, {
        productQuery,
        payment,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
      }),
    [sales, productQuery, payment, dateFrom, dateTo]
  );

  const groups = useMemo(
    () => groupSalesByPeriod(filtered, period),
    [filtered, period]
  );

  const summary = useMemo(() => {
    const total = filtered.reduce((a, s) => a + s.total, 0);
    const profit = filtered.reduce((a, s) => a + (s.profit || 0), 0);
    return { count: filtered.length, total, profit };
  }, [filtered]);

  const clearFilters = () => {
    setProductQuery("");
    setPayment("all");
    setDateFrom("");
    setDateTo("");
  };

  const card = {
    background: theme.card,
    color: theme.text,
    borderRadius: 18,
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  };

  const hasFilters =
    productQuery || payment !== "all" || dateFrom || dateTo;

  return (
    <div className="history-view">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <h1 style={{ color: theme.text, marginBottom: 4 }}>🧾 Historial de ventas</h1>
          <p style={{ color: theme.secondary, fontSize: 14 }}>
            Todas tus ventas, agrupadas y filtrables
          </p>
        </div>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => dlCSV(filtered)}
          disabled={filtered.length === 0}
        >
          ⬇️ Exportar filtradas
        </button>
      </div>

      {/* Filtros */}
      <div className="card history-filters" style={{ ...card, padding: 16, marginBottom: 16 }}>
        <p style={{ fontWeight: 600, marginBottom: 12 }}>Filtros</p>
        <div className="history-filters-grid">
          <label className="history-filter-field">
            <span>Producto</span>
            <input
              placeholder="Nombre del producto…"
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
            />
          </label>

          <label className="history-filter-field">
            <span>Desde</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </label>

          <label className="history-filter-field">
            <span>Hasta</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </label>

          <label className="history-filter-field">
            <span>Forma de pago</span>
            <SelectField
              value={payment}
              onChange={setPayment}
              options={paymentFilterOptions}
              theme={theme}
              aria-label="Filtrar por método de pago"
            />
          </label>
        </div>

        {hasFilters && (
          <button
            type="button"
            className="btn-ghost"
            onClick={clearFilters}
            style={{ marginTop: 12 }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Agrupación */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontWeight: 600, marginBottom: 8, color: theme.text }}>
          Ver agrupado por
        </p>
        <div className="history-period-tabs">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPeriod(opt.value)}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: period === opt.value ? theme.accent : theme.card,
                color: period === opt.value ? "#fff" : theme.text,
                border: `1px solid ${theme.border}`,
                fontSize: 14,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {[
          { label: "Ventas", value: summary.count },
          { label: "Total", value: $$(summary.total) },
          { label: "Ganancia", value: $$(summary.profit) },
        ].map((s) => (
          <div key={s.label} style={{ ...card, padding: 14 }}>
            <p style={{ fontSize: 13, color: theme.secondary }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Lista con scroll propio */}
      <div className="card history-list-panel" style={card}>
        <p style={{ padding: "16px 16px 0", fontWeight: 600 }}>
          {filtered.length === 0
            ? "No hay ventas con estos filtros"
            : `${filtered.length} venta${filtered.length === 1 ? "" : "s"}`}
        </p>

        <div className="history-list-scroll">
          {filtered.length === 0 ? (
            <p style={{ padding: 16, color: theme.secondary }}>
              Probá ampliar las fechas o quitar filtros.
            </p>
          ) : (
            groups.map((group) => (
              <section key={group.key} className="history-group">
                {period !== "all" && (
                  <h2 className="history-group-title">{group.label}</h2>
                )}

                {group.sales.map((sale) => (
                  <article key={sale.id} className="history-sale-row">
                    <div className="history-sale-main">
                      <strong>{ $$(sale.total) }</strong>
                      <span style={{ color: theme.secondary }}>
                        {fmtD(sale.date)}
                        {parseSaleDate(sale) ? ` · ${fmtTime(sale.date)}` : ""}
                      </span>
                    </div>
                    <p style={{ color: theme.secondary, fontSize: 14 }}>
                      {PMT_LBL[sale.paymentMethod] || sale.paymentMethod}
                      {sale.profit != null && (
                        <> · Ganancia { $$(sale.profit) }</>
                      )}
                    </p>
                    <p style={{ fontSize: 14, marginTop: 6 }}>
                      {sale.items
                        ?.map(
                          (i) =>
                            `${i.productName || i.name} ×${i.quantity}`
                        )
                        .join(" · ")}
                    </p>
                    {sale.note && (
                      <p
                        style={{
                          fontSize: 13,
                          marginTop: 6,
                          color: theme.secondary,
                          fontStyle: "italic",
                        }}
                      >
                        Nota: {sale.note}
                      </p>
                    )}
                  </article>
                ))}
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
