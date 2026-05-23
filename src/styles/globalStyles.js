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

  input, select, textarea {
    border: 1px solid ${theme?.border ?? "#ddd"};
    padding: 12px;
    border-radius: 12px;
    outline: none;
    min-width: 0;
    background: ${theme?.card ?? "#fff"};
    color: ${theme?.text ?? "#1A1714"};
  }

  input:focus, select:focus, textarea:focus {
    border-color: ${theme?.accent ?? "#2A6041"};
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
