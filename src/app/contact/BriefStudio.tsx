"use client";

import { useCallback, useState } from "react";
import { site } from "@/content/site";
import type { Brief } from "@/lib/contact";
import { ContactForm, type Status } from "./ContactForm";
import { BriefSheet, briefProgress } from "./BriefSheet";
import { BriefRoute } from "./BriefRoute";

const EMPTY: Brief = {
  name: "",
  email: "",
  company: "",
  types: [],
  budget: "",
  timeline: "",
  message: "",
};

function ProgressLabel({ brief, status }: { brief: Brief; status: Status }) {
  const pct = Math.round(briefProgress(brief) * 100);
  const text =
    status.kind === "sent"
      ? "Brief sent"
      : status.kind === "fallback"
        ? "Brief ready to email"
        : pct === 0
          ? "Your brief draws itself as you write it"
          : pct === 100
            ? "Brief fully drawn, ready to send"
            : `Brief ${pct}% drawn`;
  return <p className="label text-[0.85rem] tnum">{text}</p>;
}

/**
 * The contact form plus the drawings that respond to it. On wide screens the
 * live sheet and the route sit beside the form; on smaller screens the route
 * comes first and the sheet sits just above the send button.
 */
export function BriefStudio() {
  const [brief, setBrief] = useState<Brief>(EMPTY);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const onChange = useCallback((b: Brief, s: Status) => {
    setBrief(b);
    setStatus(s);
  }, []);

  return (
    <div className="grid-12 gap-y-14">
      <section
        className="col-span-4 border-y border-[color:rgb(21_21_21/0.18)] py-8 md:col-span-12 lg:hidden"
        aria-labelledby="next-title-compact"
      >
        <h2 id="next-title-compact" className="h-sm mb-6">
          What happens next
        </h2>
        <BriefRoute status={status} compact />
      </section>

      <div className="col-span-4 md:col-span-12 lg:col-span-7">
        <h2 id="brief-title" className="h-md mb-10">
          Your brief
        </h2>
        <ContactForm
          onChange={onChange}
          beforeSubmit={
            <div
              className="mt-10 flex items-center gap-5 lg:hidden"
              aria-hidden="true"
            >
              <BriefSheet
                brief={brief}
                status={status}
                className="h-auto w-32 shrink-0"
              />
              <ProgressLabel brief={brief} status={status} />
            </div>
          }
        />
      </div>

      <aside
        className="col-span-4 hidden lg:col-span-4 lg:col-start-9 lg:block"
        aria-labelledby="next-title"
      >
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
          <div aria-hidden="true">
            <BriefSheet
              brief={brief}
              status={status}
              className="h-auto w-full max-w-[19rem]"
            />
            <div className="mt-3">
              <ProgressLabel brief={brief} status={status} />
            </div>
          </div>
          <h2 id="next-title" className="h-md mt-12">
            What happens next
          </h2>
          <div className="mt-8">
            <BriefRoute status={status} />
          </div>
          <p className="label mt-10 text-[0.9rem] text-[color:var(--color-graphite)]">
            Studio in {site.location.city}, working with teams in every time
            zone.
          </p>
        </div>
      </aside>
    </div>
  );
}
