import { site } from "@/content/site";

/**
 * The Formwork mark: a square drawn as two crop marks (the formwork),
 * with a solid block poured into one corner (the finished form).
 */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path d="M1 9V1h8M23 15v8h-8" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <rect x="11" y="11" width="8" height="8" fill="var(--color-redline)" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="h-[1.15em] w-[1.15em] shrink-0" />
      <span
        className="font-[family-name:var(--font-display)] font-extrabold tracking-[-0.035em]"
        style={{ fontStretch: "122%" }}
      >
        {site.name}
      </span>
    </span>
  );
}
