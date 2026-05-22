// 📁 src/components/products/ProductsView.jsx

import { useMemo, useState } from "react";
import ProductModal from "./ProductModal";

export default function ProductsView({
  prods,
  addProd,
  editProd,
  delProd,
  th,
  CATS,
  CAT_LBL,
  CAT_EMO,
  CAT_BG,
  CAT_CLR,
  G,
  $$,
}) {
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("todos");
  const [confirm, setConfirm] = useState(null);

  const filtered = useMemo(() => {
    return prods.filter((p) => {
      const ms =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.desc || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const mc =
        cat === "todos" ||
        p.category === cat;

      return ms && mc;
    });
  }, [prods, search, cat]);

  const margin = (p) =>
    p.price > 0
      ? Math.round(
          ((p.price - p.cost) / p.price) * 100
        )
      : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* TOP */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div
          className="search-box"
          style={{
            flex: "1 1 200px",
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: th.mut,
            }}
          >
            🔍
          </span>

          <input
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <span
              onClick={() => setSearch("")}
              style={{
                cursor: "pointer",
                color: th.mut,
                fontSize: 14,
              }}
            >
              ✕
            </span>
          )}
        </div>

        <select
          className="inp"
          style={{
            width: 180,
            flex: "0 0 auto",
          }}
          value={cat}
          onChange={(e) =>
            setCat(e.target.value)
          }
        >
          <option value="todos">
            Todas las categorías
          </option>

          {CATS.map((c) => (
            <option
              key={c}
              value={c}
            >
              {CAT_EMO[c]} {CAT_LBL[c]}
            </option>
          ))}
        </select>

        <button
          className="btn btn-p"
          onClick={() =>
            setModal("new")
          }
        >
          ➕ Nuevo producto
        </button>
      </div>

      {/* INFO */}
      <div
        style={{
          fontSize: 13,
          color: th.mut,
        }}
      >
        {filtered.length} producto
        {filtered.length !== 1
          ? "s"
          : ""}{" "}
        encontrado
        {filtered.length !== 1
          ? "s"
          : ""}
      </div>

      {/* TABLE */}
      <div
        className="card"
        style={{
          padding: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table className="tbl">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Costo</th>
                <th>Margen</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: 40,
                      color: th.mut,
                      fontSize: 14,
                    }}
                  >
                    No se encontraron productos
                  </td>
                </tr>
              )}

              {filtered.map((p) => {
                const m = margin(p);

                return (
                  <tr key={p.id}>
                    <td>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: th.tx,
                        }}
                      >
                        {p.name}
                      </div>

                      {p.desc && (
                        <div
                          style={{
                            fontSize: 12,
                            color: th.mut,
                            maxWidth: 220,
                            overflow: "hidden",
                            textOverflow:
                              "ellipsis",
                            whiteSpace:
                              "nowrap",
                            marginTop: 2,
                          }}
                        >
                          {p.desc}
                        </div>
                      )}
                    </td>

                    <td>
                      <span
                        className="badge"
                        style={{
                          background:
                            CAT_BG[
                              p.category ||
                                "otro"
                            ],
                          color:
                            CAT_CLR[
                              p.category ||
                                "otro"
                            ],
                        }}
                      >
                        {
                          CAT_EMO[
                            p.category ||
                              "otro"
                          ]
                        }{" "}
                        {
                          CAT_LBL[
                            p.category ||
                              "otro"
                          ]
                        }
                      </span>
                    </td>

                    <td
                      style={{
                        fontWeight: 700,
                        color: G.g700,
                      }}
                    >
                      {$$(p.price)}
                    </td>

                    <td
                      style={{
                        color: th.mut,
                      }}
                    >
                      {$$(p.cost)}
                    </td>

                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color:
                            m >= 30
                              ? G.g700
                              : m >= 15
                              ? G.y600
                              : G.r500,
                        }}
                      >
                        {m}%
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            p.stock <=
                            p.minStock
                              ? G.r500
                              : p.stock <=
                                p.minStock *
                                  2
                              ? G.y600
                              : G.g700,
                        }}
                      >
                        {p.stock}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                        }}
                      >
                        <button
                          className="btn btn-g btn-sm"
                          onClick={() =>
                            setModal(p)
                          }
                        >
                          ✏️ Editar
                        </button>

                        <button
                          className="btn btn-d btn-sm"
                          onClick={() =>
                            setConfirm(
                              p.id
                            )
                          }
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <ProductModal
          th={th}
          prod={
            modal === "new"
              ? null
              : modal
          }
          onSave={(p) => {
            modal === "new"
              ? addProd(p)
              : editProd(p);

            setModal(null);
          }}
          onClose={() =>
            setModal(null)
          }
          CATS={CATS}
          CAT_LBL={CAT_LBL}
          CAT_EMO={CAT_EMO}
          G={G}
          $$={$$}
        />
      )}
    </div>
  );
}