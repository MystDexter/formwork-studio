"use client";

import { BUDGETS, PROJECT_TYPES, type Brief } from "@/lib/contact";
import type { Status } from "./ContactForm";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** How much of the brief is drawn: five equal parts, the message filling in as it grows. */
export function briefProgress(b: Brief) {
  const parts = [
    b.name.trim().length >= 2 ? 1 : 0,
    EMAIL.test(b.email.trim()) ? 1 : 0,
    b.types.length > 0 ? 1 : 0,
    b.budget ? 1 : 0,
    Math.min(1, b.message.trim().length / 20),
  ];
  return parts.reduce((a, c) => a + c, 0) / parts.length;
}

const TILE_LABELS: Record<string, string> = {
  "New website": "Website",
  Redesign: "Redesign",
  "Web app or product": "Web app",
  "E-commerce": "Commerce",
  "Interactive experience": "Interactive",
  "Performance or accessibility": "Perf and a11y",
};

const BUDGET_LENGTH = [64, 116, 172, 252];
const LINE_WIDTHS = [1, 0.93, 0.97, 0.88, 0.95, 0.62];
const MAX_W = 252;

const INK = "#151515";
const GRAPHITE = "#4a4b4f";
const RED = "#f2401d";
const LINE = "#5fa8d3";

/**
 * A technical drawing of the visitor's own brief that fills in as they write it:
 * the name sets the title, chosen project types pour into their tiles, the budget
 * becomes a dimension line, and the message greeks in line by line.
 */
export function BriefSheet({
  brief,
  status,
  className = "",
}: {
  brief: Brief;
  status: Status;
  className?: string;
}) {
  const first = brief.name.trim().split(/\s+/)[0] ?? "";
  const title =
    first.length >= 2
      ? `${first.length > 14 ? `${first.slice(0, 13)}…` : first}’s brief`
      : "";
  const budgetIndex = (BUDGETS as readonly string[]).indexOf(brief.budget);
  const unsure = brief.budget === "Not sure yet";
  const budgetLen =
    budgetIndex < 0 ? 0 : unsure ? MAX_W : BUDGET_LENGTH[budgetIndex]!;
  const chars = brief.message.trim().length;
  const lineCount = Math.min(LINE_WIDTHS.length, chars / 48);
  const progress = briefProgress(brief);
  const done = status.kind === "sent";
  const stamp =
    status.kind === "sent"
      ? "Sent"
      : status.kind === "fallback"
        ? "Ready to email"
        : "";

  const grow = (on: boolean | number, axis: "x" | "y" = "x") => ({
    transform: `scale${axis.toUpperCase()}(${typeof on === "number" ? on : on ? 1 : 0})`,
    transformBox: "fill-box" as const,
    transformOrigin: axis === "x" ? "left center" : "center bottom",
    transition: "transform 0.55s cubic-bezier(0.2,0.7,0.1,1)",
  });
  const fade = (on: boolean) => ({
    opacity: on ? 1 : 0,
    transition: "opacity 0.4s cubic-bezier(0.2,0.7,0.1,1)",
  });

  return (
    <svg
      viewBox="0 0 300 390"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect x={10} y={10} width={280} height={370} fill="#f4f4ef" />
      {/* Poured blue behind everything once the brief is sent. */}
      <rect
        x={10}
        y={10}
        width={280}
        height={370}
        fill={LINE}
        fillOpacity={0.16}
        style={grow(done, "y")}
      />
      <rect
        x={10}
        y={10}
        width={280}
        height={370}
        fill="none"
        stroke={INK}
        strokeOpacity={progress >= 1 ? 0.9 : 0.4}
        strokeDasharray={progress >= 1 ? undefined : "4 4"}
        style={{ transition: "stroke-opacity 0.4s" }}
      />

      <text
        x={24}
        y={34}
        fontSize={12}
        fontWeight={650}
        fill={INK}
        style={{ fontFamily: "var(--font-display)" }}
      >
        Project brief
      </text>
      <text
        x={276}
        y={34}
        fontSize={10}
        textAnchor="end"
        fill={GRAPHITE}
        style={{ fontFamily: "var(--font-display)" }}
      >
        Sheet 1 of 1
      </text>
      <path d="M24 44H276" stroke={INK} strokeOpacity={0.25} />

      {/* Title: the visitor's name. */}
      <g style={fade(!title)}>
        <rect
          x={24}
          y={62}
          width={170}
          height={24}
          fill="none"
          stroke={GRAPHITE}
          strokeOpacity={0.5}
          strokeDasharray="3 3"
        />
        <text
          x={32}
          y={78}
          fontSize={10}
          fill={GRAPHITE}
          fillOpacity={0.8}
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your name
        </text>
      </g>
      <text
        x={24}
        y={82}
        fontSize={23}
        fontWeight={800}
        fill={INK}
        style={{
          fontFamily: "var(--font-display)",
          fontStretch: "110%",
          letterSpacing: "-0.02em",
          ...fade(!!title),
        }}
      >
        {title}
      </text>
      <text
        x={24}
        y={104}
        fontSize={13}
        fill={GRAPHITE}
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          ...fade(!!brief.company.trim()),
        }}
      >
        {brief.company.trim().slice(0, 34)}
      </text>

      {/* Project types: each choice pours into its tile. */}
      <text
        x={24}
        y={128}
        fontSize={10}
        fill={GRAPHITE}
        style={{ fontFamily: "var(--font-display)" }}
      >
        Project
      </text>
      {PROJECT_TYPES.map((t, i) => {
        const x = 24 + (i % 3) * 86;
        const y = 136 + Math.floor(i / 3) * 42;
        const on = brief.types.includes(t);
        return (
          <g key={t}>
            <rect
              x={x}
              y={y}
              width={80}
              height={36}
              fill="none"
              stroke={INK}
              strokeOpacity={on ? 0 : 0.3}
              strokeDasharray="3 3"
            />
            <rect
              x={x}
              y={y}
              width={80}
              height={36}
              fill={INK}
              style={grow(on, "y")}
            />
            <text
              x={x + 40}
              y={y + 22}
              fontSize={9.5}
              textAnchor="middle"
              fill={on ? "#e7e8e3" : GRAPHITE}
              fillOpacity={on ? 1 : 0.6}
              style={{
                fontFamily: "var(--font-display)",
                transition: "fill 0.3s",
              }}
            >
              {TILE_LABELS[t] ?? t}
            </text>
          </g>
        );
      })}

      {/* Budget: a dimension line whose length is the range. */}
      <text
        x={24}
        y={238}
        fontSize={10}
        fill={GRAPHITE}
        style={{ fontFamily: "var(--font-display)" }}
      >
        Budget
      </text>
      <text
        x={276}
        y={238}
        fontSize={10}
        fontWeight={600}
        textAnchor="end"
        fill={RED}
        style={{ fontFamily: "var(--font-display)", ...fade(budgetIndex >= 0) }}
      >
        {brief.budget}
      </text>
      <rect
        x={24}
        y={248}
        width={1.5}
        height={12}
        fill={RED}
        style={fade(budgetIndex >= 0)}
      />
      <rect
        x={24}
        y={253.25}
        width={MAX_W}
        height={1.5}
        fill={RED}
        style={grow(budgetLen / MAX_W)}
      />
      <rect
        x={24}
        y={248}
        width={1.5}
        height={12}
        fill={RED}
        style={{
          transform: `translateX(${Math.max(0, budgetLen - 1.5)}px)`,
          transition:
            "transform 0.55s cubic-bezier(0.2,0.7,0.1,1), opacity 0.4s",
          opacity: budgetIndex >= 0 && !unsure ? 1 : 0,
        }}
      />
      {/* Not sure yet: the line runs out into a question. */}
      <text
        x={276}
        y={274}
        fontSize={11}
        fontWeight={700}
        textAnchor="end"
        fill={RED}
        style={{ fontFamily: "var(--font-display)", ...fade(unsure) }}
      >
        ?
      </text>

      <text
        x={24}
        y={282}
        fontSize={10}
        fill={GRAPHITE}
        style={{ fontFamily: "var(--font-display)", ...fade(!!brief.timeline) }}
      >
        {brief.timeline ? `Start: ${brief.timeline}` : ""}
      </text>

      {/* Message: greeked in line by line as it's written. */}
      <text
        x={24}
        y={302}
        fontSize={10}
        fill={GRAPHITE}
        style={{ fontFamily: "var(--font-display)" }}
      >
        Message
      </text>
      {LINE_WIDTHS.map((f, i) => {
        const fill = Math.max(0, Math.min(1, lineCount - i));
        return (
          <g key={i}>
            <rect
              x={24}
              y={310 + i * 8.5}
              width={MAX_W * f}
              height={3.5}
              fill={INK}
              fillOpacity={0.06}
            />
            <rect
              x={24}
              y={310 + i * 8.5}
              width={MAX_W * f}
              height={3.5}
              fill={INK}
              fillOpacity={0.55}
              style={grow(fill)}
            />
          </g>
        );
      })}

      {/* Progress along the foot of the sheet. */}
      <rect
        x={24}
        y={366}
        width={MAX_W}
        height={2.5}
        fill={INK}
        fillOpacity={0.1}
      />
      <rect
        x={24}
        y={366}
        width={MAX_W}
        height={2.5}
        fill={RED}
        style={grow(progress)}
      />

      {/* Stamp. */}
      <g
        style={{
          opacity: stamp ? 1 : 0,
          transform: stamp
            ? "rotate(-8deg) scale(1)"
            : "rotate(-8deg) scale(1.6)",
          transformBox: "view-box",
          transformOrigin: "150px 205px",
          transition:
            "opacity 0.35s, transform 0.45s cubic-bezier(0.2,0.7,0.1,1)",
        }}
      >
        <rect
          x={70}
          y={180}
          width={160}
          height={50}
          fill="#f4f4ef"
          fillOpacity={0.85}
          stroke={RED}
          strokeWidth={2.5}
        />
        <text
          x={150}
          y={213}
          textAnchor="middle"
          fontSize={stamp.length > 6 ? 17 : 24}
          fontWeight={800}
          fill={RED}
          style={{ fontFamily: "var(--font-display)", fontStretch: "112%" }}
        >
          {stamp}
        </text>
      </g>
    </svg>
  );
}
