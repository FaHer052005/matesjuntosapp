// Estilos globales (CSS como texto) para no repetir en cada botón/input.

export const GS = (theme) => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
    background: ${theme?.bg ?? "#F5EEE0"};
    color: ${theme?.text ?? "#1A1714"};
  }

  button {
    border: none;
    outline: none;
    cursor: pointer;
    padding: 12px 18px;
    border-radius: 12px;
    background: ${theme?.accent ?? "#2A6041"};
    color: white;
    font-weight: 600;
    transition: 0.2s;
  }

  button:hover {
    opacity: 0.92;
  }

  button.btn-ghost {
    background: transparent;
    color: ${theme?.text ?? "#1A1714"};
    border: 1px solid ${theme?.border ?? "#ddd"};
  }

  input, textarea {
    border: 1px solid ${theme?.border ?? "#ddd"};
    padding: 12px;
    border-radius: 12px;
    outline: none;
    min-width: 0;
    width: 100%;
    background: ${theme?.card ?? "#fff"};
    color: ${theme?.text ?? "#1A1714"};
  }

  input:focus, textarea:focus {
    border-color: ${theme?.accent ?? "#2A6041"};
  }

  /* Selector custom (SelectField.jsx) */
  .select-field-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid ${theme?.border ?? "#ddd"};
    background: ${theme?.card ?? "#fff"};
    color: ${theme?.text ?? "#1A1714"};
    font-weight: 500;
    text-align: left;
  }

  .select-field-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .select-field-chevron {
    flex-shrink: 0;
    font-size: 11px;
    opacity: 0.55;
  }

  .select-field-menu {
    margin: 0;
    padding: 6px;
    list-style: none;
    background: ${theme?.card ?? "#fff"};
    color: ${theme?.text ?? "#1A1714"};
    border: 1px solid ${theme?.border ?? "#ddd"};
    border-radius: 12px;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
  }

  .select-field-option {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    background: transparent;
    color: ${theme?.text ?? "#1A1714"};
    font-weight: 400;
    text-align: left;
    justify-content: flex-start;
  }

  .select-field-option.is-selected {
    background: ${theme?.accent ?? "#2A6041"}22;
    font-weight: 600;
  }

  .select-field-option:hover {
    background: ${theme?.accent ?? "#2A6041"}15;
  }

  h1, h2, h3 {
    color: ${theme?.accent ?? "#1E3D2F"};
  }

  .card {
    background: ${theme?.card ?? "#fff"};
    color: ${theme?.text ?? "#1A1714"};
    padding: 20px;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  }

  .sales-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 20px;
  }

  @media (max-width: 900px) {
    .sales-layout {
      grid-template-columns: 1fr;
    }
  }

  /* Historial de ventas: scroll interno sin pelear con la página */
  .history-view {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .history-filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }

  .history-filter-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    color: ${theme?.secondary ?? "#666"};
    text-align: left;
  }

  .history-period-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .history-list-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 280px;
    max-height: min(70vh, calc(100dvh - 320px));
    overflow: hidden;
  }

  .history-list-scroll {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
    padding: 8px 16px 16px;
  }

  .history-group {
    margin-bottom: 20px;
  }

  .history-group-title {
    font-size: 15px;
    font-weight: 700;
    color: ${theme?.accent ?? "#2A6041"};
    margin: 12px 0 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid ${theme?.border ?? "#ddd"};
    text-transform: capitalize;
  }

  .history-sale-row {
    padding: 14px 0;
    border-bottom: 1px solid ${theme?.border ?? "#eee"};
    text-align: left;
  }

  .history-sale-main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
  }

  @media (max-width: 600px) {
    .history-list-panel {
      max-height: min(65vh, calc(100dvh - 380px));
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 20px;
  }
`;
