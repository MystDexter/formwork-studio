/**
 * Drawing primitives shared by the project scenes.
 * Each primitive renders either its finished form or its wireframe from the same geometry,
 * so the two states always line up exactly.
 */

export const CHALK = "#d4e6f5";
export const CHALK_DIM = "rgba(212,230,245,0.38)";
export const CHALK_FAINT = "rgba(212,230,245,0.16)";
export const RED = "#f2401d";

export const DISPLAY = "var(--font-display), Arial, sans-serif";
export const SERIF = "var(--font-serif), Georgia, serif";

type TxtProps = {
  wire: boolean;
  x: number;
  y: number;
  size: number;
  children: string;
  fill: string;
  weight?: number;
  family?: "display" | "serif";
  italic?: boolean;
  anchor?: "start" | "middle" | "end";
  stretch?: number;
  tracking?: number;
  opacity?: number;
};

/** Text: large text becomes an outline in wireframe, small text becomes greeked bars. */
export function Txt({
  wire,
  x,
  y,
  size,
  children,
  fill,
  weight = 500,
  family = "display",
  italic = false,
  anchor = "start",
  stretch = 100,
  tracking = 0,
  opacity = 1,
}: TxtProps) {
  if (wire && size < 44) {
    const avg = family === "serif" ? 0.47 : 0.54 * (stretch / 100);
    const w = Math.max(size, children.length * size * avg);
    const bx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
    return (
      <rect
        x={bx}
        y={y - size * 0.62}
        width={w}
        height={size * 0.5}
        fill={CHALK_DIM}
      />
    );
  }
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fontStyle={italic ? "italic" : "normal"}
      textAnchor={anchor}
      letterSpacing={tracking}
      opacity={wire ? 1 : opacity}
      style={{
        fontFamily: family === "serif" ? SERIF : DISPLAY,
        fontStretch: `${stretch}%`,
      }}
      fill={wire ? "none" : fill}
      stroke={wire ? CHALK : "none"}
      strokeWidth={wire ? 1.2 : 0}
    >
      {children}
    </text>
  );
}

type BoxProps = {
  wire: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  r?: number;
  opacity?: number;
  dashed?: boolean;
  /** Draw the classic wireframe "image" cross. */
  cross?: boolean;
  stroke?: string;
};

export function Box({
  wire,
  x,
  y,
  w,
  h,
  fill,
  r = 0,
  opacity = 1,
  dashed,
  cross,
  stroke,
}: BoxProps) {
  if (wire) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={r}
          fill="none"
          stroke={CHALK}
          strokeWidth={1.2}
          strokeDasharray={dashed ? "6 6" : undefined}
        />
        {cross && (
          <path
            d={`M${x} ${y}L${x + w} ${y + h}M${x + w} ${y}L${x} ${y + h}`}
            stroke={CHALK_FAINT}
            strokeWidth={1}
          />
        )}
      </g>
    );
  }
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill={fill}
      opacity={opacity}
      stroke={stroke ?? "none"}
      strokeWidth={stroke ? 1.5 : 0}
    />
  );
}

/** A path that is filled when finished and stroked when drawn. */
export function Shape({
  wire,
  d,
  fill,
  stroke,
  strokeWidth = 0,
  opacity = 1,
}: {
  wire: boolean;
  d: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}) {
  return wire ? (
    <path d={d} fill="none" stroke={CHALK} strokeWidth={1.2} />
  ) : (
    <path
      d={d}
      fill={fill}
      stroke={stroke ?? "none"}
      strokeWidth={strokeWidth}
      opacity={opacity}
    />
  );
}

/** Annotation with a leader line. Only appears on the drawing. */
export function Annot({
  x,
  y,
  tx,
  ty,
  children,
  anchor = "start",
}: {
  x: number;
  y: number;
  tx: number;
  ty: number;
  children: string;
  anchor?: "start" | "end";
}) {
  const w = children.length * 8.4 + 20;
  const bx = anchor === "end" ? tx - w : tx;
  return (
    <g>
      <path d={`M${x} ${y}L${tx} ${ty}`} stroke={RED} strokeWidth={1.2} />
      <circle cx={x} cy={y} r={4} fill={RED} />
      <rect
        x={bx}
        y={ty - 15}
        width={w}
        height={30}
        fill="#0d2444"
        stroke={RED}
        strokeWidth={1.2}
      />
      <text
        x={bx + 10}
        y={ty + 5}
        fontSize={15}
        fontWeight={560}
        fill={CHALK}
        style={{ fontFamily: DISPLAY, fontStretch: "100%" }}
      >
        {children}
      </text>
    </g>
  );
}

/** A horizontal dimension line with end ticks and a measurement. */
export function Dim({
  x1,
  x2,
  y,
  label,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
}) {
  const mid = (x1 + x2) / 2;
  return (
    <g stroke={CHALK_DIM} strokeWidth={1}>
      <path
        d={`M${x1} ${y}H${x2}M${x1} ${y - 8}V${y + 8}M${x2} ${y - 8}V${y + 8}`}
      />
      <rect
        x={mid - label.length * 4.4 - 8}
        y={y - 11}
        width={label.length * 8.8 + 16}
        height={22}
        fill="#13315c"
        stroke="none"
      />
      <text
        x={mid}
        y={y + 5}
        textAnchor="middle"
        fontSize={13}
        fill={CHALK}
        stroke="none"
        style={{ fontFamily: DISPLAY, fontStretch: "100%" }}
      >
        {label}
      </text>
    </g>
  );
}
