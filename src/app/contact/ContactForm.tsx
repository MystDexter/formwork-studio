"use client";

import { useRef, useState } from "react";
import { site } from "@/content/site";
import {
  BUDGETS,
  PROJECT_TYPES,
  TIMELINES,
  briefToText,
  validateBrief,
  type Brief,
  type BriefErrors,
} from "@/lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "fallback"; mailto: string }
  | { kind: "error"; mailto: string };

const EMPTY: Brief = {
  name: "",
  email: "",
  company: "",
  types: [],
  budget: "",
  timeline: "",
  message: "",
};

function mailtoFor(b: Brief) {
  const subject = `Project enquiry from ${b.name}${b.company ? `, ${b.company}` : ""}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(briefToText(b))}`;
}

export function ContactForm() {
  const [brief, setBrief] = useState<Brief>(EMPTY);
  const [errors, setErrors] = useState<BriefErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  const update = <K extends keyof Brief>(key: K, value: Brief[K]) => {
    const next = { ...brief, [key]: value };
    setBrief(next);
    if (attempted) setErrors(validateBrief(next));
  };

  const toggleType = (t: string) =>
    update(
      "types",
      brief.types.includes(t)
        ? brief.types.filter((x) => x !== t)
        : [...brief.types, t],
    );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    const found = validateBrief(brief);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus({ kind: "sending" });
    const mailto = mailtoFor(brief);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...brief,
          website: honeypot.current?.value ?? "",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        reason?: string;
      };
      if (res.ok && data.ok) setStatus({ kind: "sent" });
      else if (data.reason === "not_configured")
        setStatus({ kind: "fallback", mailto });
      else setStatus({ kind: "error", mailto });
    } catch {
      setStatus({ kind: "error", mailto });
    }
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const errorList = Object.entries(errors) as [keyof Brief, string][];
  const fieldProps = (key: keyof Brief) => ({
    "aria-invalid": errors[key] ? (true as const) : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  if (status.kind === "sent") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        className="border-t-[3px] border-[color:var(--color-ink)] pt-8 outline-none"
        role="status"
      >
        <p className="h-lg">
          Brief sent. Thank you, {brief.name.split(" ")[0]}.
        </p>
        <p className="mt-5 max-w-[34rem] text-[1.08rem] leading-relaxed">
          It&apos;s with us now. {site.replyPromise} If anything is urgent,
          email{" "}
          <a className="link-draw" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      id="brief"
      onSubmit={onSubmit}
      noValidate
      className="scroll-mt-28"
      aria-describedby="form-note"
    >
      {attempted && errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-10 border-l-[3px] border-[#b0250a] bg-[rgb(176_37_10/0.06)] p-5 outline-none"
        >
          <p className="h-sm">
            Check{" "}
            {errorList.length === 1
              ? "one thing"
              : `${errorList.length} things`}{" "}
            before sending
          </p>
          <ul className="mt-3 space-y-1.5 text-[1rem]">
            {errorList.map(([key, msg]) => (
              <li key={key}>
                <a href={`#field-${key}`} className="link-draw">
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-x-8 gap-y-9 md:grid-cols-2">
        <div className="field">
          <label htmlFor="field-name" className="field-label">
            Your name
          </label>
          <input
            id="field-name"
            className="field-input"
            autoComplete="name"
            value={brief.name}
            onChange={(e) => update("name", e.target.value)}
            required
            {...fieldProps("name")}
          />
          {errors.name && (
            <p id="name-error" className="field-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="field-email" className="field-label">
            Email
          </label>
          <input
            id="field-email"
            type="email"
            inputMode="email"
            className="field-input"
            autoComplete="email"
            value={brief.email}
            onChange={(e) => update("email", e.target.value)}
            required
            {...fieldProps("email")}
          />
          {errors.email && (
            <p id="email-error" className="field-error">
              {errors.email}
            </p>
          )}
        </div>
        <div className="field md:col-span-2">
          <label htmlFor="field-company" className="field-label">
            Company or organisation{" "}
            <span className="font-normal opacity-70">(optional)</span>
          </label>
          <input
            id="field-company"
            className="field-input"
            autoComplete="organization"
            value={brief.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>

        <fieldset
          className="md:col-span-2"
          id="field-types"
          aria-describedby={errors.types ? "types-error" : undefined}
        >
          <legend className="field-label mb-3">
            What are you planning? Choose any that apply.
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {PROJECT_TYPES.map((t) => (
              <label key={t} className="chip">
                <input
                  type="checkbox"
                  checked={brief.types.includes(t)}
                  onChange={() => toggleType(t)}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>
          {errors.types && (
            <p id="types-error" className="field-error mt-3">
              {errors.types}
            </p>
          )}
        </fieldset>

        <fieldset
          className="md:col-span-2"
          id="field-budget"
          aria-describedby={errors.budget ? "budget-error" : undefined}
        >
          <legend className="field-label mb-3">Budget, in US dollars</legend>
          <div className="flex flex-wrap gap-2.5">
            {BUDGETS.map((b) => (
              <label key={b} className="chip">
                <input
                  type="radio"
                  name="budget"
                  value={b}
                  checked={brief.budget === b}
                  onChange={() => update("budget", b)}
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
          {errors.budget && (
            <p id="budget-error" className="field-error mt-3">
              {errors.budget}
            </p>
          )}
        </fieldset>

        <div className="field md:col-span-2">
          <label htmlFor="field-timeline" className="field-label">
            When would you like to start?{" "}
            <span className="font-normal opacity-70">(optional)</span>
          </label>
          <select
            id="field-timeline"
            className="field-input appearance-none bg-[length:12px] bg-[right_0.25rem_center] bg-no-repeat pr-8"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23151515' stroke-width='1.5'/%3E%3C/svg%3E\")",
            }}
            value={brief.timeline}
            onChange={(e) => update("timeline", e.target.value)}
          >
            <option value="">Choose a timeline</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="field md:col-span-2">
          <label htmlFor="field-message" className="field-label">
            Tell us about it
          </label>
          <p
            id="message-hint"
            className="text-[0.98rem] text-[color:var(--color-graphite)]"
          >
            What you want to build, who it&apos;s for, and what would make it a
            success. Rough is fine.
          </p>
          <textarea
            id="field-message"
            className="field-input"
            rows={6}
            value={brief.message}
            onChange={(e) => update("message", e.target.value)}
            required
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={
              errors.message ? "message-hint message-error" : "message-hint"
            }
          />
          {errors.message && (
            <p id="message-error" className="field-error">
              {errors.message}
            </p>
          )}
        </div>

        {/* Spam trap: hidden from people and assistive tech. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="field-website">Website</label>
          <input
            id="field-website"
            ref={honeypot}
            tabIndex={-1}
            autoComplete="off"
            name="website"
          />
        </div>
      </div>

      <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="btn btn-lg"
          disabled={status.kind === "sending"}
        >
          {status.kind === "sending" ? "Sending brief" : "Send brief"}
        </button>
        <p
          id="form-note"
          className="label max-w-[22rem] text-[0.85rem] text-[color:var(--color-graphite)]"
        >
          We only use these details to reply to you. {site.replyPromise}
        </p>
      </div>

      {(status.kind === "fallback" || status.kind === "error") && (
        <div
          ref={resultRef}
          tabIndex={-1}
          role="status"
          className="mt-10 border border-dashed border-[color:var(--color-ink)] p-6 outline-none"
        >
          <p className="h-sm">
            {status.kind === "fallback"
              ? "Your brief is ready to send by email"
              : "We couldn't send your brief from this page"}
          </p>
          <p className="mt-3 max-w-[36rem] text-[1.02rem] leading-relaxed">
            {status.kind === "fallback"
              ? "Online sending isn't switched on for this site yet, so nothing has been sent. Open your email app and your brief will be filled in, ready to go."
              : "Something went wrong on our side and nothing was sent. Your brief is still here; you can send it by email instead."}
          </p>
          <a href={status.mailto} className="btn mt-5">
            Open in your email app
          </a>
        </div>
      )}
    </form>
  );
}
