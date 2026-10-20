"use client";

import { useEffect, useState } from "react";
import { GRID_EVENT } from "./GridOverlay";

export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone, hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return (
    <time className="tnum" suppressHydrationWarning>
      {time ?? "--:--"}
    </time>
  );
}

export function GridSwitch() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    try {
      setOn(window.localStorage.getItem("formwork:grid") === "1");
    } catch {}
    const onState = (e: Event) => setOn(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener(`${GRID_EVENT}:state`, onState);
    return () => window.removeEventListener(`${GRID_EVENT}:state`, onState);
  }, []);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => window.dispatchEvent(new Event(GRID_EVENT))}
      className="label inline-flex min-h-11 items-center gap-3"
    >
      <span
        aria-hidden="true"
        className="relative inline-block h-4 w-7 border border-current transition-colors"
        style={{ background: on ? "var(--color-redline)" : "transparent" }}
      >
        <span
          className="absolute top-[2px] h-2.5 w-2.5 bg-current transition-[left] duration-300"
          style={{ left: on ? "calc(100% - 12px)" : "2px" }}
        />
      </span>
      Show the grid <span className="label-muted">(or press G)</span>
    </button>
  );
}
