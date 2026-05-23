import { useMemo, useState } from "react";

import SelectField from "../ui/SelectField";
import { PMTS, PMT_LBL } from "../../utils/constants";
import { $$ } from "../../utils/helpers";

const paymentOptions = PMTS.map((m) => ({
  value: m,
  label: PMT_LBL[m],
}));

/**
 * Pantalla de ventas = punto de venta (POS).
 * El carrito vive solo acá (useState local).
 * Al confirmar, armamos un objeto `sale` estándar y lo mandamos al App.
 */
export default function SalesView({
  products,
  setProducts,
  sales,
  setSales,
  theme,
}) {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert(`Sin stock de ${product.name}`);
      return;
    }

    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        if (exists.quantity >= product.stock) {
          alert(`Solo quedan ${product.stock} unidades`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const changeQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const product = products.find((p) => p.id === id);
        const max = product?.stock ?? item.quantity;
        const next = Math.max(1, item.quantity + delta);
        if (next > max) {
          alert(`Solo quedan ${max} unidades`);
          return item;
        }
        return { ...item, quantity: next };
      })
    );
  };

  const total = useMemo(
    () =>
      cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const profit = useMemo(
    () =>
      cart.reduce(
        (acc, item) =>
          acc + (item.price - (item.cost || 0)) * item.quantity,
        0
      ),
    [cart]
  );

  const makeSale = () => {
    if (cart.length === 0) return;

    for (const item of cart) {
      const product = products.find((p) => p.id === item.id);
      if (!product || product.stock < item.quantity) {
        alert(`Stock insuficiente para ${item.name}`);
        return;
      }
    }

    const sale = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      paymentMethod,
      items: cart.map((item) => ({
        productId: item.id,
        productName: item.name,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.price,
        unitCost: item.cost || 0,
      })),
      total,
      profit,
      note: "",
    };

    setSales([sale, ...sales]);

    setProducts(
      products.map((product) => {
        const inCart = cart.find((item) => item.id === product.id);
        if (!inCart) return product;
        return {
          ...product,
          stock: product.stock - inCart.quantity,
        };
      })
    );

    setCart([]);
  };

  const cardStyle = {
    background: theme.card,
    color: theme.text,
    padding: 18,
    borderRadius: 18,
    boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20, color: theme.text }}>💰 Nueva venta</h1>

      <div className="sales-layout">
        <section>
          <h2 style={{ marginBottom: 16, color: theme.text }}>Productos</h2>

          {products.length === 0 && (
            <p style={{ color: theme.secondary }}>
              Primero cargá productos en la sección Productos.
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {products.map((product) => (
              <article key={product.id} style={cardStyle}>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 12,
                      marginBottom: 10,
                    }}
                  />
                )}
                <h3>{product.name}</h3>
                <p style={{ color: theme.secondary }}>{ $$(product.price) }</p>
                <p style={{ color: theme.secondary, fontSize: 14 }}>
                  Stock: {product.stock}
                </p>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  style={{ marginTop: 12, width: "100%", opacity: product.stock <= 0 ? 0.5 : 1 }}
                >
                  ➕ Agregar
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside
          style={{
            ...cardStyle,
            height: "fit-content",
            position: "sticky",
            top: 8,
            overflow: "visible",
            zIndex: 2,
          }}
        >
          <h2 style={{ marginBottom: 16 }}>🛒 Carrito</h2>

          {cart.length === 0 && (
            <p style={{ color: theme.secondary }}>Todavía no agregaste nada.</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  borderBottom: `1px solid ${theme.border}`,
                  paddingBottom: 10,
                }}
              >
                <strong>{item.name}</strong>
                <p style={{ color: theme.secondary, fontSize: 14 }}>
                  { $$(item.price) } × {item.quantity}
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button type="button" onClick={() => changeQuantity(item.id, -1)}>
                    −
                  </button>
                  <span style={{ alignSelf: "center" }}>{item.quantity}</span>
                  <button type="button" onClick={() => changeQuantity(item.id, 1)}>
                    +
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <p style={{ color: theme.secondary }}>Ganancia estimada</p>
            <p style={{ fontSize: 18, fontWeight: 700 }}>{ $$(profit) }</p>
            <p style={{ color: theme.secondary, marginTop: 12 }}>Total</p>
            <p style={{ fontSize: 26, fontWeight: 700 }}>{ $$(total) }</p>
          </div>

          <label style={{ display: "block", marginTop: 16, fontSize: 14 }}>
            Método de pago
          </label>
          <div style={{ marginTop: 6 }}>
            <SelectField
              value={paymentMethod}
              onChange={setPaymentMethod}
              options={paymentOptions}
              theme={theme}
              aria-label="Método de pago"
            />
          </div>

          <button
            type="button"
            onClick={makeSale}
            disabled={cart.length === 0}
            style={{
              width: "100%",
              marginTop: 20,
              opacity: cart.length === 0 ? 0.5 : 1,
            }}
          >
            ✅ Finalizar venta
          </button>
        </aside>
      </div>
    </div>
  );
}
