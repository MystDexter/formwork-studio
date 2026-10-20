/**
 * Inner-page title. Set on the same construction guides as the home hero,
 * drawn in once on load, so every page opens with the studio's signature.
 */
export function PageHeader({
  lines,
  intro,
  children,
  size = "clamp(3rem, 10.5vw, 12rem)",
}: {
  lines: string[];
  intro?: React.ReactNode;
  children?: React.ReactNode;
  size?: string;
}) {
  return (
    <header className="frame pb-[clamp(3rem,8vw,7rem)] pt-[calc(var(--nav-h)+clamp(3rem,10vw,8rem))]">
      <h1 className="display" style={{ fontSize: size }}>
        {lines.map((line, i) => (
          <span key={line} className="hero-line" style={{ "--i": i } as React.CSSProperties}>
            <span className="guide" data-g="cap" aria-hidden="true" />
            <span className="guide" data-g="base" aria-hidden="true" />
            <span className="hero-ink">{line}</span>
          </span>
        ))}
      </h1>
      {(intro || children) && (
        <div className="grid-12 mt-[clamp(2rem,5vw,4rem)] gap-y-6">
          {intro && <div className="lede col-span-4 md:col-span-7 lg:col-span-6">{intro}</div>}
          {children && <div className="col-span-4 md:col-span-4 md:col-start-9 md:self-end">{children}</div>}
        </div>
      )}
    </header>
  );
}
