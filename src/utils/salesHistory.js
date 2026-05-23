/** Convierte la fecha de una venta a Date (soporta ISO y textos viejos). */
export function parseSaleDate(sale) {
  const d = new Date(sale.date);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** Inicio de semana (lunes) en hora local. */
export function startOfWeek(date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function saleHasProduct(sale, query) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return sale.items?.some((item) =>
    (item.productName || item.name || "")
      .toLowerCase()
      .includes(q)
  );
}

export function filterSales(sales, { productQuery, payment, dateFrom, dateTo }) {
  const from = dateFrom ? startOfDay(dateFrom) : null;
  const to = dateTo ? endOfDay(dateTo) : null;

  return sales.filter((sale) => {
    if (payment !== "all" && sale.paymentMethod !== payment) {
      return false;
    }

    if (!saleHasProduct(sale, productQuery)) {
      return false;
    }

    const d = parseSaleDate(sale);
    if (!d) return !from && !to;

    if (from && d < from) return false;
    if (to && d > to) return false;

    return true;
  });
}

const groupLabels = {
  day: (d) =>
    d.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  week: (d) => {
    const start = startOfWeek(d);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const fmt = (x) =>
      x.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
    return `Semana ${fmt(start)} – ${fmt(end)}, ${start.getFullYear()}`;
  },
  month: (d) =>
    d.toLocaleDateString("es-AR", { month: "long", year: "numeric" }),
  year: (d) => String(d.getFullYear()),
};

/** Agrupa ventas ordenadas (más recientes primero) por día/semana/mes/año. */
export function groupSalesByPeriod(sales, mode) {
  const sorted = [...sales].sort((a, b) => {
    const da = parseSaleDate(a)?.getTime() ?? 0;
    const db = parseSaleDate(b)?.getTime() ?? 0;
    return db - da;
  });

  if (mode === "all") {
    return [{ key: "all", label: "Todas las ventas", sales: sorted }];
  }

  const labelFn = groupLabels[mode];
  const groups = new Map();

  for (const sale of sorted) {
    const d = parseSaleDate(sale);
    if (!d) continue;

    let key;
    if (mode === "day") {
      key = d.toISOString().slice(0, 10);
    } else if (mode === "week") {
      key = startOfWeek(d).toISOString().slice(0, 10);
    } else if (mode === "month") {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    } else {
      key = String(d.getFullYear());
    }

    if (!groups.has(key)) {
      groups.set(key, { key, label: labelFn(d), sales: [] });
    }
    groups.get(key).sales.push(sale);
  }

  return Array.from(groups.values());
}
