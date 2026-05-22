import { useMemo } from "react";

export default function DashboardView({
  products,
  sales,
}) {

  // TOTAL SALES
  const totalSales =
    useMemo(() => {

      return sales.reduce(

        (acc, sale) =>

          acc + sale.total,

        0
      );

    }, [sales]);

  // TOTAL PRODUCTS
  const totalProducts =
    products.length;

  // LOW STOCK
  const lowStock =
    products.filter(
      (p) => p.stock <= 5
    );

  // TOTAL SOLD
  const totalItemsSold =
    useMemo(() => {

      let total = 0;

      sales.forEach((sale) => {

        sale.items.forEach(
          (item) => {

            total +=
              item.quantity;
          }
        );
      });

      return total;

    }, [sales]);

  return (

    <div>

      {/* TITLE */}
      <h1
        style={{
          marginBottom: 24,
        }}
      >
        🏠 Dashboard
      </h1>

      {/* METRICS */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",

          gap: 20,

          marginBottom: 28,
        }}
      >

        {/* SALES */}
        <div
          style={{
            background: "white",

            padding: 24,

            borderRadius: 20,

            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >

          <h3>
            💰 Ventas totales
          </h3>

          <h1>
            ${totalSales}
          </h1>

        </div>

        {/* PRODUCTS */}
        <div
          style={{
            background: "white",

            padding: 24,

            borderRadius: 20,

            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >

          <h3>
            📦 Productos
          </h3>

          <h1>
            {totalProducts}
          </h1>

        </div>

        {/* SOLD */}
        <div
          style={{
            background: "white",

            padding: 24,

            borderRadius: 20,

            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >

          <h3>
            🛒 Vendidos
          </h3>

          <h1>
            {
              totalItemsSold
            }
          </h1>

        </div>

        {/* LOW STOCK */}
        <div
          style={{
            background: "white",

            padding: 24,

            borderRadius: 20,

            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >

          <h3>
            ⚠️ Bajo stock
          </h3>

          <h1>
            {
              lowStock.length
            }
          </h1>

        </div>

      </div>

      {/* LOW STOCK */}
      <div
        style={{
          background: "white",

          padding: 24,

          borderRadius: 20,

          marginBottom: 24,

          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
        }}
      >

        <h2
          style={{
            marginBottom: 16,
          }}
        >
          ⚠️ Productos con bajo stock
        </h2>

        {lowStock.length === 0 && (
          <p>
            No hay productos
            bajos de stock
          </p>
        )}

        {lowStock.map(
          (product) => (

          <div
            key={product.id}

            style={{
              padding: "10px 0",

              borderBottom:
                "1px solid #eee",
            }}
          >

            {product.name}
            {" "}
            —
            {" "}
            Stock:
            {" "}
            {product.stock}

          </div>

        ))}

      </div>

      {/* LAST SALES */}
      <div
        style={{
          background: "white",

          padding: 24,

          borderRadius: 20,

          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
        }}
      >

        <h2
          style={{
            marginBottom: 16,
          }}
        >
          🧾 Últimas ventas
        </h2>

        {sales.length === 0 && (
          <p>
            No hay ventas
          </p>
        )}

        {sales
          .slice(0, 5)

          .map((sale) => (

          <div
            key={sale.id}

            style={{
              padding: "12px 0",

              borderBottom:
                "1px solid #eee",
            }}
          >

            <strong>
              ${sale.total}
            </strong>

            {" "}
            —
            {" "}

            {
              sale.paymentMethod
            }

            <br />

            <small>
              {sale.date}
            </small>

          </div>

        ))}

      </div>

    </div>
  );
}