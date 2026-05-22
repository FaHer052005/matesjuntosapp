export default function CajaView({
  sales,
}) {

  // TOTAL
  const total = sales.reduce(

    (acc, sale) =>

      acc + sale.total,

    0
  );

  // COUNT
  const count = sales.length;

  // AVERAGE
  const average =
    count > 0
      ? total / count
      : 0;

  // PAYMENT TOTALS
  const efectivo = sales
    .filter(
      (s) =>
        s.paymentMethod ===
        "efectivo"
    )
    .reduce(
      (acc, sale) =>
        acc + sale.total,
      0
    );

  const mp = sales
    .filter(
      (s) =>
        s.paymentMethod ===
        "mercadopago"
    )
    .reduce(
      (acc, sale) =>
        acc + sale.total,
      0
    );

  const transferencia = sales
    .filter(
      (s) =>
        s.paymentMethod ===
        "transferencia"
    )
    .reduce(
      (acc, sale) =>
        acc + sale.total,
      0
    );

  const tarjeta = sales
    .filter(
      (s) =>
        s.paymentMethod ===
        "tarjeta"
    )
    .reduce(
      (acc, sale) =>
        acc + sale.total,
      0
    );

  const cards = [

    {
      title: "Total vendido",

      value:
        `$${total.toLocaleString()}`,
    },

    {
      title: "Ventas",

      value: count,
    },

    {
      title: "Ticket promedio",

      value:
        `$${average.toFixed(0)}`,
    },

    {
      title: "Efectivo",

      value:
        `$${efectivo.toLocaleString()}`,
    },

    {
      title: "Mercado Pago",

      value:
        `$${mp.toLocaleString()}`,
    },

    {
      title: "Transferencia",

      value:
        `$${transferencia.toLocaleString()}`,
    },

    {
      title: "Tarjeta",

      value:
        `$${tarjeta.toLocaleString()}`,
    },
  ];

  return (
    <div>

      <h1
        style={{
          marginBottom: 30,
        }}
      >
        💰 Caja
      </h1>

      {/* CARDS */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",

          gap: 20,
        }}
      >

        {cards.map((card, index) => (

          <div
            key={index}

            style={{
              background: "white",

              padding: 24,

              borderRadius: 18,

              boxShadow:
                "0 2px 10px rgba(0,0,0,.08)",
            }}
          >

            <p
              style={{
                color: "#666",

                marginBottom: 10,
              }}
            >
              {card.title}
            </p>

            <h2>
              {card.value}
            </h2>

          </div>

        ))}

      </div>

      {/* LAST SALES */}
      <div
        style={{
          marginTop: 40,
        }}
      >

        <h2
          style={{
            marginBottom: 20,
          }}
        >
          Últimas ventas
        </h2>

        <div
          style={{
            display: "flex",

            flexDirection: "column",

            gap: 12,
          }}
        >

          {sales.slice(0, 5).map((sale) => (

            <div
              key={sale.id}

              style={{
                background: "white",

                padding: 20,

                borderRadius: 16,
              }}
            >

              <h3>
                ${sale.total}
              </h3>

              <p>
                {sale.date}
              </p>

              <p>
                {sale.paymentMethod}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}