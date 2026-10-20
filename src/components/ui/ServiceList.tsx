"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { Service } from "@/content/services";
import { ServiceGlyph } from "./ServiceGlyph";

/**
 * Large typographic rows that open like drawers. Titles widen on hover using
 * Archivo's width axis; they never wrap at desktop sizes, so nothing reflows.
 */
export function ServiceList({
  services,
  defaultOpen,
  detailed = false,
}: {
  services: Service[];
  defaultOpen?: string;
  detailed?: boolean;
}) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(defaultOpen ? [defaultOpen] : []));
  const base = useId();

  // On the services page, open whichever service the URL points at.
  useEffect(() => {
    if (!detailed) return;
    const open = () => {
      const id = window.location.hash.slice(1);
      if (services.some((s) => s.id === id)) setOpen((prev) => new Set(prev).add(id));
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [detailed, services]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ul>
      {services.map((s) => {
        const isOpen = open.has(s.id);
        const panelId = `${base}-${s.id}-panel`;
        const btnId = `${base}-${s.id}-btn`;
        return (
          <li key={s.id} id={detailed ? s.id : undefined} className="service-row scroll-mt-28" data-open={isOpen ? "true" : "false"}>
            <h3>
              <button
                id={btnId}
                type="button"
                className="service-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(s.id)}
              >
                <span className="service-title md:whitespace-nowrap">{s.title}</span>
                <span className="service-plus" aria-hidden="true" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className="service-panel" inert={!isOpen}>
              <div>
                <div className="grid-12 gap-y-6 pb-10 pt-2">
                  <p className="lede col-span-4 md:col-span-6">{s.what}</p>
                  <div className="col-span-4 md:col-span-4 md:col-start-8">
                    <p className="text-[1.02rem] leading-relaxed">
                      <strong className="font-[family-name:var(--font-display)] font-semibold">For you: </strong>
                      {s.value}
                    </p>
                    <ul className="label mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.9rem]">
                      {s.deliverables.map((d) => (
                        <li key={d} className="border-t border-[color:rgb(21_21_21/0.15)] pt-2">
                          {d}
                        </li>
                      ))}
                    </ul>
                    {!detailed && (
                      <Link href={`/services#${s.id}`} className="label link-draw mt-6 inline-block text-[0.95rem]">
                        More about {s.title}
                      </Link>
                    )}
                  </div>
                  <ServiceGlyph glyph={s.glyph} className="col-span-1 hidden h-24 w-24 md:col-start-12 md:block" />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
