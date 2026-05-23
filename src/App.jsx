import { useEffect, useState } from "react";

import CajaView from "./components/caja/CajaView";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import DashboardView from "./components/dashboard/DashboardView";
import ProductsView from "./components/products/ProductsView";
import SalesView from "./components/sales/SalesView";
import StockView from "./components/stock/StockView";

import { loadAppData } from "./data/seed";
import { GS } from "./styles/globalStyles";
import { getTheme } from "./theme";

/**
 * App.jsx = "cerebro" de la aplicación.
 * - Guarda productos y ventas en memoria (useState)
 * - Los persiste en localStorage cuando cambian
 * - Decide qué pantalla mostrar según `view`
 */
export default function App() {
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [view, setView] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const theme = getTheme(darkMode);

  // 1) Al abrir la app: cargar datos guardados o datos de ejemplo
  useEffect(() => {
    const { products: p, sales: s } = loadAppData();
    setProducts(p);
    setSales(s);

    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }

    setReady(true);
  }, []);

  // 2) Cada vez que cambian productos/ventas/tema → guardar en el navegador
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("products", JSON.stringify(products));
  }, [products, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode, ready]);

  if (!ready) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme.bg,
          color: theme.text,
        }}
      >
        Cargando Mates Juntos…
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg }}>
      <style>{GS(theme)}</style>

      <Sidebar
        view={view}
        setView={setView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        theme={theme}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: 0,
          minWidth: 0,
        }}
      >
        <TopBar
          view={view}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          theme={theme}
        />

        <main
          style={{
            flex: 1,
            padding: 16,
            overflowX: "hidden",
            overflowY: "auto",
            background: theme.bg,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {view === "dashboard" && (
            <DashboardView products={products} sales={sales} theme={theme} />
          )}

          {view === "products" && (
            <ProductsView
              products={products}
              setProducts={setProducts}
              theme={theme}
            />
          )}

          {view === "sales" && (
            <SalesView
              products={products}
              setProducts={setProducts}
              sales={sales}
              setSales={setSales}
              theme={theme}
            />
          )}

          {view === "stock" && (
            <StockView products={products} sales={sales} theme={theme} />
          )}

          {view === "caja" && (
            <CajaView sales={sales} theme={theme} />
          )}
        </main>
      </div>
    </div>
  );
}
