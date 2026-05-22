import { useMemo, useState } from "react";

import {
  ResponsiveContainer,

  BarChart,
  Bar,

  LineChart,
  Line,

  XAxis,
  YAxis,

  CartesianGrid,

  Tooltip,
} from "recharts";

export default function StockView({
  products,
  sales,
}) {

  // FILTER
  const [range, setRange] =
    useState("all");

  // TABS
  const [stockTab,
    setStockTab] =
    useState("analytics");

  // FILTER SALES
  const filteredSales =
    useMemo(() => {

      if (range === "all") {
        return sales;
      }

      const now =
        new Date();

      let days = 7;

      if (range === "30") {
        days = 30;
      }

      return sales.filter(
        (sale) => {

          const saleDate =
            new Date(
              sale.date
            );

          const diff =
            (now - saleDate) /
            (1000 *
              60 *
              60 *
              24);

          return diff <= days;
        }
      );

    }, [sales, range]);

  // LOW STOCK
  const lowStock =
    useMemo(() => {

      return products.filter(
        (p) => p.stock <= 5
      );

    }, [products]);

  // BEST SELLERS
  const bestSellers =
    useMemo(() => {

      const totals = {};

      filteredSales.forEach(
        (sale) => {

          sale.items.forEach(
            (item) => {

              if (
                !totals[
                  item.name
                ]
              ) {

                totals[
                  item.name
                ] = 0;
              }

              totals[
                item.name
              ] +=
                item.quantity;
            }
          );
        }
      );

      return Object.entries(
        totals
      ).map(([name, qty]) => ({

        name,

        qty,
      }));

    }, [filteredSales]);

  // SALES TREND
  const salesTrend =
    useMemo(() => {

      const grouped = {};

      filteredSales.forEach(
        (sale) => {

          const day =
            new Date(
              sale.date
            ).toLocaleDateString(
              "es-AR"
            );

          if (
            !grouped[day]
          ) {

            grouped[day] = 0;
          }

          grouped[day] +=
            sale.total;
        }
      );

      return Object.entries(
        grouped
      ).map(([day, total]) => ({

        day,

        total,
      }));

    }, [filteredSales]);

  // TOTAL PROFIT
  const totalProfit =
    filteredSales.reduce(
      (acc, sale) => {

        let profit = 0;

        sale.items.forEach(
          (item) => {

            const product =
              products.find(
                (p) =>
                  p.name ===
                  item.name
              );

            if (product) {

              const price =
                Number(
                  product.price
                ) || 0;

              const cost =
                Number(
                  product.cost
                ) || 0;

              const qty =
                Number(
                  item.quantity
                ) || 0;

              const itemProfit =
                (
                  price -
                  cost
                ) * qty;

              profit +=
                itemProfit;
            }
          }
        );

        return acc + profit;

      }, 0
    );

  // TOP PRODUCT
  const topProduct =
    [...bestSellers]

      .sort(
        (a, b) =>
          b.qty - a.qty
      )[0];

  // LOW PRODUCT
  const lowProduct =
    [...bestSellers]

      .sort(
        (a, b) =>
          a.qty - b.qty
      )[0];

  // CRITICAL PRODUCT
  const criticalProduct =
    lowStock[0];

  // MOVEMENT
  const productMovement =
    products.map(
      (product) => {

        let sold = 0;

        filteredSales.forEach(
          (sale) => {

            sale.items.forEach(
              (item) => {

                if (
                  item.name ===
                  product.name
                ) {

                  sold +=
                    item.quantity;
                }
              }
            );
          }
        );

        return {

          name:
            product.name,

          sold,

          stock:
            product.stock,
        };
      }
    );

  return (

    <div>

      {/* HEADER */}
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          marginBottom: 24,

          flexWrap: "wrap",

          gap: 12,
        }}
      >

        <h1>
          📦 Stock
        </h1>

        {/* FILTER */}
        <select
          value={range}

          onChange={(e) =>
            setRange(
              e.target.value
            )
          }

          style={{
            padding:
              "10px 14px",

            borderRadius:
              10,

            border:
              "1px solid #ddd",
          }}
        >

          <option value="all">
            Toda la historia
          </option>

          <option value="7">
            Últimos 7 días
          </option>

          <option value="30">
            Últimos 30 días
          </option>

        </select>

      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",

          gap: 12,

          marginBottom: 24,

          flexWrap: "wrap",
        }}
      >

        <button
          onClick={() =>
            setStockTab(
              "analytics"
            )
          }

          style={{
            padding:
              "10px 18px",

            border: "none",

            borderRadius: 12,

            cursor: "pointer",

            background:
              stockTab ===
              "analytics"

                ? "#2A6041"

                : "#EAEAEA",

            color:
              stockTab ===
              "analytics"

                ? "white"

                : "black",
          }}
        >
          📊 Analytics
        </button>

        <button
          onClick={() =>
            setStockTab(
              "inventory"
            )
          }

          style={{
            padding:
              "10px 18px",

            border: "none",

            borderRadius: 12,

            cursor: "pointer",

            background:
              stockTab ===
              "inventory"

                ? "#2A6041"

                : "#EAEAEA",

            color:
              stockTab ===
              "inventory"

                ? "white"

                : "black",
          }}
        >
          📋 Inventario
        </button>

        <button
          onClick={() =>
            setStockTab(
              "alerts"
            )
          }

          style={{
            padding:
              "10px 18px",

            border: "none",

            borderRadius: 12,

            cursor: "pointer",

            background:
              stockTab ===
              "alerts"

                ? "#2A6041"

                : "#EAEAEA",

            color:
              stockTab ===
              "alerts"

                ? "white"

                : "black",
          }}
        >
          ⚠️ Alertas
        </button>

      </div>

      {/* ANALYTICS */}
      {stockTab ===
        "analytics" && (

        <>

          {/* KPI */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",

              gap: 20,

              marginBottom: 24,
            }}
          >

            {/* TOP */}
            <div
              style={{
                background:
                  "white",

                padding: 20,

                borderRadius:
                  18,

                boxShadow:
                  "0 2px 10px rgba(0,0,0,.08)",
              }}
            >

              <h3>
                🔥 Producto estrella
              </h3>

              <h2>
                {
                  topProduct
                    ?.name ||
                  "Sin datos"
                }
              </h2>

              <p>
                Vendidos:
                {" "}
                {
                  topProduct
                    ?.qty || 0
                }
              </p>

            </div>

            {/* LOW */}
            <div
              style={{
                background:
                  "white",

                padding: 20,

                borderRadius:
                  18,

                boxShadow:
                  "0 2px 10px rgba(0,0,0,.08)",
              }}
            >

              <h3>
                📉 Menos vendido
              </h3>

              <h2>
                {
                  lowProduct
                    ?.name ||
                  "Sin datos"
                }
              </h2>

              <p>
                Vendidos:
                {" "}
                {
                  lowProduct
                    ?.qty || 0
                }
              </p>

            </div>

            {/* CRITICAL */}
            <div
              style={{
                background:
                  "white",

                padding: 20,

                borderRadius:
                  18,

                boxShadow:
                  "0 2px 10px rgba(0,0,0,.08)",
              }}
            >

              <h3>
                ⚠️ Reponer urgente
              </h3>

              <h2>
                {
                  criticalProduct
                    ?.name ||
                  "Todo OK"
                }
              </h2>

              <p>
                Stock:
                {" "}
                {
                  criticalProduct
                    ?.stock || 0
                }
              </p>

            </div>

            {/* PROFIT */}
            <div
              style={{
                background:
                  "white",

                padding: 20,

                borderRadius:
                  18,

                boxShadow:
                  "0 2px 10px rgba(0,0,0,.08)",
              }}
            >

              <h3>
                💸 Ganancia real
              </h3>

              <h2>
                $
                {" "}
                {
                  totalProfit.toLocaleString(
                    "es-AR"
                  )
                }
              </h2>

              <p>
                Ganancia calculada
              </p>

            </div>

          </div>

          {/* CHARTS */}
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "1fr 1fr",

              gap: 24,

              marginBottom: 24,
            }}
          >

            {/* BEST SELLERS */}
            <div
              style={{
                background:
                  "white",

                padding: 24,

                borderRadius:
                  20,

                boxShadow:
                  "0 2px 10px rgba(0,0,0,.08)",
              }}
            >

              <h2
                style={{
                  marginBottom:
                    20,
                }}
              >
                📊 Productos más vendidos
              </h2>

              <div
                style={{
                  width: "100%",

                  height: 320,
                }}
              >

                <ResponsiveContainer>

                  <BarChart
                    data={
                      bestSellers
                    }
                  >

                    <CartesianGrid
                      strokeDasharray=
                        "3 3"
                    />

                    <XAxis
                      dataKey="name"
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="qty"

                      fill="#2A6041"
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* TREND */}
            <div
              style={{
                background:
                  "white",

                padding: 24,

                borderRadius:
                  20,

                boxShadow:
                  "0 2px 10px rgba(0,0,0,.08)",
              }}
            >

              <h2
                style={{
                  marginBottom:
                    20,
                }}
              >
                📈 Tendencia de ventas
              </h2>

              <div
                style={{
                  width: "100%",

                  height: 320,
                }}
              >

                <ResponsiveContainer>

                  <LineChart
                    data={
                      salesTrend
                    }
                  >

                    <CartesianGrid
                      strokeDasharray=
                        "3 3"
                    />

                    <XAxis
                      dataKey="day"
                    />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type=
                        "monotone"

                      dataKey=
                        "total"

                      stroke=
                        "#2A6041"

                      strokeWidth={
                        4
                      }
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>

          {/* MOVEMENT */}
          <div
            style={{
              background:
                "white",

              padding: 24,

              borderRadius:
                20,

              boxShadow:
                "0 2px 10px rgba(0,0,0,.08)",
            }}
          >

            <h2
              style={{
                marginBottom:
                  20,
              }}
            >
              📦 Movimiento de stock
            </h2>

            <div
              style={{
                display: "flex",

                flexDirection:
                  "column",

                gap: 14,
              }}
            >

              {productMovement.map(
                (product) => (

                <div
                  key={
                    product.name
                  }

                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    paddingBottom:
                      12,

                    borderBottom:
                      "1px solid #eee",
                  }}
                >

                  <div>

                    <strong>
                      {
                        product.name
                      }
                    </strong>

                    <br />

                    <small>
                      Vendidos:
                      {" "}
                      {
                        product.sold
                      }
                    </small>

                  </div>

                  <div>

                    Stock:
                    {" "}
                    {
                      product.stock
                    }

                  </div>

                </div>

              ))}

            </div>

          </div>

        </>

      )}

      {/* INVENTORY */}
      {stockTab ===
        "inventory" && (

        <div
          style={{
            background:
              "white",

            padding: 24,

            borderRadius:
              20,

            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >

          <h2
            style={{
              marginBottom:
                20,
            }}
          >
            📋 Inventario
          </h2>

          <div
            style={{
              display: "flex",

              flexDirection:
                "column",

              gap: 12,
            }}
          >

            {products.map(
              (product) => {

              let color =
                "#52B788";

              if (
                product.stock <=
                5
              ) {

                color =
                  "#FFC107";
              }

              if (
                product.stock <=
                2
              ) {

                color =
                  "#DC3545";
              }

              return (

                <div
                  key={
                    product.id
                  }

                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    padding: 14,

                    border:
                      "1px solid #eee",

                    borderRadius:
                      12,
                  }}
                >

                  <div>

                    <strong>
                      {
                        product.name
                      }
                    </strong>

                    <br />

                    <small>
                      {
                        product.category
                      }
                    </small>

                  </div>

                  <div
                    style={{
                      background:
                        color,

                      color:
                        "white",

                      padding:
                        "8px 14px",

                      borderRadius:
                        999,
                    }}
                  >

                    Stock:
                    {" "}
                    {
                      product.stock
                    }

                  </div>

                </div>

              );
            })}

          </div>

        </div>

      )}

      {/* ALERTS */}
      {stockTab ===
        "alerts" && (

        <div
          style={{
            background:
              "white",

            padding: 24,

            borderRadius:
              20,

            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >

          <h2
            style={{
              marginBottom:
                20,
            }}
          >
            ⚠️ Alertas de stock
          </h2>

          {lowStock.length ===
            0 && (

            <p>
              No hay productos
              críticos
            </p>

          )}

          {lowStock.map(
            (product) => {

            let bg =
              "#FFF3CD";

            if (
              product.stock <=
              2
            ) {

              bg =
                "#F8D7DA";
            }

            else if (
              product.stock <=
              4
            ) {

              bg =
                "#FFE5B4";
            }

            return (

              <div
                key={
                  product.id
                }

                style={{
                  background:
                    bg,

                  padding: 14,

                  borderRadius:
                    12,

                  marginBottom:
                    12,
                }}
              >

                <strong>
                  {
                    product.name
                  }
                </strong>

                {" "}
                —
                {" "}
                Stock:
                {" "}
                {
                  product.stock
                }

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}