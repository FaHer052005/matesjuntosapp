import { PMT_LBL } from "./constants";

// ─── FORMATO MONEDA ───────────────────────────────────────

export const $$ = (n) =>
  `$${Number(n || 0).toLocaleString("es-AR")}`;

// ─── FORMATO FECHA ────────────────────────────────────────

export const fmtD = (iso) =>
  new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

// ─── EXPORTAR CSV ─────────────────────────────────────────

export const dlCSV = (sales) => {
  const rows = [
    [
      "Fecha",
      "Productos",
      "Método",
      "Total",
      "Ganancia",
    ],

    ...sales.map((s) => [
      fmtD(s.date),

      s.items
        .map(
          (i) =>
            `${i.productName} x${i.quantity}`
        )
        .join("|"),

      PMT_LBL[s.paymentMethod],

      s.total,

      s.profit,
    ]),
  ];

  const a = document.createElement("a");

  a.href = URL.createObjectURL(
    new Blob(
      [
        "\uFEFF" +
          rows.map((r) => r.join(",")).join("\n"),
      ],
      {
        type: "text/csv;charset=utf-8",
      }
    )
  );

  a.download = "ventas-matesjuntos.csv";

  a.click();
};