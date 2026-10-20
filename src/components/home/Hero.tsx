"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";

const LINES = [
  { text: "Ideas,", indent: false },
  { text: "given their", indent: true },
  { text: "final form.", indent: false },
] as const;

type Props = { blueprint?: boolean; sizeNoteRef?: React.Ref<HTMLSpanElement> };

/**
 * The hero is rendered twice with identical layout: once finished, once as its own
 * technical drawing. The drawing is only visible through the lens, so the visitor
 * literally sees the engineering underneath the polish.
 */
function HeroContent({ blueprint = false, sizeNoteRef }: Props) {
  const Title = blueprint ? "div" : "h1";
  return (
    <div className={`hero-layer frame ${blueprint ? "is-blueprint" : ""}`}>
      <div className="hero-type">
        <Title className="hero-title display" {...(blueprint ? {} : { id: "hero-title" })}>
          {LINES.map((line, i) => (
            <span
              key={line.text}
              className="hero-line"
              data-indent={line.indent ? "1" : undefined}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="guide" data-g="cap" aria-hidden="true">
                {blueprint && i === 0 && <span className="guide-label">Cap height 0.686 em</span>}
              </span>
              <span className="guide" data-g="x" aria-hidden="true">
                {blueprint && i === 0 && <span className="guide-label">x-height 0.526 em</span>}
              </span>
              <span className="guide" data-g="base" aria-hidden="true">
                {blueprint && <span className="guide-label">Baseline {i + 1}</span>}
              </span>
              <span className="hero-ink">{line.text}</span>
              {blueprint && i === 2 && (
                <span className="bp-note" style={{ left: "0", top: "calc(100% + 0.6rem)" }}>
                  Archivo, weight 800, width 112%, <span ref={sizeNoteRef}>fluid</span>
                </span>
              )}
            </span>
          ))}
        </Title>

        <div className="hero-aside">
          <p className="lede hero-lede" style={{ "--i": 0 } as React.CSSProperties}>
            {blueprint && (
              <span className="bp-note" style={{ top: "-1.5rem", left: 0 }}>
                Body copy, Newsreader 380, measure 26 rem
              </span>
            )}
            {site.name} is a design and engineering studio. We turn ambitious ideas into websites and
            products that are fast, accessible and hard to forget.
          </p>
          <div className="hero-actions flex flex-wrap gap-x-7 gap-y-4" style={{ "--i": 1 } as React.CSSProperties}>
            {blueprint && (
              <span className="bp-note" style={{ top: "calc(100% + 0.5rem)", left: 0 }}>
                Primary action, 48 px minimum target
              </span>
            )}
            <Link href="/contact#brief" className="btn" tabIndex={blueprint ? -1 : undefined}>
              Start a project
            </Link>
            <Link href="/work" className="label link-draw text-base" tabIndex={blueprint ? -1 : undefined}>
              See the work
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-foot">
        <dl className="title-block label">
          <div>
            <dt className="label-muted">Drawing</dt>
          </div>
          <div>
            <dd>{site.legalName}, index</dd>
          </div>
          <div>
            <dt className="label-muted">Location</dt>
          </div>
          <div>
            <dd className="tnum">{site.location.coordinates}</dd>
          </div>
          <div>
            <dt className="label-muted">Scale</dt>
          </div>
          <div>
            <dd>1:1, at every screen size</dd>
          </div>
        </dl>
        <p className="label mr-auto hidden max-w-[15rem] self-end text-[0.8rem] lg:block">
          {blueprint ? "Lens: reveals the drawing beneath the build." : "Move your cursor over the page to see how it's built."}
        </p>
        <div className="scroll-cue label hidden sm:flex" aria-hidden="true">
          <span className="scroll-cue-line" />
          Scroll
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const sizeNoteRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const lens = lensRef.current;
    const drawing = drawingRef.current;
    const ring = ringRef.current;
    if (!hero || !lens || !drawing || !ring) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let radius = 0;
    let rest = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    let cur = { x: 0, y: 0 };
    let raf = 0;
    let visible = true;
    let lastUser = -Infinity;
    let driftStart = 0;
    let lastReadout = "";

    const measure = () => {
      w = hero.clientWidth;
      h = hero.clientHeight;
      radius = Math.round(Math.min(210, Math.max(70, w * 0.13)));
      hero.style.setProperty("--lens-d", `${radius * 2}px`);
      drawing.style.width = `${w}px`;
      drawing.style.height = `${h}px`;
      // Rest the lens over the last line of the headline, where the drawing is richest.
      const line = hero.querySelector<HTMLElement>("#hero-title .hero-line:last-child .hero-ink");
      if (line) {
        const hr = hero.getBoundingClientRect();
        const lr = line.getBoundingClientRect();
        rest = { x: lr.left - hr.left + lr.width * 0.72, y: lr.top - hr.top + lr.height * 0.5 };
      }
      const title = hero.querySelector<HTMLElement>("#hero-title");
      if (title && sizeNoteRef.current) {
        sizeNoteRef.current.textContent = `${Math.round(parseFloat(getComputedStyle(title).fontSize))} px at this width`;
      }
    };

    // Only transforms change per frame, so this never triggers layout or repaint.
    const apply = () => {
      const x = cur.x - radius;
      const y = cur.y - radius;
      lens.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      drawing.style.transform = `translate3d(${(-x).toFixed(1)}px, ${(-y).toFixed(1)}px, 0)`;
      ring.style.transform = lens.style.transform;
      const text = `x ${Math.round(cur.x)}  y ${Math.round(cur.y)}`;
      if (readoutRef.current && text !== lastReadout) {
        readoutRef.current.textContent = text;
        lastReadout = text;
      }
      const flip = cur.x + radius + 130 > w ? "true" : "false";
      if (ring.dataset.flip !== flip) ring.dataset.flip = flip;
    };

    const DRIFT_MS = 9000;
    const loop = (t: number) => {
      raf = 0;
      if (!visible) return;
      const idle = t - lastUser > 3500;
      const drifting = idle && !reduced && t - driftStart < DRIFT_MS;
      if (drifting) {
        // A slow figure-eight, easing to rest after a few seconds so an idle page goes quiet.
        const fade = Math.min(1, (DRIFT_MS - (t - driftStart)) / 2000);
        target.x = rest.x + Math.sin(t * 0.00042) * w * 0.14 * fade;
        target.y = rest.y + Math.sin(t * 0.00077) * Math.min(h * 0.08, 60, radius * 0.3) * fade;
      } else if (idle) {
        target = { ...rest };
      }
      const k = reduced ? 1 : 0.16;
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      apply();
      const settled = Math.abs(target.x - cur.x) < 0.15 && Math.abs(target.y - cur.y) < 0.15;
      if (!settled || drifting) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      target = { x: e.clientX - r.left, y: e.clientY - r.top };
      lastUser = performance.now();
      driftStart = lastUser + 3500;
      kick();
    };

    measure();
    cur = { ...rest };
    target = { ...rest };
    apply();

    // Open the lens once the entrance has played.
    const openTimer = window.setTimeout(
      () => {
        hero.dataset.lens = "on";
        driftStart = performance.now();
        kick();
      },
      reduced ? 0 : 1500,
    );

    const ro = new ResizeObserver(() => {
      measure();
      kick();
    });
    ro.observe(hero);
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) kick();
    });
    io.observe(hero);

    hero.addEventListener("pointermove", onPointer, { passive: true });
    hero.addEventListener("pointerdown", onPointer, { passive: true });

    return () => {
      window.clearTimeout(openTimer);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      hero.removeEventListener("pointermove", onPointer);
      hero.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero surface-vellum" aria-labelledby="hero-title">
      <HeroContent />
      <div ref={lensRef} className="lens" aria-hidden="true">
        <div ref={drawingRef} className="hero-blueprint blueprint-grid" inert>
          <HeroContent blueprint sizeNoteRef={sizeNoteRef} />
        </div>
      </div>
      <div ref={ringRef} className="lens-ring" aria-hidden="true">
        <span ref={readoutRef} className="lens-readout" />
      </div>
    </section>
  );
}
