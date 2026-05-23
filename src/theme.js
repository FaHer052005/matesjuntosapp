// Colores que cambian con el modo oscuro.
// Lo pasamos a cada pantalla para que se vean coherentes.

export function getTheme(darkMode) {
  return {
    bg: darkMode ? "#121212" : "#F5EEE0",
    card: darkMode ? "#1E1E1E" : "#FFFFFF",
    text: darkMode ? "#F0EBE0" : "#1A1714",
    secondary: darkMode ? "#9A9088" : "#666666",
    border: darkMode ? "#333333" : "#E2D8CB",
    sidebar: "#1E3D2F",
    sidebarActive: "#2A6041",
    accent: "#2A6041",
    danger: "#DC3545",
    warning: "#FFC107",
  };
}
