"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/content/studio";

type Rect = [x: number, y: number, w: number, h: number];

/** Nine marks travel from scattered notes, to a site map, to a layout, to a live page. */
const NODES: { scatter: Rect; tree: Rect; layout: Rect; tag: string; color: string }[] = [
  { scatter: [92, 140, 16, 16], tree: [282, 111, 18, 18], layout: [100, 112, 400, 24], tag: "<nav>", color: "#151515" },
  { scatter: [210, 96, 16, 16], tree: [141, 251, 18, 18], layout: [100, 160, 262, 72], tag: "<h1>", color: "#151515" },
  { scatter: [402, 168, 16, 16], tree: [282, 251, 18, 18], layout: [380, 160, 120, 152], tag: "<picture>", color: "#f2401d" },
  { scatter: [128, 300, 16, 16], tree: [91, 391, 18, 18], layout: [100, 248, 240, 12], tag: "<p>", color: "#4a4b4f" },
  { scatter: [318, 252, 16, 16], tree: [181, 391, 18, 18], layout: [100, 268, 196, 12], tag: "", color: "#4a4b4f" },
  { scatter: [470, 300, 16, 16], tree: [282, 391, 18, 18], layout: [100, 292, 112, 28], tag: "<button>", color: "#f2401d" },
  { scatter: [190, 430, 16, 16], tree: [423, 251, 18, 18], layout: [100, 344, 192, 148], tag: "<article>", color: "#5fa8d3" },
  { scatter: [372, 420, 16, 16], tree: [381, 391, 18, 18], layout: [310, 344, 190, 70], tag: "<article>", color: "#c6c8c1" },
  { scatter: [484, 470, 16, 16], tree: [471, 391, 18, 18], layout: [310, 422, 190, 70], tag: "<article>", color: "#151515" },
];

const TREE_LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 6],
  [1, 3],
  [1, 4],
  [2, 5],
  [6, 7],
  [6, 8],
];

const center = (r: Rect) => [r[0] + r[2] / 2, r[1] + r[3] / 2] as const;

export function ProcessDrawing({ stage, className = "" }: { stage: number; className?: string }) {
  const chalk = "#d4e6f5";
  return (
    <svg viewBox="0 0 600 600" className={`proc-svg ${className}`} aria-hidden="true" focusable="false">
      {/* Browser frame appears once there is a layout to hold. */}
      <rect
        x="80"
        y="80"
        width="440"
        height="440"
        fill={stage >= 4 ? "#e7e8e3" : "transparent"}
        stroke={chalk}
        strokeWidth="1.5"
        style={{ opacity: stage >= 2 ? 1 : 0 }}
      />
      <path d="M80 100h440" stroke={stage >= 4 ? "#151515" : chalk} strokeOpacity={0.4} style={{ opacity: stage >= 2 ? 1 : 0 }} />

      {/* Column grid, the engineering underneath. */}
      <g style={{ opacity: stage === 3 ? 1 : 0 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={100 + i * 34} y={104} width={26} height={400} fill="rgba(242,64,29,0.12)" />
        ))}
      </g>

      {/* Site map connectors. */}
      <g>
        {TREE_LINKS.map(([a, b]) => {
          const [x1, y1] = center(NODES[a]!.tree);
          const [x2, y2] = center(NODES[b]!.tree);
          const len = Math.hypot(x2 - x1, y2 - y1);
          return (
            <path
              key={`${a}-${b}`}
              d={`M${x1} ${y1}L${x2} ${y2}`}
              stroke={chalk}
              strokeWidth="1.5"
              strokeDasharray={len}
              strokeDashoffset={stage === 1 ? 0 : len}
              style={{ opacity: stage === 1 ? 1 : 0 }}
            />
          );
        })}
      </g>

      {NODES.map((n, i) => {
        const r = stage === 0 ? n.scatter : stage === 1 ? n.tree : n.layout;
        const filled = stage >= 4;
        return (
          <rect
            key={i}
            x={0}
            y={0}
            width={1}
            height={1}
            vectorEffect="non-scaling-stroke"
            fill={filled ? n.color : stage === 0 ? chalk : "transparent"}
            stroke={filled ? "transparent" : chalk}
            strokeWidth={1.5}
            strokeDasharray={stage === 2 ? "5 4" : undefined}
            style={{
              transform: `translate(${r[0]}px, ${r[1]}px) scale(${r[2]}, ${r[3]})`,
              transformOrigin: "0 0",
              transformBox: "view-box",
              transitionDelay: `${i * 35}ms`,
            }}
          />
        );
      })}

      {/* Component tags while it's being built. */}
      <g style={{ opacity: stage === 3 ? 1 : 0 }}>
        {NODES.map((n, i) =>
          n.tag ? (
            <text
              key={i}
              x={n.layout[0] + 6}
              y={n.layout[1] + Math.min(16, n.layout[3] - 2)}
              fontSize="11"
              fill={chalk}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {n.tag}
            </text>
          ) : null,
        )}
      </g>

      {/* Launched: live signal and a trend that keeps going. */}
      <g style={{ opacity: stage === 4 ? 1 : 0 }}>
        <rect x="404" y="530" width="116" height="30" fill="#151515" />
        <circle cx="422" cy="545" r="5" fill="#7ee08a" />
        <text x="434" y="550" fontSize="13" fill="#e7e8e3" style={{ fontFamily: "var(--font-display)" }}>
          Live
        </text>
        <path
          d="M80 560L130 552L180 556L230 540L280 544L330 528L380 532"
          fill="none"
          stroke="#f2401d"
          strokeWidth="2"
          strokeDasharray="320"
          strokeDashoffset={stage === 4 ? 0 : 320}
        />
      </g>

      {/* Discovery: the scattered notes carry question marks. */}
      <g style={{ opacity: stage === 0 ? 1 : 0 }}>
        {NODES.slice(0, 5).map((n, i) => (
          <text key={i} x={n.scatter[0] + 22} y={n.scatter[1] + 13} fontSize="14" fill={chalk} style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
            {["why?", "who for?", "what if…", "how fast?", "by when?"][i]}
          </text>
        ))}
      </g>
    </svg>
  );
}

export function Process() {
  const [stage, setStage] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setStage(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section surface-prussian blueprint-grid" aria-labelledby="process-title">
      <div className="frame">
        <div className="grid-12 gap-y-6">
          <h2 id="process-title" className="h-xl col-span-4 text-white md:col-span-8">
            From rough idea
            <br />
            to live site
          </h2>
          <p className="col-span-4 text-[1.05rem] leading-relaxed text-[color:rgb(212_230_245/0.85)] md:col-span-4 md:self-end">
            Five stages, one team the whole way through. You see the work take shape every week, not
            just at the end.
          </p>
        </div>

        <div className="grid-12 mt-[clamp(3rem,8vw,7rem)]">
          <div className="col-span-6 hidden lg:block">
            <div className="sticky top-[calc(50vh-17rem)]">
              <ProcessDrawing stage={stage} className="h-auto w-full max-w-[34rem]" />
              <p className="label mt-4 text-[color:var(--color-chalk)]" aria-hidden="true">
                Stage {stage + 1} of {processSteps.length}: {processSteps[stage]?.title}
              </p>
            </div>
          </div>

          <ol className="col-span-4 md:col-span-12 lg:col-span-5 lg:col-start-8">
            {processSteps.map((step, i) => (
              <li
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-step={i}
                data-active={stage === i ? "true" : "false"}
                className="proc-step flex flex-col justify-center border-t border-[color:rgb(212_230_245/0.25)] py-10 lg:min-h-[68vh] lg:py-16"
              >
                <ProcessDrawing stage={i} className="mb-8 h-auto w-full max-w-[22rem] lg:hidden" />
                <p className="proc-dim font-[family-name:var(--font-display)] text-[clamp(3rem,6vw,5.5rem)] font-extrabold leading-none tracking-[-0.04em] text-[color:var(--color-line)] tnum" style={{ fontStretch: "120%" }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="proc-dim h-lg mt-4 text-white">{step.title}</h3>
                <p className="mt-5 max-w-[32rem] text-[1.05rem] leading-relaxed text-[color:rgb(212_230_245/0.88)]">{step.body}</p>
                <ul className="label mt-6 space-y-2 text-[0.95rem] text-[color:var(--color-chalk)]">
                  {step.outputs.map((o) => (
                    <li key={o} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.55em] inline-block h-px w-4 shrink-0 bg-current" />
                      {o}
                    </li>
                  ))}
                </ul>
                <p className="label label-muted mt-6">
                  {step.typical === "Ongoing" ? "Ongoing, for as long as it helps" : `Typically ${step.typical}`}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
