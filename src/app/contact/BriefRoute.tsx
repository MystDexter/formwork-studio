"use client";

import { useEffect, useState } from "react";
import type { Status } from "./ContactForm";

/** Adds working days (Monday to Friday) to a date. */
function addWorkingDays(from: Date, days: number) {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left--;
  }
  return d;
}

/** "Thu 12 Nov", in the visitor's own calendar. */
const fmt = (d: Date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("weekday")} ${get("day")} ${get("month")}`;
};

/**
 * What happens after you press send, drawn as a route with real dates worked out
 * from the visitor's own today. A small brief glides along it while you write.
 */
export function BriefRoute({
  status,
  compact = false,
}: {
  status: Status;
  compact?: boolean;
}) {
  const [dates, setDates] = useState<{ today: string; reply: string } | null>(
    null,
  );
  useEffect(() => {
    const now = new Date();
    setDates({ today: fmt(now), reply: fmt(addWorkingDays(now, 2)) });
  }, []);
  const sent = status.kind === "sent";

  const steps = [
    {
      title: sent ? "Brief sent" : "You send your brief",
      when: dates ? `Today, ${dates.today}` : "Today",
      body: "A designer and an engineer both read it.",
    },
    {
      title: "We reply",
      when: dates ? `By ${dates.reply}` : "Within two working days",
      body: "With questions, and times for a call.",
    },
    {
      title: "A 30-minute call",
      when: "At a time that suits you",
      body: "No pitch deck. We tell you honestly whether we're the right fit.",
    },
    {
      title: "A written proposal",
      when: "About a week after the call",
      body: "Scope, timeline and a fixed price. No surprises later.",
    },
  ];

  return (
    <ol
      className={`brief-route relative ${compact ? "space-y-5" : "space-y-8"}`}
      data-sent={sent ? "true" : "false"}
    >
      <span className="brief-route-runner" aria-hidden="true">
        <span />
      </span>
      {steps.map((s, i) => (
        <li
          key={i}
          className="relative pl-9"
          data-state={
            sent
              ? i === 0
                ? "done"
                : i === 1
                  ? "next"
                  : "todo"
              : i === 0
                ? "next"
                : "todo"
          }
        >
          <span className="brief-route-node" aria-hidden="true" />
          <p className="label text-[0.8rem] text-[color:var(--color-graphite)] tnum">
            {s.when}
          </p>
          <h3
            className={`${compact ? "text-[1.02rem]" : "h-sm"} mt-1 font-[family-name:var(--font-display)] font-semibold`}
          >
            {s.title}
          </h3>
          {!compact && (
            <p className="mt-1.5 text-[1rem] leading-relaxed">{s.body}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
