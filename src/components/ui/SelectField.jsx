import { useEffect, useRef, useState } from "react";

/**
 * Selector custom: el menú se dibuja debajo del botón (no usa <select> nativo).
 * Evita que el desplegable aparezca en otro lugar dentro de modales o scroll.
 */
export default function SelectField({
  value,
  onChange,
  options,
  theme,
  placeholder = "Seleccionar…",
  style,
  className = "",
  "aria-label": ariaLabel,
  menuZIndex = 10000,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;

    const close = (e) => {
      if (!rootRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`select-field ${className}`.trim()}
      style={{
        position: "relative",
        width: style?.width ?? "100%",
        minWidth: style?.minWidth,
        flex: style?.flex,
        ...style,
      }}
    >
      <button
        type="button"
        className="select-field-trigger"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="select-field-label">
          {selected?.label ?? placeholder}
        </span>
        <span className="select-field-chevron" aria-hidden="true">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="select-field-menu"
          style={{ zIndex: menuZIndex }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={String(opt.value)} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`select-field-option${isSelected ? " is-selected" : ""}`}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
