import { useEffect, useState } from "react";


import CajaView from "./components/caja/CajaView";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";

import DashboardView from "./components/dashboard/DashboardView";
import ProductsView from "./components/products/ProductsView";
import SalesView from "./components/sales/SalesView";
import StockView from "./components/stock/StockView";

import { GS } from "./styles/globalStyles";

export default function App() {

  // PRODUCTS
  const [products, setProducts] = useState([]);

  // SALES
  const [sales, setSales] = useState([]);

  // VIEW
  const [view, setView] = useState("dashboard");

  const [darkMode, setDarkMode] =
  useState(false);

  // MOBILE SIDEBAR
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // LOAD
  useEffect(() => {

    const savedProducts =
      localStorage.getItem("products");

    const savedSales =
      localStorage.getItem("sales");

    if (savedProducts) {
      setProducts(
        JSON.parse(savedProducts)
      );
    }

    if (savedSales) {
      setSales(
        JSON.parse(savedSales)
      );
    }

  }, []);

  // SAVE PRODUCTS
  useEffect(() => {

    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );

  }, [products]);

  // SAVE SALES
  useEffect(() => {

    localStorage.setItem(
      "sales",
      JSON.stringify(sales)
    );

  }, [sales]);

  useEffect(() => {

  const savedTheme =
    localStorage.getItem(
      "darkMode"
    );

  if (savedTheme) {

    setDarkMode(
      JSON.parse(savedTheme)
    );
  }

}, []);

useEffect(() => {

  localStorage.setItem(

    "darkMode",

    JSON.stringify(darkMode)
  );

}, [darkMode]);

const theme = {

  bg:
    darkMode
      ? "#121212"
      : "#F5EEE0",

  card:
    darkMode
      ? "#1E1E1E"
      : "white",

  text:
    darkMode
      ? "white"
      : "#111",

  secondary:
    darkMode
      ? "#aaa"
      : "#666",

  border:
    darkMode
      ? "#333"
      : "#ddd",
};
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >

      <style>{GS()}</style>

      {/* SIDEBAR */}
      <Sidebar
        view={view}
        setView={setView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: theme.bg,
        }}
      >

        {/* TOPBAR */}
        <TopBar
  view={view}
  setSidebarOpen={setSidebarOpen}
  darkMode={darkMode}
  setDarkMode={setDarkMode}
/>

        {/* PAGE */}
        <div
          style={{
            flex: 1,
            padding: 20,
            overflow: "auto",
          }}
        >

          {view === "dashboard" && (
            <DashboardView
              products={products}
              sales={sales}
            />
          )}

          {view === "products" && (
            <ProductsView
              products={products}
              setProducts={setProducts}
            />
          )}

          {view === "sales" && (
            <SalesView
              products={products}
              setProducts={setProducts}
              sales={sales}
              setSales={setSales}
            />
          )}

          <StockView
          products={products}
          sales={sales}
          />

          {view === "caja" && (
            <CajaView
              sales={sales}
            />
          )}

        </div>
      </div>
    </div>
  );
}


  