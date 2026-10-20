import type { SceneKey } from "@/content/projects";
import { mulberry32 } from "@/lib/rng";
import {
  Annot,
  Box,
  CHALK,
  CHALK_DIM,
  CHALK_FAINT,
  Dim,
  DISPLAY,
  Shape,
  Txt,
} from "./parts";

type SceneProps = { wire: boolean };

/* ---------------------------------------------------------------- Neap */

const NEAP = { ground: "#0f2a2e", ink: "#e9f1ec", accent: "#f5c542" };
const tideY = (x: number) =>
  640 - 150 * Math.sin((x / 1600) * 2 * Math.PI * 1.932 + 0.593);
const tidePoints = Array.from({ length: 81 }, (_, i) => {
  const x = i * 20;
  return `${x},${tideY(x).toFixed(1)}`;
});
const tideLine = `M${tidePoints.join("L")}`;
const tideArea = `${tideLine}L1600,900L0,900Z`;

function Neap({ wire }: SceneProps) {
  const c = NEAP;
  const nowX = 872;
  const nowY = tideY(nowX);
  return (
    <>
      {!wire && <rect width="1600" height="1000" fill={c.ground} />}
      <Box
        wire={wire}
        x={778}
        y={430}
        w={293}
        h={470}
        fill={c.accent}
        opacity={0.13}
        dashed
      />
      <Shape wire={wire} d={tideArea} fill={c.ink} opacity={0.07} />
      <path
        d={tideLine}
        fill="none"
        stroke={wire ? CHALK : c.accent}
        strokeWidth={wire ? 1.5 : 5}
      />
      <path
        d="M0 900H1600"
        stroke={wire ? CHALK : c.ink}
        strokeOpacity={0.4}
        strokeWidth={1.5}
      />
      {["00", "03", "06", "09", "12", "15", "18", "21"].map((t, i) => (
        <g key={t}>
          <path
            d={`M${i * 200} 900v14`}
            stroke={wire ? CHALK : c.ink}
            strokeOpacity={0.4}
          />
          <Txt
            wire={wire}
            x={i * 200 + 8}
            y={945}
            size={20}
            fill={c.ink}
            opacity={0.55}
          >
            {t}
          </Txt>
        </g>
      ))}

      <path
        d={`M${nowX} ${nowY}V900`}
        stroke={wire ? CHALK : c.ink}
        strokeOpacity={0.5}
        strokeDasharray="4 6"
      />
      <circle
        cx={nowX}
        cy={nowY}
        r={12}
        fill={wire ? "none" : c.accent}
        stroke={wire ? CHALK : c.ground}
        strokeWidth={wire ? 1.2 : 4}
      />
      <Box
        wire={wire}
        x={nowX + 26}
        y={nowY - 92}
        w={300}
        h={56}
        fill={c.ink}
      />
      <Txt
        wire={wire}
        x={nowX + 44}
        y={nowY - 56}
        size={22}
        weight={600}
        fill={c.ground}
      >
        Now 13:05, 3.1 m rising
      </Txt>

      <Txt
        wire={wire}
        x={80}
        y={110}
        size={36}
        weight={800}
        stretch={120}
        fill={c.ink}
      >
        Neap
      </Txt>
      <Txt
        wire={wire}
        x={1520}
        y={108}
        size={22}
        anchor="end"
        fill={c.ink}
        opacity={0.7}
      >
        Falmouth harbour, Thursday
      </Txt>
      <Txt
        wire={wire}
        x={1520}
        y={142}
        size={22}
        anchor="end"
        fill={c.ink}
        opacity={0.7}
      >
        Wind south-west, 12 knots
      </Txt>

      <Txt
        wire={wire}
        x={72}
        y={370}
        size={240}
        weight={800}
        stretch={110}
        tracking={-8}
        fill={c.ink}
      >
        3.4
      </Txt>
      <Txt wire={wire} x={455} y={370} size={92} weight={700} fill={c.accent}>
        m
      </Txt>
      <Txt wire={wire} x={84} y={422} size={30} fill={c.ink} opacity={0.75}>
        High water at 14:22
      </Txt>

      <Txt wire={wire} x={1100} y={245} size={22} fill={c.ink} opacity={0.6}>
        Safe to leave
      </Txt>
      <Txt
        wire={wire}
        x={1100}
        y={312}
        size={58}
        weight={700}
        stretch={104}
        fill={c.ink}
      >
        11:40 to 16:05
      </Txt>
      <Txt wire={wire} x={1100} y={356} size={22} fill={c.ink} opacity={0.6}>
        Bar clears your 1.2 m draught
      </Txt>

      {wire && (
        <>
          <Dim x1={778} x2={1071} y={410} label="4 h 25 min" />
          <Annot x={300} y={tideY(300)} tx={120} ty={560}>
            Tide curve on canvas, 60 fps scrub
          </Annot>
          <Annot x={330} y={250} tx={600} ty={200}>
            Display numeral, 240 px
          </Annot>
          <Annot x={1000} y={760} tx={1180} ty={820}>
            Window from draught and bar depth
          </Annot>
        </>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- Umber & Slip */

const UMBER = {
  ground: "#efe4d6",
  ink: "#2b1d16",
  accent: "#a4532c",
  ash: "#d9a27a",
  interior: "#5e2e18",
};

function Umber({ wire }: SceneProps) {
  const c = UMBER;
  return (
    <>
      {!wire && <rect width="1600" height="1000" fill={c.ground} />}
      <Box wire={wire} x={0} y={0} w={820} h={1000} fill="#e3d3c0" />
      <Box wire={wire} x={210} y={640} w={400} h={360} fill="#d6c3ad" />
      {!wire && <rect x={210} y={640} width={400} height={22} fill="#ddccb7" />}
      {!wire && (
        <ellipse
          cx={410}
          cy={642}
          rx={160}
          ry={11}
          fill={c.ink}
          opacity={0.22}
        />
      )}
      <Shape
        wire={wire}
        d="M190 470C200 585 300 640 330 640L490 640C520 640 620 585 630 470Z"
        fill={c.accent}
      />
      <Shape
        wire={wire}
        d="M190 470C192 500 196 522 205 540Q225 520 245 548Q270 520 290 556Q320 526 350 562Q380 528 410 564Q440 530 470 560Q500 524 530 554Q560 522 590 546Q610 526 618 536C625 515 628 495 630 470Z"
        fill={c.ash}
      />
      {wire ? (
        <>
          <ellipse
            cx={410}
            cy={470}
            rx={220}
            ry={42}
            fill="none"
            stroke={CHALK}
            strokeWidth={1.2}
          />
          <ellipse
            cx={410}
            cy={474}
            rx={196}
            ry={32}
            fill="none"
            stroke={CHALK_DIM}
            strokeWidth={1}
          />
        </>
      ) : (
        <>
          <ellipse cx={410} cy={470} rx={220} ry={42} fill="#c98a5f" />
          <ellipse cx={410} cy={475} rx={196} ry={32} fill={c.interior} />
          <path
            d="M240 462Q300 450 340 452"
            stroke="#f3dcc6"
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.6}
            fill="none"
          />
        </>
      )}

      {["Daylight", "Warm", "Raking"].map((l, i) => (
        <g key={l}>
          <Box
            wire={wire}
            x={60 + i * 150}
            y={880}
            w={136}
            h={52}
            fill={i === 0 ? c.ink : "none"}
            stroke={i === 0 ? undefined : c.ink}
          />
          <Txt
            wire={wire}
            x={128 + i * 150}
            y={914}
            size={20}
            weight={600}
            anchor="middle"
            fill={i === 0 ? c.ground : c.ink}
          >
            {l}
          </Txt>
        </g>
      ))}

      <Txt
        wire={wire}
        x={900}
        y={104}
        size={36}
        family="serif"
        italic
        fill={c.ink}
      >
        Umber & Slip
      </Txt>
      <Txt wire={wire} x={1540} y={100} size={22} anchor="end" fill={c.ink}>
        Bag (1)
      </Txt>
      <Txt wire={wire} x={900} y={300} size={22} fill={c.ink} opacity={0.6}>
        Bowls, one of one
      </Txt>
      <Txt
        wire={wire}
        x={896}
        y={418}
        size={118}
        family="serif"
        weight={400}
        tracking={-3}
        fill={c.ink}
      >
        Tidal bowl
      </Txt>
      <Txt
        wire={wire}
        x={900}
        y={486}
        size={28}
        family="serif"
        fill={c.ink}
        opacity={0.85}
      >
        Ash glaze over iron slip, thrown in
      </Txt>
      <Txt
        wire={wire}
        x={900}
        y={524}
        size={28}
        family="serif"
        fill={c.ink}
        opacity={0.85}
      >
        the studio in March. One of one.
      </Txt>
      <Txt wire={wire} x={900} y={630} size={52} weight={600} fill={c.ink}>
        64.00
      </Txt>
      <Box wire={wire} x={900} y={680} w={640} h={88} fill={c.ink} />
      <Txt
        wire={wire}
        x={1220}
        y={734}
        size={28}
        weight={600}
        anchor="middle"
        fill={c.ground}
      >
        Add to bag
      </Txt>
      <Txt wire={wire} x={900} y={820} size={20} fill={c.ink} opacity={0.65}>
        Held for you for ten minutes once added
      </Txt>

      {wire && (
        <>
          <Annot x={410} y={520} tx={60} ty={120}>
            Glaze study viewer, three light states
          </Annot>
          <Annot x={1220} y={768} tx={1540} ty={900} anchor="end">
            Ten-minute hold, enforced server-side
          </Annot>
          <Dim
            x1={900}
            x2={1540}
            y={652}
            label="640 px, full width on mobile"
          />
        </>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- The Halden Plates */

const HALDEN = { ground: "#07090f", ink: "#e8e6df", accent: "#ff8a3d" };
/**
 * The star field is drawn as a handful of paths (zero-length segments with round caps),
 * bucketed by size and brightness, instead of hundreds of circles. Same picture, a fraction
 * of the DOM to hydrate.
 */
type StarBucket = { width: number; opacity: number; d: string };
function starPaths(
  count: number,
  area: [number, number, number, number],
  seed: number,
  sizes: number[],
  opacities: number[],
) {
  const r = mulberry32(seed);
  const buckets = new Map<string, StarBucket>();
  for (let i = 0; i < count; i++) {
    const x = area[0] + r() * area[2];
    const y = area[1] + r() * area[3];
    const si = Math.min(
      sizes.length - 1,
      Math.floor(Math.pow(r(), 2.4) * sizes.length),
    );
    const oi = Math.floor(r() * opacities.length);
    const key = `${si}-${oi}`;
    const b = buckets.get(key) ?? {
      width: sizes[si]!,
      opacity: opacities[oi]!,
      d: "",
    };
    b.d += `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
    buckets.set(key, b);
  }
  return [...buckets.values()];
}
const stars = {
  inside: starPaths(
    540,
    [130, 120, 840, 760],
    7,
    [1.4, 2.2, 3.4, 5.6],
    [0.45, 0.7, 1],
  ),
  outside: starPaths(120, [0, 0, 1600, 1000], 11, [1, 1.6], [0.18, 0.3]),
};

function Halden({ wire }: SceneProps) {
  const c = HALDEN;
  const yearX = (y: number) => 120 + ((y - 1890) / 70) * 1400;
  return (
    <>
      {!wire && <rect width="1600" height="1000" fill={c.ground} />}
      {!wire &&
        stars.outside.map((b, i) => (
          <path
            key={`o${i}`}
            d={b.d}
            stroke={c.ink}
            strokeWidth={b.width}
            strokeOpacity={b.opacity}
            strokeLinecap="round"
          />
        ))}
      <Box
        wire={wire}
        x={120}
        y={110}
        w={860}
        h={780}
        fill="#0c111c"
        stroke="#2a3142"
      />
      {wire ? (
        <g stroke={CHALK_FAINT} strokeWidth={1}>
          {Array.from({ length: 7 }, (_, i) => (
            <path key={`v${i}`} d={`M${120 + (i + 1) * 107.5} 110V890`} />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <path key={`h${i}`} d={`M120 ${110 + (i + 1) * 111.4}H980`} />
          ))}
        </g>
      ) : (
        stars.inside.map((b, i) => (
          <path
            key={i}
            d={b.d}
            stroke={c.ink}
            strokeWidth={b.width}
            strokeOpacity={b.opacity}
            strokeLinecap="round"
          />
        ))
      )}
      <circle
        cx={640}
        cy={380}
        r={46}
        fill="none"
        stroke={wire ? CHALK : c.accent}
        strokeWidth={wire ? 1.2 : 2.5}
      />
      <circle
        cx={644}
        cy={377}
        r={56}
        fill="none"
        stroke={wire ? CHALK : c.accent}
        strokeWidth={wire ? 1.2 : 2}
        opacity={0.85}
      />
      {!wire && <circle cx={640} cy={380} r={3.2} fill={c.ink} />}
      <g transform="rotate(-7 760 300)">
        <Txt
          wire={wire}
          x={712}
          y={318}
          size={34}
          family="serif"
          italic
          fill={c.accent}
        >
          var.? 14.x.11
        </Txt>
      </g>
      <Txt wire={wire} x={140} y={872} size={18} fill={c.ink} opacity={0.6}>
        H-2291, glass, 8 x 10 in
      </Txt>

      <Txt
        wire={wire}
        x={1060}
        y={150}
        size={26}
        weight={700}
        stretch={110}
        fill={c.ink}
      >
        The Halden Plates
      </Txt>
      <Txt
        wire={wire}
        x={1056}
        y={300}
        size={70}
        weight={700}
        stretch={108}
        tracking={-2}
        fill={c.ink}
      >
        Plate H-2291
      </Txt>
      <Txt
        wire={wire}
        x={1060}
        y={354}
        size={26}
        family="serif"
        fill={c.ink}
        opacity={0.85}
      >
        Exposed 14 October 1911
      </Txt>
      <Txt
        wire={wire}
        x={1060}
        y={390}
        size={26}
        family="serif"
        fill={c.ink}
        opacity={0.85}
      >
        42 minutes, astrograph no. 2
      </Txt>
      <Txt
        wire={wire}
        x={1060}
        y={470}
        size={26}
        family="serif"
        italic
        fill={c.ink}
        opacity={0.7}
      >
        A variable star, circled twice
      </Txt>
      <Txt
        wire={wire}
        x={1060}
        y={506}
        size={26}
        family="serif"
        italic
        fill={c.ink}
        opacity={0.7}
      >
        in the observer&apos;s hand.
      </Txt>
      <Box
        wire={wire}
        x={1060}
        y={560}
        w={280}
        h={72}
        fill="none"
        stroke={c.ink}
      />
      <Txt
        wire={wire}
        x={1200}
        y={604}
        size={24}
        weight={600}
        anchor="middle"
        fill={c.ink}
      >
        Open plate
      </Txt>

      <path
        d="M120 940H1520"
        stroke={wire ? CHALK : c.ink}
        strokeOpacity={0.45}
      />
      {[1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960].map((y) => (
        <g key={y}>
          <path
            d={`M${yearX(y)} 932V948`}
            stroke={wire ? CHALK : c.ink}
            strokeOpacity={0.45}
          />
          <Txt
            wire={wire}
            x={yearX(y)}
            y={978}
            size={18}
            anchor="middle"
            fill={c.ink}
            opacity={0.55}
          >
            {String(y)}
          </Txt>
        </g>
      ))}
      <path
        d={`M${yearX(1911)} 910V940`}
        stroke={wire ? CHALK : c.accent}
        strokeWidth={2}
      />
      <circle
        cx={yearX(1911)}
        cy={940}
        r={10}
        fill={wire ? "none" : c.accent}
        stroke={wire ? CHALK : "none"}
      />

      {wire && (
        <>
          <Annot x={430} y={330} tx={160} ty={60}>
            IIIF tiles streamed into WebGL
          </Annot>
          <Annot x={690} y={400} tx={1060} ty={720}>
            Transcribed note, real text in the page
          </Annot>
          <Annot x={yearX(1911)} y={940} tx={1060} ty={850}>
            Decade scrubber, keyboard operable
          </Annot>
        </>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- Corbel */

const CORBEL = {
  ground: "#f4f4f0",
  ink: "#1b1d1c",
  accent: "#1f6b4f",
  over: "#c8432a",
  track: "#e2e2dc",
};

function Corbel({ wire }: SceneProps) {
  const c = CORBEL;
  const stages = [
    { name: "Concept", earned: 170, spent: 140 },
    { name: "Planning", earned: 250, spent: 228 },
    { name: "Technical", earned: 270, spent: 318 },
    { name: "Construction", earned: 210, spent: 64 },
  ];
  const rows = [
    { name: "Riverside Library", pct: 0.82, risk: true },
    { name: "Harbour Flats", pct: 0.41, risk: false },
    { name: "Mill Lane School", pct: 0.67, risk: true },
    { name: "Orchard House", pct: 0.24, risk: false },
  ];
  return (
    <>
      {!wire && <rect width="1600" height="1000" fill={c.ground} />}
      <Box wire={wire} x={0} y={0} w={280} h={1000} fill="#e8e8e2" />
      <Txt
        wire={wire}
        x={48}
        y={100}
        size={34}
        weight={800}
        stretch={118}
        fill={c.ink}
      >
        Corbel
      </Txt>
      <Box
        wire={wire}
        x={32}
        y={176}
        w={216}
        h={44}
        fill={c.accent}
        opacity={0.12}
      />
      {["Overview", "Projects", "Timesheets", "Reports", "Settings"].map(
        (n, i) => (
          <Txt
            key={n}
            wire={wire}
            x={52}
            y={206 + i * 56}
            size={22}
            weight={i === 0 ? 650 : 450}
            fill={c.ink}
            opacity={i === 0 ? 1 : 0.7}
          >
            {n}
          </Txt>
        ),
      )}

      <Txt wire={wire} x={340} y={104} size={22} fill={c.ink} opacity={0.6}>
        Monday studio meeting
      </Txt>
      <Txt
        wire={wire}
        x={336}
        y={170}
        size={54}
        weight={700}
        stretch={104}
        tracking={-1}
        fill={c.ink}
      >
        2 projects need attention
      </Txt>
      <Txt
        wire={wire}
        x={1540}
        y={104}
        size={22}
        anchor="end"
        fill={c.ink}
        opacity={0.6}
      >
        Fee used, whole studio
      </Txt>
      <Txt
        wire={wire}
        x={1540}
        y={172}
        size={70}
        weight={800}
        anchor="end"
        stretch={110}
        fill={c.ink}
      >
        62%
      </Txt>

      <Box
        wire={wire}
        x={340}
        y={230}
        w={1200}
        h={420}
        fill="#fbfbf8"
        stroke="#e0e0da"
      />
      <Txt wire={wire} x={372} y={282} size={24} weight={620} fill={c.ink}>
        Riverside Library, fee by stage
      </Txt>
      {stages.map((s, i) => {
        const x = 400 + i * 285;
        const over = s.spent > s.earned;
        return (
          <g key={s.name}>
            {wire ? (
              <>
                <rect
                  x={x}
                  y={600 - s.earned}
                  width={90}
                  height={s.earned}
                  fill="none"
                  stroke={CHALK_DIM}
                  strokeDasharray="5 5"
                />
                <rect
                  x={x + 100}
                  y={600 - s.spent}
                  width={90}
                  height={s.spent}
                  fill="none"
                  stroke={CHALK}
                />
              </>
            ) : (
              <>
                <rect
                  x={x}
                  y={600 - s.earned}
                  width={90}
                  height={s.earned}
                  fill="none"
                  stroke={c.ink}
                  strokeWidth={2}
                  strokeOpacity={0.5}
                />
                <rect
                  x={x + 100}
                  y={600 - s.spent}
                  width={90}
                  height={s.spent}
                  fill={over ? c.over : c.accent}
                />
              </>
            )}
            <Txt wire={wire} x={x} y={632} size={20} fill={c.ink} opacity={0.7}>
              {s.name}
            </Txt>
            {over && (
              <Txt
                wire={wire}
                x={x + 100}
                y={600 - s.spent - 16}
                size={22}
                weight={650}
                fill={c.over}
              >
                18% over fee
              </Txt>
            )}
          </g>
        );
      })}
      <path
        d="M380 600H1510"
        stroke={wire ? CHALK : c.ink}
        strokeOpacity={0.3}
      />
      <path
        d="M445 470L1495 300"
        stroke={wire ? CHALK : c.ink}
        strokeOpacity={0.45}
        strokeDasharray="8 8"
        strokeWidth={2}
      />

      {rows.map((r, i) => {
        const y = 724 + i * 64;
        return (
          <g key={r.name}>
            <Txt
              wire={wire}
              x={340}
              y={y + 8}
              size={22}
              weight={560}
              fill={c.ink}
            >
              {r.name}
            </Txt>
            <Box wire={wire} x={720} y={y - 8} w={700} h={14} fill={c.track} />
            {!wire && (
              <rect
                x={720}
                y={y - 8}
                width={700 * r.pct}
                height={14}
                fill={r.risk ? c.over : c.accent}
              />
            )}
            <Txt
              wire={wire}
              x={1540}
              y={y + 8}
              size={22}
              weight={600}
              anchor="end"
              fill={r.risk ? c.over : c.ink}
            >
              {`${Math.round(r.pct * 100)}%`}
            </Txt>
          </g>
        );
      })}

      {wire && (
        <>
          <Annot x={1050} y={420} tx={1520} ty={268} anchor="end">
            Stage burn chart, SVG from design tokens
          </Annot>
          <Annot x={1250} y={340} tx={1100} ty={56}>
            Forecast to completion
          </Annot>
          <Annot x={720} y={916} tx={300} ty={970}>
            Shared component, used on 30 screens
          </Annot>
        </>
      )}
    </>
  );
}

const SCENES: Record<SceneKey, (p: SceneProps) => React.ReactElement> = {
  neap: Neap,
  umber: Umber,
  halden: Halden,
  corbel: Corbel,
};

export function Scene({ scene, wire }: { scene: SceneKey; wire: boolean }) {
  const S = SCENES[scene];
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <S wire={wire} />
    </svg>
  );
}

export { CHALK, DISPLAY };
