import { useMemo, useState } from "react";

export default function SalesView({
  products,
  setProducts,
  sales,
  setSales,
}) {

  // CART
  const [cart, setCart] =
    useState([]);

  // PAYMENT
  const [paymentMethod,
    setPaymentMethod] =
    useState("efectivo");

  // ADD PRODUCT
  const addToCart = (
    product
  ) => {

    const exists =
      cart.find(
        (item) =>
          item.id === product.id
      );

    // EXISTS
    if (exists) {

      setCart(

        cart.map((item) =>

          item.id === product.id

            ? {
                ...item,

                quantity:
                  item.quantity + 1,
              }

            : item
        )
      );
    }

    // NEW
    else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  // REMOVE
  const removeFromCart = (
    id
  ) => {

    setCart(

      cart.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  // CHANGE QTY
  const changeQuantity = (
    id,
    value
  ) => {

    setCart(

      cart.map((item) =>

        item.id === id

          ? {
              ...item,

              quantity:
                Math.max(
                  1,
                  item.quantity +
                    value
                ),
            }

          : item
      )
    );
  };

  // TOTAL
  const total =
    useMemo(() => {

      return cart.reduce(

        (acc, item) =>

          acc +
          item.price *
            item.quantity,

        0
      );

    }, [cart]);

  // SALE
  const makeSale = () => {

    if (
      cart.length === 0
    ) {
      return;
    }

    // SALE OBJECT
    const sale = {

      id: Date.now(),

      date:
        new Date()

          .toLocaleString(),

      paymentMethod,

      items: cart,

      total,
    };

    // SAVE SALE
    setSales([
      sale,
      ...sales,
    ]);

    // UPDATE STOCK
    setProducts(

      products.map(
        (product) => {

          const found =
            cart.find(
              (item) =>
                item.id ===
                product.id
            );

          if (!found) {
            return product;
          }

          return {
            ...product,

            stock:
              product.stock -
              found.quantity,
          };
        }
      )
    );

    // CLEAR
    setCart([]);
  };

  return (

    <div>

      {/* TITLE */}
      <h1
        style={{
          marginBottom: 20,
        }}
      >
        💰 Ventas
      </h1>

      {/* GRID */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "1fr 380px",

          gap: 20,
        }}
      >

        {/* PRODUCTS */}
        <div>

          <h2
            style={{
              marginBottom: 16,
            }}
          >
            Productos
          </h2>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",

              gap: 18,
            }}
          >

            {products.map(
              (product) => (

              <div
                key={product.id}

                style={{
                  background:
                    "white",

                  padding: 18,

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
                      width:
                        "100%",

                      height:
                        180,

                      objectFit:
                        "cover",

                      borderRadius:
                        12,

                      marginBottom:
                        12,
                    }}
                  />

                )}

                <h3>
                  {product.name}
                </h3>

                <p>
                  $
                  {
                    product.price
                  }
                </p>

                <p>
                  Stock:
                  {" "}
                  {
                    product.stock
                  }
                </p>

                <button
                  onClick={() =>
                    addToCart(
                      product
                    )
                  }

                  style={{
                    marginTop: 14,
                  }}
                >
                  ➕ Agregar
                </button>

              </div>

            ))}

          </div>

        </div>

        {/* CART */}
        <div
          style={{
            background: "white",

            padding: 20,

            borderRadius: 18,

            height: "fit-content",

            position: "sticky",

            top: 0,

            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >

          <h2
            style={{
              marginBottom: 20,
            }}
          >
            🛒 Carrito
          </h2>

          {/* EMPTY */}
          {cart.length === 0 && (
            <p>
              No hay productos
            </p>
          )}

          {/* ITEMS */}
          <div
            style={{
              display: "flex",

              flexDirection:
                "column",

              gap: 14,
            }}
          >

            {cart.map((item) => (

              <div
                key={item.id}

                style={{
                  borderBottom:
                    "1px solid #eee",

                  paddingBottom: 10,
                }}
              >

                <h4>
                  {item.name}
                </h4>

                <p>
                  $
                  {item.price}
                </p>

                {/* QTY */}
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: 10,

                    marginTop: 8,
                  }}
                >

                  <button
                    onClick={() =>
                      changeQuantity(
                        item.id,
                        -1
                      )
                    }
                  >
                    ➖
                  </button>

                  <span>
                    {
                      item.quantity
                    }
                  </span>

                  <button
                    onClick={() =>
                      changeQuantity(
                        item.id,
                        1
                      )
                    }
                  >
                    ➕
                  </button>

                  <button
                    onClick={() =>
                      removeFromCart(
                        item.id
                      )
                    }
                  >
                    ❌
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* TOTAL */}
          <h2
            style={{
              marginTop: 20,
            }}
          >
            Total:
            {" "}
            ${total}
          </h2>

          {/* PAYMENT */}
          <select
            value={
              paymentMethod
            }

            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }

            style={{
              marginTop: 16,

              width: "100%",
            }}
          >

            <option value="efectivo">
              Efectivo
            </option>

            <option value="transferencia">
              Transferencia
            </option>

            <option value="mercadopago">
              Mercado Pago
            </option>

          </select>

          {/* FINISH */}
          <button
            onClick={makeSale}

            style={{
              width: "100%",

              marginTop: 20,

              padding: 14,

              fontSize: 16,
            }}
          >
            ✅ Finalizar venta
          </button>

        </div>

      </div>

    </div>
  );
}