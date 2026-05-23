import { useMemo, useState } from "react";

import SelectField from "../ui/SelectField";
import { CATS, CAT_LBL } from "../../utils/constants";
import { $$ } from "../../utils/helpers";

const categoryOptions = CATS.map((cat) => ({
  value: cat,
  label: CAT_LBL[cat],
}));

const filterOptions = [
  { value: "all", label: "Todas las categorías" },
  ...categoryOptions,
];

export default function ProductsView({ products, setProducts, theme }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("5");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("mate");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, filterCategory]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setCost("");
    setStock("");
    setMinStock("5");
    setImage("");
    setCategory("mate");
    setEditingId(null);
  };

  const saveProduct = () => {
    if (!name || !price || !cost || !stock) {
      alert("Completá nombre, precio, costo y stock");
      return;
    }

    const data = {
      name,
      category,
      image: image || undefined,
      price: Number(price),
      cost: Number(cost),
      stock: Number(stock),
      minStock: Number(minStock) || 5,
    };

    if (editingId) {
      setProducts(
        products.map((p) =>
          p.id === editingId ? { ...p, ...data } : p
        )
      );
    } else {
      setProducts([
        ...products,
        { id: Date.now().toString(), ...data },
      ]);
    }

    resetForm();
    setShowModal(false);
  };

  const deleteProduct = (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setCost(String(product.cost || 0));
    setStock(String(product.stock));
    setMinStock(String(product.minStock ?? 5));
    setImage(product.image || "");
    setCategory(product.category || "mate");
    setShowModal(true);
  };

  const cardStyle = {
    background: theme.card,
    color: theme.text,
    padding: 20,
    borderRadius: 18,
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20, color: theme.text }}>📦 Productos</h1>

      <button
        type="button"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        style={{ marginBottom: 20 }}
      >
        ➕ Agregar producto
      </button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: 16,
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: 420,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              overflow: "visible",
            }}
          >
            <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>

            <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Precio de venta" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input placeholder="Costo (lo que te cuesta)" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
            <input placeholder="Stock actual" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            <input placeholder="Stock mínimo (alerta)" type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} />
            <input placeholder="URL de imagen (opcional)" value={image} onChange={(e) => setImage(e.target.value)} />

            <SelectField
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              theme={theme}
              aria-label="Categoría del producto"
              menuZIndex={11000}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button type="button" onClick={saveProduct} style={{ flex: 1 }}>
                💾 Guardar
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          placeholder="Buscar producto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <SelectField
          value={filterCategory}
          onChange={setFilterCategory}
          options={filterOptions}
          theme={theme}
          aria-label="Filtrar por categoría"
          style={{ minWidth: 200 }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {filteredProducts.map((product) => {
          const profit = (product.price || 0) - (product.cost || 0);
          return (
            <article key={product.id} style={cardStyle}>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 14,
                    marginBottom: 12,
                  }}
                />
              )}
              <h3>{product.name}</h3>
              <p style={{ color: theme.secondary }}>
                {CAT_LBL[product.category] || product.category}
              </p>
              <p>Precio: { $$(product.price) }</p>
              <p>Costo: { $$(product.cost || 0) }</p>
              <p>Ganancia/unidad: { $$(profit) }</p>
              <p>
                Stock: {product.stock}{" "}
                <small>(mín. {product.minStock ?? 5})</small>
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => editProduct(product)}>
                  ✏️ Editar
                </button>
                <button
                  type="button"
                  style={{ flex: 1, background: theme.danger }}
                  onClick={() => deleteProduct(product.id)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
