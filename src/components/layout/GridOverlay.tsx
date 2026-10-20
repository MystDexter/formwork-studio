"use client";

import { useEffect, useRef, useState } from "react";

const KEY = "formwork:grid";
export const GRID_EVENT = "formwork:toggle-grid";

/** The 12-column grid every page is built on. Press G (or use the footer switch) to see it. */
export function GridOverlay() {
  const [on, setOn] = useState(false);
  const onRef = useRef(false);

  useEffect(() => {
    try {
      onRef.current = window.localStorage.getItem(KEY) === "1";
      setOn(onRef.current);
    } catch {}
    const toggle = () => {
      const next = !onRef.current;
      onRef.current = next;
      setOn(next);
      try {
        window.localStorage.setItem(KEY, next ? "1" : "0");
      } catch {}
      window.dispatchEvent(new CustomEvent(`${GRID_EVENT}:state`, { detail: next }));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "g" && e.key !== "G") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;
      toggle();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(GRID_EVENT, toggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(GRID_EVENT, toggle);
    };
  }, []);

  if (!on) return null;
  return (
    <div className="grid-overlay" aria-hidden="true">
      <div className="frame h-full">
        <div className="grid-12">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={i >= 4 ? "hidden md:block" : undefined} />
          ))}
        </div>
      </div>
    </div>
  );
}
