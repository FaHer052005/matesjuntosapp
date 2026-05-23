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

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 20px;
  }
`;
