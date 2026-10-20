import type { GlyphKey } from "@/content/services";

/** Small construction drawings, one per service. Blue circles are the guides; black is the finished line. */
const paths: Record<GlyphKey, React.ReactNode> = {
  web: (
    <>
      <rect x="14" y="22" width="92" height="76" />
      <path d="M14 34h92M24 46h44M24 56h30M24 70h72v18H24z" />
    </>
  ),
  app: (
    <>
      <rect x="18" y="18" width="62" height="50" />
      <rect x="40" y="40" width="62" height="58" />
      <path d="M40 52h62M52 64h24M52 74h38" />
    </>
  ),
  interactive: (
    <>
      <circle cx="60" cy="60" r="18" />
      <ellipse cx="60" cy="60" rx="44" ry="16" transform="rotate(-24 60 60)" />
      <path d="M86 88l12 12M86 88v10M86 88h10" />
    </>
  ),
  commerce: (
    <>
      <path d="M26 42h68l-6 58H32z" />
      <path d="M44 42v-8a16 16 0 0 1 32 0v8" />
      <path d="M48 62h24" />
    </>
  ),
  ux: (
    <>
      <rect x="14" y="24" width="26" height="20" />
      <rect x="80" y="24" width="26" height="20" />
      <rect x="47" y="76" width="26" height="20" />
      <path d="M40 34h40M27 44l33 32M93 44 73 76" />
    </>
  ),
  redesign: (
    <>
      <rect x="14" y="36" width="38" height="48" strokeDasharray="4 4" />
      <rect x="68" y="30" width="40" height="60" />
      <path d="M56 60h8m-4-4 4 4-4 4M76 42h24M76 52h16" />
    </>
  ),
  performance: (
    <>
      <path d="M22 82a40 40 0 0 1 76 0" />
      <path d="M60 82l22-30" />
      <circle cx="60" cy="82" r="4" />
      <path d="M30 70l6 3M90 70l-6 3M60 44v7" />
    </>
  ),
  product: (
    <>
      <path d="M60 18l38 20v44L60 102 22 82V38z" />
      <path d="M22 38l38 20 38-20M60 58v44" />
    </>
  ),
};

export function ServiceGlyph({ glyph, className = "" }: { glyph: GlyphKey; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="var(--color-line)" strokeWidth="1" opacity="0.7">
        <circle cx="60" cy="60" r="50" />
        <path d="M0 60h120M60 0v120" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="square">
        {paths[glyph]}
      </g>
    </svg>
  );
}
