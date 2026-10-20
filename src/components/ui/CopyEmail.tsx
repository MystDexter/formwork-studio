"use client";

import { useState } from "react";

export function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2400);
  };
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <button type="button" onClick={copy} className="label link-draw min-h-11 text-[0.9rem]">
        {state === "copied" ? "Copied to clipboard" : state === "failed" ? "Copy failed, select the address instead" : "Copy address"}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Email address copied" : state === "failed" ? "Copying failed" : ""}
      </span>
    </span>
  );
}
