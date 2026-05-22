import { useMemo, useState } from "react";

export default function ProductsView({
  products,
  setProducts,
}) {

  // FORM
  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [cost, setCost] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [image, setImage] =
    useState("");

  const [category, setCategory] =
    useState("Mate");

  // SEARCH
  const [search, setSearch] =
    useState("");

  const [filterCategory,
    setFilterCategory] =
    useState("all");

  // EDIT
  const [editingId,
    setEditingId] =
    useState(null);

  // MODAL
  const [showModal,
    setShowModal] =
    useState(false);

  // CATEGORIES
  const categories = [

    "Mate",

    "Bombilla",

    "Termo",

    "Yerba",

    "Accesorio",
  ];

  // FILTERED
  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (product) => {

          const matchesSearch =

            product.name
              ?.toLowerCase()

              .includes(
                search.toLowerCase()
              );

          const matchesCategory =

            filterCategory ===
            "all"

              ? true

              : product.category ===
                filterCategory;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );

    }, [
      products,
      search,
      filterCategory,
    ]);

  // SAVE
  const saveProduct = () => {

    if (
      !name ||
      !price ||
      !cost ||
      !stock
    ) {
      return;
    }

    // EDIT
    if (editingId) {

      setProducts(

        products.map((p) =>

          p.id === editingId

            ? {
                ...p,

                name,

                category,

                image,

                price:
                  Number(price),

                cost:
                  Number(cost),

                stock:
                  Number(stock),
              }

            : p
        )
      );

      setEditingId(null);
    }

    // ADD
    else {

      const newProduct = {

        id: Date.now(),

        name,

        category,

        image,

        price:
          Number(price),

        cost:
          Number(cost),

        stock:
          Number(stock),
      };

      setProducts([
        ...products,
        newProduct,
      ]);
    }

    // CLEAR
    setName("");

    setPrice("");

    setCost("");

    setStock("");

    setImage("");

    setCategory("Mate");

    setShowModal(false);
  };

  // DELETE
  const deleteProduct = (
    id
  ) => {

    setProducts(

      products.filter(
        (p) => p.id !== id
      )
    );
  };

  // EDIT
  const editProduct = (
    product
  ) => {

    setEditingId(
      product.id
    );

    setName(
      product.name
    );

    setPrice(
      product.price
    );

    setCost(
      product.cost || 0
    );

    setStock(
      product.stock
    );

    setImage(
      product.image || ""
    );

    setCategory(
      product.category
    );

    setShowModal(true);
  };

  return (

    <div>

      {/* TITLE */}
      <h1
        style={{
          marginBottom: 20,
        }}
      >
        📦 Productos
      </h1>

      {/* ADD BUTTON */}
      <button
        onClick={() =>
          setShowModal(true)
        }

        style={{
          marginBottom: 20,

          padding:
            "12px 18px",

          border: "none",

          borderRadius: 12,

          cursor: "pointer",

          background:
            "#2A6041",

          color: "white",

          fontSize: 16,
        }}
      >
        ➕ Agregar producto
      </button>

      {/* MODAL */}
      {showModal && (

        <div
          style={{
            position: "fixed",

            inset: 0,

            background:
              "rgba(0,0,0,.5)",

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            zIndex: 999,
          }}
        >

          <div
            style={{
              background:
                "white",

              padding: 24,

              borderRadius: 18,

              width: 420,

              display: "flex",

              flexDirection:
                "column",

              gap: 12,
            }}
          >

            <h2>
              📦 Producto
            </h2>

            {/* NAME */}
            <input
              placeholder="Nombre"

              value={name}

              onChange={(e) =>
                setName(
                  e.target.value
                )
              }

              style={{
                padding: 12,

                borderRadius: 10,

                border:
                  "1px solid #ddd",
              }}
            />

            {/* PRICE */}
            <input
              placeholder="Precio"

              type="number"

              value={price}

              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }

              style={{
                padding: 12,

                borderRadius: 10,

                border:
                  "1px solid #ddd",
              }}
            />

            {/* COST */}
            <input
              placeholder="Costo"

              type="number"

              value={cost}

              onChange={(e) =>
                setCost(
                  e.target.value
                )
              }

              style={{
                padding: 12,

                borderRadius: 10,

                border:
                  "1px solid #ddd",
              }}
            />

            {/* STOCK */}
            <input
              placeholder="Stock"

              type="number"

              value={stock}

              onChange={(e) =>
                setStock(
                  e.target.value
                )
              }

              style={{
                padding: 12,

                borderRadius: 10,

                border:
                  "1px solid #ddd",
              }}
            />

            {/* IMAGE */}
            <input
              placeholder=
                "URL imagen"

              value={image}

              onChange={(e) =>
                setImage(
                  e.target.value
                )
              }

              style={{
                padding: 12,

                borderRadius: 10,

                border:
                  "1px solid #ddd",
              }}
            />

            {/* CATEGORY */}
            <select
              value={category}

              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }

              style={{
                padding: 12,

                borderRadius: 10,

                border:
                  "1px solid #ddd",
              }}
            >

              {categories.map(
                (cat) => (

                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>

              ))}

            </select>

            {/* ACTIONS */}
            <div
              style={{
                display: "flex",

                gap: 10,

                marginTop: 10,
              }}
            >

              <button
                onClick={
                  saveProduct
                }

                style={{
                  flex: 1,

                  padding: 12,

                  border: "none",

                  borderRadius: 10,

                  background:
                    "#2A6041",

                  color: "white",

                  cursor:
                    "pointer",
                }}
              >
                💾 Guardar
              </button>

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }

                style={{
                  flex: 1,

                  padding: 12,

                  border: "none",

                  borderRadius: 10,

                  cursor:
                    "pointer",
                }}
              >
                ❌ Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

      {/* FILTERS */}
      <div
        style={{
          display: "flex",

          gap: 10,

          marginBottom: 20,

          flexWrap: "wrap",
        }}
      >

        {/* SEARCH */}
        <input
          placeholder=
            "Buscar producto"

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          style={{
            padding: 12,

            borderRadius: 10,

            border:
              "1px solid #ddd",

            minWidth: 220,
          }}
        />

        {/* FILTER */}
        <select
          value={
            filterCategory
          }

          onChange={(e) =>
            setFilterCategory(
              e.target.value
            )
          }

          style={{
            padding: 12,

            borderRadius: 10,

            border:
              "1px solid #ddd",
          }}
        >

          <option value="all">
            Todas
          </option>

          {categories.map(
            (cat) => (

            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>

          ))}

        </select>

      </div>

      {/* PRODUCTS */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",

          gap: 20,
        }}
      >

        {filteredProducts.map(
          (product) => {

          const profit =
            (product.price || 0) -
            (product.cost || 0);

          return (

            <div
              key={product.id}

              style={{
                background:
                  "white",

                padding: 20,

                borderRadius: 18,

                boxShadow:
                  "0 2px 10px rgba(0,0,0,.08)",
              }}
            >

              {/* IMAGE */}
              {product.image && (

                <img
                  src={
                    product.image
                  }

                  alt={
                    product.name
                  }

                  style={{
                    width: "100%",

                    height: 220,

                    objectFit:
                      "cover",

                    borderRadius:
                      14,

                    marginBottom:
                      14,
                  }}
                />

              )}

              <h3
                style={{
                  marginBottom: 10,
                }}
              >
                {product.name}
              </h3>

              <p>
                🏷️ Categoría:
                {" "}
                {
                  product.category
                }
              </p>

              <p>
                💰 Precio:
                {" "}
                $
                {
                  product.price
                }
              </p>

              <p>
                💸 Costo:
                {" "}
                $
                {
                  product.cost || 0
                }
              </p>

              <p>
                📈 Ganancia:
                {" "}
                $
                {
                  profit
                }
              </p>

              <p>
                📦 Stock:
                {" "}
                {
                  product.stock
                }
              </p>

              {/* ACTIONS */}
              <div
                style={{
                  display: "flex",

                  gap: 10,

                  marginTop: 20,
                }}
              >

                <button
                  onClick={() =>
                    editProduct(
                      product
                    )
                  }

                  style={{
                    flex: 1,

                    border: "none",

                    padding: 12,

                    borderRadius: 10,

                    cursor:
                      "pointer",
                  }}
                >
                  ✏️ Editar
                </button>

                <button
                  onClick={() =>
                    deleteProduct(
                      product.id
                    )
                  }

                  style={{
                    flex: 1,

                    border: "none",

                    padding: 12,

                    borderRadius: 10,

                    background:
                      "#DC3545",

                    color: "white",

                    cursor:
                      "pointer",
                  }}
                >
                  ❌ Eliminar
                </button>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}