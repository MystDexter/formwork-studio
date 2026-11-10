"use client";

import { forwardRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * One drawing that tells the whole process: scattered notes become a site map,
 * the site map unfolds into a wireframe, the wireframe gets built, and the
 * finished page has colour poured into it and comes alive.
 *
 * The SVG is static markup; buildProcessTimeline() turns it into a GSAP timeline
 * in which stage k is fully formed at time k + 0.5. The desktop layout scrubs
 * that timeline with the scroll; the phone layout plays one segment per step.
 */

type Rect = [x: number, y: number, w: number, h: number];

const CHALK = "#d4e6f5";
const RED = "#f2401d";
const INK = "#151515";
const VELLUM = "#e7e8e3";

export const NODES: {
  scatter: [number, number];
  tree: [number, number];
  layout: Rect;
  tag: string;
  color: string;
}[] = [
  {
    scatter: [96, 150],
    tree: [281, 110],
    layout: [100, 112, 400, 24],
    tag: "<nav>",
    color: INK,
  },
  {
    scatter: [214, 98],
    tree: [140, 250],
    layout: [100, 160, 262, 72],
    tag: "<h1>",
    color: INK,
  },
  {
    scatter: [404, 170],
    tree: [281, 250],
    layout: [380, 160, 120, 152],
    tag: "<picture>",
    color: RED,
  },
  {
    scatter: [130, 302],
    tree: [90, 390],
    layout: [100, 248, 240, 12],
    tag: "<p>",
    color: "#4a4b4f",
  },
  {
    scatter: [318, 256],
    tree: [180, 390],
    layout: [100, 268, 196, 12],
    tag: "",
    color: "#4a4b4f",
  },
  {
    scatter: [470, 300],
    tree: [281, 390],
    layout: [100, 292, 112, 28],
    tag: "<button>",
    color: RED,
  },
  {
    scatter: [190, 430],
    tree: [422, 250],
    layout: [100, 344, 192, 148],
    tag: "<article>",
    color: "#5fa8d3",
  },
  {
    scatter: [372, 418],
    tree: [380, 390],
    layout: [310, 344, 190, 70],
    tag: "<article>",
    color: "#c6c8c1",
  },
  {
    scatter: [484, 468],
    tree: [470, 390],
    layout: [310, 422, 190, 70],
    tag: "<article>",
    color: INK,
  },
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

const WORDS = ["why?", "who for?", "what if…", "how fast?", "by when?"];

/** Short bars that stand in for code being written inside each block. */
const CODE: Rect[] = [
  [112, 176, 150, 5],
  [124, 190, 210, 5],
  [124, 204, 120, 5],
  [112, 366, 140, 5],
  [124, 380, 100, 5],
  [124, 394, 150, 5],
  [136, 408, 80, 5],
  [124, 422, 120, 5],
  [112, 436, 96, 5],
  [112, 450, 60, 5],
  [322, 362, 120, 5],
  [334, 376, 150, 5],
  [334, 390, 90, 5],
  [322, 440, 100, 5],
  [334, 454, 140, 5],
  [334, 468, 70, 5],
];

const LOG = ["✓ Build passed", "✓ 128 tests passed", "✓ Accessibility checks"];

const TREE_SIZE = 18;
const NOTE_SIZE = 22;

const centre = (p: [number, number]) =>
  [p[0] + TREE_SIZE / 2, p[1] + TREE_SIZE / 2] as const;

export const ProcessDrawing = forwardRef<SVGSVGElement, { className?: string }>(
  function ProcessDrawing({ className = "" }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 600 600"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        {/* Finished page ground, poured at launch. */}
        <rect
          className="pd-pourbg"
          x={80}
          y={80}
          width={440}
          height={440}
          fill={VELLUM}
        />

        {/* Column grid: the engineering underneath. */}
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={i}
            className="pd-col"
            x={100 + i * 34}
            y={104}
            width={26}
            height={400}
            fill="rgba(242,64,29,0.13)"
            opacity={0}
          />
        ))}

        {/* Site map connectors. */}
        {TREE_LINKS.map(([a, b]) => {
          const [x1, y1] = centre(NODES[a]!.tree);
          const [x2, y2] = centre(NODES[b]!.tree);
          return (
            <path
              key={`${a}-${b}`}
              className="pd-link"
              d={`M${x1} ${y1}L${x2} ${y2}`}
              stroke={CHALK}
              strokeWidth={1.5}
              pathLength={1}
              strokeDasharray="1 1"
              opacity={0}
            />
          );
        })}

        {/* Browser frame. */}
        <rect
          className="pd-frame"
          x={80}
          y={80}
          width={440}
          height={440}
          fill="none"
          stroke={CHALK}
          strokeWidth={1.5}
          pathLength={1}
          strokeDasharray="1 1"
        />
        <g className="pd-bar">
          <path d="M80 100H520" stroke={CHALK} strokeOpacity={0.5} />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={92 + i * 10}
              cy={90}
              r={2.5}
              fill={CHALK}
              fillOpacity={0.7}
            />
          ))}
        </g>

        {/* The nine marks that travel through every stage. */}
        {NODES.map((n, i) => {
          const [x, y, w, h] = n.layout;
          return (
            <rect
              key={i}
              className="pd-node"
              data-n={i}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={CHALK}
              fillOpacity={0}
              stroke={CHALK}
              strokeOpacity={0}
              strokeWidth={1.5}
            />
          );
        })}

        {/* Code being written. */}
        {CODE.map(([x, y, w, h], i) => (
          <rect
            key={i}
            className="pd-code"
            x={x}
            y={y}
            width={w}
            height={h}
            fill={CHALK}
            fillOpacity={0.55}
            data-w={w}
            opacity={0}
          />
        ))}

        {/* Colour poured into each block at launch. */}
        {NODES.map((n, i) => {
          const [x, y, w, h] = n.layout;
          return (
            <rect
              key={i}
              className="pd-pour"
              data-n={i}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={n.color}
            />
          );
        })}

        {/* Component tags while it's being built. */}
        {NODES.map((n, i) =>
          n.tag ? (
            <text
              key={i}
              className="pd-tag"
              opacity={0}
              x={n.layout[0] + 6}
              y={n.layout[1] + Math.min(16, n.layout[3] - 3)}
              fontSize={11}
              fill={CHALK}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {n.tag}
            </text>
          ) : null,
        )}

        {/* Discovery: questions scribbled next to the notes. */}
        {WORDS.map((w, i) => {
          const [x, y] = NODES[i]!.scatter;
          return (
            <text
              key={w}
              className="pd-word"
              opacity={0}
              x={x + 30}
              y={y + 16}
              fontSize={15}
              fill={CHALK}
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
            >
              {w}
            </text>
          );
        })}

        {/* Dimensions while designing. */}
        <g className="pd-dim" stroke={RED} strokeWidth={1} opacity={0}>
          <path d="M80 62H520M80 56V68M520 56V68" />
          <rect x={276} y={53} width={48} height={18} fill="#13315c" />
          <text
            x={300}
            y={66}
            textAnchor="middle"
            fontSize={11}
            fill={CHALK}
            stroke="none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            1440 px
          </text>
        </g>
        <g className="pd-dim" stroke={RED} strokeWidth={1} opacity={0}>
          <path d="M62 80V520M56 80H68M56 520H68" />
          <rect x={44} y={291} width={36} height={18} fill="#13315c" />
          <text
            x={62}
            y={304}
            textAnchor="middle"
            fontSize={11}
            fill={CHALK}
            stroke="none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            900
          </text>
        </g>

        {/* Build log. */}
        {LOG.map((l, i) => (
          <text
            key={l}
            className="pd-log"
            opacity={0}
            x={84}
            y={548 + i * 18}
            fontSize={12}
            fill={CHALK}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {l}
          </text>
        ))}

        {/* Live: trend, status, score, visitors and the evolve loop. */}
        <path
          className="pd-spark"
          d="M84 584L120 578L156 581L192 568L228 572L264 556L300 560L336 546L372 548"
          fill="none"
          stroke={RED}
          strokeWidth={2}
          pathLength={1}
          strokeDasharray="1 1"
        />
        <g className="pd-live">
          <rect x={404} y={532} width={116} height={30} fill={INK} />
          <circle className="pd-pulse" cx={422} cy={547} r={5} fill="#7ee08a" />
          <text
            x={434}
            y={552}
            fontSize={13}
            fill={VELLUM}
            style={{ fontFamily: "var(--font-display)" }}
          >
            Live
          </text>
        </g>
        <text
          className="pd-score"
          x={520}
          y={588}
          textAnchor="end"
          fontSize={12}
          fill={CHALK}
          style={{ fontFamily: "var(--font-display)" }}
        >
          Score 98
        </text>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            className="pd-visitor"
            cx={150 + i * 70}
            cy={300}
            r={4.5}
            fill={RED}
            stroke={VELLUM}
            strokeWidth={1.5}
          />
        ))}
        <path
          className="pd-loop"
          d="M370 150A52 52 0 1 1 372 322M372 322l-10 -2M372 322l2 -10"
          fill="none"
          stroke={RED}
          strokeWidth={2}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1}
        />
      </svg>
    );
  },
);

const WEEK_AT = [1, 3, 6, 10, 14];

/** Week of a typical project at timeline time t, for the caption under the drawing. */
export function weekAt(t: number) {
  const x = Math.min(4, Math.max(0, t - 0.5));
  const i = Math.floor(x);
  const a = WEEK_AT[i]!;
  const b = WEEK_AT[Math.min(4, i + 1)]!;
  return Math.round(a + (b - a) * (x - i));
}

export function stageAt(t: number) {
  return Math.min(4, Math.max(0, Math.round(t - 0.5)));
}

export function buildProcessTimeline(svg: SVGSVGElement) {
  const q = (s: string) => Array.from(svg.querySelectorAll<SVGElement>(s));
  const nodes = q(".pd-node");
  const pours = q(".pd-pour");
  const code = q(".pd-code");
  const visitors = q(".pd-visitor");
  const score = svg.querySelector<SVGTextElement>(".pd-score");

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.inOut", duration: 0.6 },
  });

  // ---- Initial state (time 0): nothing yet but notes about to arrive.
  tl.set(q(".pd-pourbg"), { attr: { y: 520, height: 0 } }, 0)
    .set(q(".pd-col"), { attr: { height: 0 }, opacity: 1 }, 0)
    .set(q(".pd-link"), { attr: { "stroke-dashoffset": 1 }, opacity: 1 }, 0)
    .set(q(".pd-frame"), { attr: { "stroke-dashoffset": 1 } }, 0)
    .set(
      q(".pd-bar, .pd-dim, .pd-tag, .pd-log, .pd-live, .pd-score, .pd-visitor"),
      { opacity: 0 },
      0,
    )
    .set(q(".pd-word"), { opacity: 0, y: 8 }, 0)
    .set(q(".pd-spark"), { attr: { "stroke-dashoffset": 1 } }, 0)
    .set(code, { attr: { width: 0 }, opacity: 1 }, 0);
  nodes.forEach((n, i) => {
    const [sx, sy] = NODES[i]!.scatter;
    tl.set(
      n,
      {
        attr: {
          x: sx,
          y: sy + 40,
          width: NOTE_SIZE,
          height: NOTE_SIZE,
          "fill-opacity": 0.9,
          "stroke-opacity": 0,
        },
        opacity: 0,
      },
      0,
    );
  });
  pours.forEach((p, i) => {
    const [, y, , h] = NODES[i]!.layout;
    tl.set(p, { attr: { y: y + h, height: 0 } }, 0);
  });

  // ---- 0 to 0.5: Discover. Notes drift in, questions get scribbled.
  nodes.forEach((n, i) => {
    tl.to(
      n,
      {
        attr: { y: NODES[i]!.scatter[1] },
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
      },
      0.05 + i * 0.025,
    );
  });
  tl.to(q(".pd-word"), { opacity: 1, y: 0, duration: 0.2, stagger: 0.04 }, 0.2);

  // ---- 0.65 to 1.35: Strategise. Notes become a site map.
  tl.to(q(".pd-word"), { opacity: 0, duration: 0.2 }, 0.65);
  nodes.forEach((n, i) => {
    const [tx, ty] = NODES[i]!.tree;
    tl.to(
      n,
      {
        attr: {
          x: tx,
          y: ty,
          width: TREE_SIZE,
          height: TREE_SIZE,
          "fill-opacity": 0,
          "stroke-opacity": 1,
        },
        duration: 0.5,
      },
      0.7 + i * 0.015,
    );
  });
  tl.to(
    q(".pd-link"),
    {
      attr: { "stroke-dashoffset": 0 },
      duration: 0.3,
      stagger: 0.03,
      ease: "power1.inOut",
    },
    1.0,
  );

  // ---- 1.65 to 2.35: Design. The map unfolds into a wireframe.
  tl.to(q(".pd-link"), { opacity: 0, duration: 0.25 }, 1.65)
    .set(nodes, { attr: { "stroke-dasharray": "5 4" } }, 1.65)
    .to(
      q(".pd-frame"),
      { attr: { "stroke-dashoffset": 0 }, duration: 0.55 },
      1.65,
    )
    .to(q(".pd-bar"), { opacity: 1, duration: 0.2 }, 1.95);
  nodes.forEach((n, i) => {
    const [x, y, w, h] = NODES[i]!.layout;
    tl.to(
      n,
      { attr: { x, y, width: w, height: h }, duration: 0.55 },
      1.7 + i * 0.02,
    );
  });
  tl.fromTo(
    q(".pd-dim"),
    { opacity: 0, scale: 0.96, transformOrigin: "50% 50%" },
    { opacity: 1, scale: 1, duration: 0.25, stagger: 0.08 },
    2.05,
  );

  // ---- 2.65 to 3.35: Develop. Grid, components, code and a passing build.
  tl.to(q(".pd-dim"), { opacity: 0, duration: 0.2 }, 2.65)
    .set(nodes, { attr: { "stroke-dasharray": "none" } }, 2.65)
    .to(
      q(".pd-col"),
      { attr: { height: 400 }, duration: 0.35, stagger: 0.015 },
      2.65,
    )
    .to(q(".pd-tag"), { opacity: 1, duration: 0.2, stagger: 0.03 }, 2.8);
  code.forEach((c, i) => {
    tl.to(
      c,
      { attr: { width: Number(c.dataset.w) }, duration: 0.18, ease: "none" },
      2.8 + i * 0.03,
    );
  });
  tl.to(q(".pd-log"), { opacity: 1, duration: 0.12, stagger: 0.15 }, 2.95);

  // ---- 3.65 to 4.35: Launch and evolve. Colour is poured in, the page goes live.
  tl.to(q(".pd-col, .pd-tag, .pd-log"), { opacity: 0, duration: 0.2 }, 3.65)
    .to(
      q(".pd-pourbg"),
      { attr: { y: 80, height: 440 }, duration: 0.35, ease: "power2.out" },
      3.65,
    )
    .to(nodes, { attr: { "stroke-opacity": 0 }, duration: 0.3 }, 3.75)
    .to(q(".pd-bar path"), { attr: { stroke: INK } }, 3.75);
  pours.forEach((p, i) => {
    const [, y, , h] = NODES[i]!.layout;
    tl.to(
      p,
      { attr: { y, height: h }, duration: 0.3, ease: "power2.out" },
      3.8 + i * 0.03,
    );
  });
  tl.to(
    q(".pd-spark"),
    { attr: { "stroke-dashoffset": 0 }, duration: 0.4, ease: "none" },
    3.95,
  )
    .to(q(".pd-live, .pd-score"), { opacity: 1, duration: 0.15 }, 4.1)
    .to(q(".pd-visitor"), { opacity: 1, duration: 0.15, stagger: 0.03 }, 4.2);
  if (score) {
    const counter = { v: 0 };
    tl.fromTo(
      counter,
      { v: 0 },
      {
        v: 98,
        duration: 0.3,
        ease: "power1.out",
        onUpdate: () => (score.textContent = `Score ${Math.round(counter.v)}`),
      },
      4.1,
    );
  }
  // Hold the final state until the end of the timeline.
  tl.set({}, {}, 5);

  // ---- The live loop: visitors wander, the page keeps evolving. Started and
  // stopped by the caller; never runs under reduced motion.
  const alive = gsap.timeline({ paused: true, repeat: -1 });
  const rand = gsap.utils.random;
  visitors.forEach((v, i) => {
    alive.to(
      v,
      {
        attr: { cx: () => rand(110, 490), cy: () => rand(130, 500) },
        duration: () => rand(1.6, 2.6),
        ease: "sine.inOut",
        repeat: 3,
        repeatRefresh: true,
      },
      i * 0.15,
    );
  });
  const picture = pours[2];
  alive
    .fromTo(
      q(".pd-loop"),
      { attr: { "stroke-dashoffset": 1 }, opacity: 1 },
      { attr: { "stroke-dashoffset": 0 }, duration: 0.9, ease: "power2.inOut" },
      1.2,
    )
    .to(q(".pd-loop"), { opacity: 0, duration: 0.4 }, 2.4);
  if (picture)
    alive
      .to(picture, { attr: { fill: "#5fa8d3" }, duration: 0.35 }, 2.1)
      .to(picture, { attr: { fill: RED }, duration: 0.35 }, 6.4);
  alive.to(
    q(".pd-pulse"),
    {
      attr: { r: 7 },
      opacity: 0.5,
      duration: 0.6,
      yoyo: true,
      repeat: 7,
      ease: "sine.inOut",
    },
    0,
  );

  return { tl, alive };
}
