"use client";

import { useEffect, useState } from "react";

type Metrics = {
  lcp: number | null;
  cls: number;
  inp: number | null;
  weightKb: number | null;
  requests: number | null;
};

const BUDGET = { lcp: 2500, cls: 0.1, inp: 200 };

function supports(type: string) {
  return typeof PerformanceObserver !== "undefined" && PerformanceObserver.supportedEntryTypes?.includes(type);
}

/**
 * Social proof we can stand behind: this page, measured by the visitor's own browser.
 * Nothing here is hard-coded.
 */
export function Proof() {
  const [m, setM] = useState<Metrics>({ lcp: null, cls: 0, inp: null, weightKb: null, requests: null });
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") {
      setSupported(false);
      return;
    }
    const observers: PerformanceObserver[] = [];

    if (supports("largest-contentful-paint")) {
      const o = new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1);
        if (last) setM((p) => ({ ...p, lcp: last.startTime }));
      });
      o.observe({ type: "largest-contentful-paint", buffered: true });
      observers.push(o);
    }

    if (supports("layout-shift")) {
      const o = new PerformanceObserver((list) => {
        let add = 0;
        for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
          if (!e.hadRecentInput) add += e.value;
        }
        if (add) setM((p) => ({ ...p, cls: p.cls + add }));
      });
      o.observe({ type: "layout-shift", buffered: true });
      observers.push(o);
    }

    if (supports("event")) {
      const o = new PerformanceObserver((list) => {
        let worst = 0;
        for (const e of list.getEntries() as (PerformanceEntry & { interactionId?: number })[]) {
          if (e.interactionId) worst = Math.max(worst, e.duration);
        }
        if (worst) setM((p) => ({ ...p, inp: Math.max(p.inp ?? 0, worst) }));
      });
      o.observe({ type: "event", buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
      observers.push(o);
    }

    const measureWeight = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const bytes = [nav, ...res].reduce((sum, e) => sum + (e ? e.encodedBodySize || e.transferSize || 0 : 0), 0);
      setM((p) => ({ ...p, weightKb: Math.round(bytes / 1024), requests: res.length + 1 }));
    };
    const t = window.setTimeout(measureWeight, 1200);
    const onIdle = () => measureWeight();
    window.addEventListener("load", onIdle);

    return () => {
      observers.forEach((o) => o.disconnect());
      window.clearTimeout(t);
      window.removeEventListener("load", onIdle);
    };
  }, []);

  const rows = [
    {
      label: "Largest Contentful Paint",
      hint: "How long the main content took to appear.",
      value: m.lcp == null ? null : `${(m.lcp / 1000).toFixed(2)} s`,
      ratio: m.lcp == null ? null : m.lcp / BUDGET.lcp,
      budget: "Good is under 2.5 s",
    },
    {
      label: "Cumulative Layout Shift",
      hint: "How much the page jumped around while loading.",
      value: m.cls.toFixed(3),
      ratio: m.cls / BUDGET.cls,
      budget: "Good is under 0.1",
    },
    {
      label: "Slowest interaction",
      hint: "Click or open something on this page to measure it.",
      value: m.inp == null ? "Waiting" : `${Math.round(m.inp)} ms`,
      ratio: m.inp == null ? null : m.inp / BUDGET.inp,
      budget: "Good is under 200 ms",
    },
    {
      label: "Page weight so far",
      hint: m.requests ? `Across ${m.requests} requests, compressed.` : "Everything downloaded, compressed.",
      value: m.weightKb == null ? null : `${m.weightKb} KB`,
      ratio: null,
      budget: "Includes fonts and scripts",
    },
  ];

  return (
    <section className="section surface-ink" aria-labelledby="proof-title">
      <div className="frame">
        <div className="grid-12 gap-y-8">
          <h2 id="proof-title" className="h-xl col-span-4 md:col-span-7">
            Don&apos;t take
            <br />
            our word for it
          </h2>
          <p className="col-span-4 text-[1.05rem] leading-relaxed text-[color:rgb(231_232_227/0.82)] md:col-span-4 md:col-start-9 md:self-end">
            We don&apos;t publish numbers we can&apos;t back up. These are this page&apos;s Core Web Vitals,
            measured by your own browser during this visit. Your device and connection shape them.
          </p>
        </div>

        {supported ? (
          <dl className="mt-[clamp(3rem,7vw,6rem)] grid grid-cols-1 border-t border-[color:rgb(231_232_227/0.2)] sm:grid-cols-2 lg:grid-cols-4">
            {rows.map((r) => (
              <div key={r.label} className="border-b border-[color:rgb(231_232_227/0.2)] py-8 sm:pr-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                <dt className="label">{r.label}</dt>
                <dd className="mt-6">
                  <span
                    className="block font-[family-name:var(--font-display)] text-[clamp(2.4rem,4.4vw,4.2rem)] font-extrabold leading-none tracking-[-0.04em] tnum"
                    style={{ fontStretch: "112%" }}
                  >
                    {r.value ?? "Measuring"}
                  </span>
                  <span className="mt-5 block h-[3px] w-full bg-[color:rgb(231_232_227/0.15)]" aria-hidden="true">
                    <span
                      className="block h-full transition-[width] duration-700"
                      style={{
                        width: r.ratio == null ? "0%" : `${Math.min(100, Math.max(3, r.ratio * 100))}%`,
                        background: r.ratio != null && r.ratio > 1 ? "var(--color-redline)" : "var(--color-line)",
                      }}
                    />
                  </span>
                  <span className="label mt-3 block text-[color:rgb(231_232_227/0.7)]">{r.budget}</span>
                  <span className="mt-2 block text-[0.95rem] leading-snug text-[color:rgb(231_232_227/0.7)]">{r.hint}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-12">Your browser doesn&apos;t expose performance measurements, so there&apos;s nothing honest to show here.</p>
        )}

        <figure className="mt-[clamp(4rem,8vw,7rem)] grid-12">
          <div className="col-span-4 border border-dashed border-[color:rgb(231_232_227/0.35)] p-[clamp(1.5rem,4vw,3rem)] md:col-span-8 md:col-start-3">
            <blockquote className="font-[family-name:var(--font-serif)] text-[clamp(1.3rem,2.2vw,1.9rem)] italic leading-snug text-[color:rgb(231_232_227/0.75)]">
              This space is reserved for words from our clients.
            </blockquote>
            <figcaption className="label mt-5 text-[color:rgb(231_232_227/0.7)]">
              We only publish testimonials we can attribute to a real person, with their permission.
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
