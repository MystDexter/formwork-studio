"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Wordmark } from "@/components/ui/Wordmark";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Hide on scroll down, reveal on scroll up, and switch to light ink over dark sections.
  // One passive listener, throttled to animation frames.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const probe = () => {
      const mid = 34;
      const dark = document.querySelectorAll<HTMLElement>(
        "main .surface-prussian, main .surface-ink, main [data-nav-theme='dark'], footer.surface-prussian",
      );
      for (const el of dark) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) return true;
      }
      return false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        setScrolled(y > 24);
        setDark(probe());
        if (Math.abs(delta) > 6) setHidden(delta > 0 && y > 160);
        lastY = y;
        ticking = false;
      });
    };
    onScroll();
    // Re-check after the route's content has rendered.
    const t = window.setTimeout(onScroll, 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll, trap focus and listen for Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Tab") {
        const items = focusables();
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <header
        className="site-header"
        data-hidden={hidden && !open ? "true" : "false"}
        data-scrolled={scrolled ? "true" : "false"}
        data-theme={dark ? "dark" : "light"}
      >
        <div className="frame flex h-full items-center justify-between gap-6">
          <Link href="/" className="text-[1.3rem] leading-none" aria-label={`${site.name}, home`}>
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            <ul className="flex items-center gap-8">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="crop label link-draw text-[0.95rem]"
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/contact#brief" className="btn">
              Start a project
            </Link>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="label -mr-2 inline-flex min-h-11 items-center gap-3 px-2 text-[0.95rem] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span className="absolute inset-x-0 top-0 h-[1.5px] bg-current" />
              <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-current" />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={panelRef}
        className="menu-panel blueprint-grid surface-prussian md:hidden"
        data-open={open ? "true" : "false"}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <div className="frame flex h-[var(--nav-h)] items-center justify-between">
          <Link href="/" className="text-[1.3rem] leading-none" onClick={() => close(false)}>
            <Wordmark />
          </Link>
          <button type="button" className="label -mr-2 min-h-11 px-2 text-[0.95rem]" onClick={() => close()}>
            Close
          </button>
        </div>
        <nav aria-label="Mobile" className="frame flex flex-1 flex-col justify-between pb-8 pt-10">
          <ul className="space-y-1">
            {[{ label: "Home", href: "/" }, ...site.nav].map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <Link
                  href={item.href}
                  onClick={() => close(false)}
                  className="menu-link display py-1 text-[clamp(2.75rem,13vw,4.5rem)]"
                  style={{ "--i": i } as React.CSSProperties}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu-link space-y-5" style={{ "--i": 6 } as React.CSSProperties}>
            <Link href="/contact#brief" onClick={() => close(false)} className="btn btn-lg w-full justify-center">
              Start a project
            </Link>
            <a href={`mailto:${site.email}`} className="label link-draw block text-base">
              {site.email}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
