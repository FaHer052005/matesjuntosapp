import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MENU_GAP = 6;
const VIEWPORT_PAD = 12;
const MIN_MENU_HEIGHT = 120;
const MAX_MENU_HEIGHT = 280;

/**
 * Selector custom con menú en portal + position:fixed.
 * Se ajusta al espacio visible (arriba/abajo) y es scrolleable en celular.
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
  const [menuLayout, setMenuLayout] = useState(null);

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  const updateMenuLayout = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spaceBelow = vh - rect.bottom - VIEWPORT_PAD;
    const spaceAbove = rect.top - VIEWPORT_PAD;
    const openUp = spaceBelow < MIN_MENU_HEIGHT && spaceAbove > spaceBelow;

    const available = openUp ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(
      MIN_MENU_HEIGHT,
      Math.min(MAX_MENU_HEIGHT, available - MENU_GAP)
    );

    let width = rect.width;
    let left = rect.left;

    if (left + width > vw - VIEWPORT_PAD) {
      left = vw - VIEWPORT_PAD - width;
    }
    if (left < VIEWPORT_PAD) {
      left = VIEWPORT_PAD;
      width = Math.min(width, vw - VIEWPORT_PAD * 2);
    }

    setMenuLayout({
      left,
      width,
      maxHeight,
      top: openUp ? undefined : rect.bottom + MENU_GAP,
      bottom: openUp ? vh - rect.top + MENU_GAP : undefined,
      placement: openUp ? "top" : "bottom",
    });
  }, []);

  useEffect(() => {
    if (!open) {
      setMenuLayout(null);
      return;
    }

    updateMenuLayout();

    const onReflow = () => updateMenuLayout();
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);

    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [open, updateMenuLayout, options.length]);

  useEffect(() => {
    if (!open) return;

    const close = (e) => {
      const target = e.target;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close, { passive: true });
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menu =
    open &&
    menuLayout &&
    createPortal(
      <ul
        ref={menuRef}
        role="listbox"
        className={`select-field-menu select-field-menu--${menuLayout.placement}`}
        style={{
          position: "fixed",
          left: menuLayout.left,
          width: menuLayout.width,
          top: menuLayout.top,
          bottom: menuLayout.bottom,
          maxHeight: menuLayout.maxHeight,
          zIndex: menuZIndex,
        }}
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
      </ul>,
      document.body
    );

  const { width, minWidth, flex, ...wrapperStyle } = style ?? {};

  return (
    <div
      ref={rootRef}
      className={`select-field ${className}`.trim()}
      style={{
        position: "relative",
        width: width ?? "100%",
        minWidth,
        flex,
        ...wrapperStyle,
      }}
    >
      <button
        ref={triggerRef}
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

      {menu}
    </div>
  );
}
