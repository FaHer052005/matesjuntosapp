import { useCallback, useEffect, useState } from "react";

import LoginView from "./components/auth/LoginView";
import CajaView from "./components/caja/CajaView";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import DashboardView from "./components/dashboard/DashboardView";
import ProductsView from "./components/products/ProductsView";
import SalesView from "./components/sales/SalesView";
import StockView from "./components/stock/StockView";
import HistoryView from "./components/history/HistoryView";

import { setToken, getToken } from "./api/client";
import {
  createProduct,
  createSale,
  deleteProduct,
  fetchMe,
  fetchProducts,
  fetchSales,
  updateProduct,
} from "./api/data";
import { GS } from "./styles/globalStyles";
import { getTheme } from "./theme";

export default function App() {
  const [authStatus, setAuthStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [view, setView] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  const theme = getTheme(darkMode);

  const loadData = useCallback(async () => {
    const [p, s] = await Promise.all([fetchProducts(), fetchSales()]);
    setProducts(p);
    setSales(s);
  }, []);

  const bootstrap = useCallback(async () => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) setDarkMode(JSON.parse(savedTheme));

    if (!getToken()) {
      setAuthStatus("guest");
      setReady(true);
      return;
    }

    try {
      const { user: me } = await fetchMe();
      setUser(me);
      await loadData();
      setAuthStatus("authenticated");
    } catch {
      setToken(null);
      setAuthStatus("guest");
    } finally {
      setReady(true);
    }
  }, [loadData]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode, ready]);

  const handleLogin = async (loggedUser) => {
    setUser(loggedUser);
    setAuthStatus("loading");
    try {
      await loadData();
      setAuthStatus("authenticated");
      setError("");
    } catch (err) {
      setToken(null);
      setAuthStatus("guest");
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setProducts([]);
    setSales([]);
    setAuthStatus("guest");
    setView("dashboard");
  };

  const handleSaveProduct = async (data, editingId) => {
    const payload = {
      name: data.name,
      category: data.category,
      price: data.price,
      cost: data.cost,
      stock: data.stock,
      minStock: data.minStock,
      image: data.image,
      desc: data.desc,
    };

    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await createProduct(payload);
    }
    await loadData();
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    await loadData();
  };

  const handleCreateSale = async (sale) => {
    await createSale(sale);
    await loadData();
  };

  if (!ready || authStatus === "loading") {
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

  if (authStatus === "guest") {
    return (
      <>
        <style>{GS(theme)}</style>
        <LoginView onSuccess={handleLogin} theme={theme} />
        {error && (
          <p style={{ textAlign: "center", color: theme.danger }}>{error}</p>
        )}
      </>
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
        user={user}
        onLogout={handleLogout}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <TopBar
          view={view}
          setSidebarOpen={setSidebarOpen}
          theme={theme}
          user={user}
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
              theme={theme}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {view === "sales" && (
            <SalesView
              products={products}
              theme={theme}
              onCreateSale={handleCreateSale}
            />
          )}

          {view === "stock" && (
            <StockView products={products} sales={sales} theme={theme} />
          )}

          {view === "caja" && (
            <CajaView sales={sales} theme={theme} />
          )}

          {view === "history" && (
            <HistoryView sales={sales} theme={theme} />
          )}
        </main>
      </div>
    </div>
  );
}
