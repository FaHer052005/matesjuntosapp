// src/components/sales/NewSale.jsx

import { useState } from "react";

export default function NewSale({
  prods,
  addSale,
  th,
  PMTS,
  PMT_LBL,
  PMT_EMO,
  PMT_CLR,
  G,
  $$,
}) {
  const [items, setItems] =
    useState([
      {
        productId: "",
        quantity: 1,
      },
    ]);

  const [method, setMethod] =
    useState("efectivo");

  const [note, setNote] =
    useState("");

  const [done, setDone] =
    useState(false);

  const addItem = () =>
    setItems((v) => [
      ...v,
      {
        productId: "",
        quantity: 1,
      },
    ]);

  const removeItem = (i) =>
    setItems((v) =>
      v.filter((_, j) => j !== i)
    );

  const setItem = (i, k, v) =>
    setItems((p) =>
      p.map((it, j) =>
        j === i
          ? {
              ...it,
              [k]: v,
            }
          : it
      )
    );

  const resolved = items.map(
    (it) => ({
      ...it,
      prod: prods.find(
        (p) =>
          p.id === it.productId
      ),
    })
  );

  const total = resolved.reduce(
    (a, it) =>
      a +
      (it.prod
        ? it.prod.price *
          it.quantity
        : 0),
    0
  );

  const profit = resolved.reduce(
    (a, it) =>
      a +
      (it.prod
        ? (it.prod.price -
            it.prod.cost) *
          it.quantity
        : 0),
    0
  );

  const submit = () => {
    const valid = resolved.filter(
      (it) =>
        it.prod &&
        it.quantity > 0
    );

    if (valid.length === 0) {
      return alert(
        "Agregá al menos un producto"
      );
    }

    addSale({
      id: Date.now(),
      date: new Date().toISOString(),

      items: valid.map((it) => ({
        productId: it.prod.id,
        productName:
          it.prod.name,
        quantity: it.quantity,
        unitPrice:
          it.prod.price,
        unitCost:
          it.prod.cost,
      })),

      paymentMethod: method,

      total,
      profit,
      note,
    });

    setItems([
      {
        productId: "",
        quantity: 1,
      },
    ]);

    setNote("");

    setDone(true);

    setTimeout(() => {
      setDone(false);
    }, 3000);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "1fr 320px",
        gap: 18,
      }}
    >
      {/* IZQUIERDA */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div className="card">
          <div
            style={{
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            🛒 Productos
          </div>

          {items.map((it, i) => {
            const p = prods.find(
              (x) =>
                x.id ===
                it.productId
            );

            return (
              <div
                key={i}
                style={{
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 90px auto",
                    gap: 10,
                  }}
                >
                  <select
                    className="inp"
                    value={
                      it.productId
                    }
                    onChange={(e) =>
                      setItem(
                        i,
                        "productId",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Seleccionar...
                    </option>

                    {prods.map(
                      (p) => (
                        <option
                          key={p.id}
                          value={
                            p.id
                          }
                        >
                          {p.name}
                        </option>
                      )
                    )}
                  </select>

                  <input
                    className="inp"
                    type="number"
                    min={1}
                    value={
                      it.quantity
                    }
                    onChange={(e) =>
                      setItem(
                        i,
                        "quantity",
                        +e.target.value
                      )
                    }
                  />

                  {items.length >
                    1 && (
                    <button
                      className="btn btn-d btn-sm"
                      onClick={() =>
                        removeItem(
                          i
                        )
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>

                {p && (
                  <div
                    style={{
                      fontSize: 12,
                      marginTop: 5,
                      color:
                        th.mut,
                    }}
                  >
                    Subtotal:{" "}
                    <strong>
                      {$$(
                        p.price *
                          it.quantity
                      )}
                    </strong>
                  </div>
                )}
              </div>
            );
          })}

          <button
            className="btn btn-g btn-sm"
            onClick={addItem}
          >
            ➕ Agregar producto
          </button>
        </div>

        <div className="card">
          <label className="lbl">
            Nota
          </label>

          <textarea
            className="inp"
            rows={2}
            value={note}
            onChange={(e) =>
              setNote(
                e.target.value
              )
            }
          />
        </div>
      </div>

      {/* DERECHA */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div className="card">
          <div
            style={{
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            💳 Método de pago
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 8,
            }}
          >
            {PMTS.map((m) => (
              <button
                key={m}
                onClick={() =>
                  setMethod(m)
                }
                style={{
                  padding:
                    "12px 8px",
                  borderRadius: 12,
                  border: `2px solid ${
                    method === m
                      ? PMT_CLR[m]
                      : th.brd
                  }`,
                  background:
                    method === m
                      ? `${PMT_CLR[m]}22`
                      : "transparent",
                }}
              >
                <div>
                  {PMT_EMO[m]}
                </div>

                <div
                  style={{
                    fontSize: 12,
                  }}
                >
                  {PMT_LBL[m]}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: G.g700,
            borderRadius: 16,
            padding:
              "20px 22px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                color:
                  "rgba(255,255,255,.7)",
              }}
            >
              Ganancia
            </span>

            <strong
              style={{
                color: "#fff",
              }}
            >
              {$$(profit)}
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: 18,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 18,
              }}
            >
              Total
            </span>

            <strong
              style={{
                color: "#fff",
                fontSize: 26,
              }}
            >
              {$$(total)}
            </strong>
          </div>

          <button
            className="btn"
            onClick={submit}
            style={{
              width: "100%",
              justifyContent:
                "center",
              background: "#fff",
              color: G.g700,
            }}
          >
            ✅ Confirmar venta
          </button>
        </div>

        {done && (
          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: G.g100,
              color: G.g700,
              fontWeight: 600,
              textAlign:
                "center",
            }}
          >
            ✅ Venta registrada
          </div>
        )}
      </div>
    </div>
  );
}