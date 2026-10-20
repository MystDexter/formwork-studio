import Link from "next/link";
import { studioNotes } from "@/content/studio";

const tilts = ["-2.2deg", "1.6deg", "-0.8deg", "2.4deg", "-1.4deg", "1deg"];
const offsets = ["md:mt-0", "md:mt-16", "md:mt-6", "md:-mt-4", "md:mt-12", "md:mt-2"];

/** The human part: looser, warmer, pinned to the wall rather than set in a grid. */
export function Studio() {
  return (
    <section className="section surface-vellum overflow-hidden" aria-labelledby="studio-title">
      <div className="frame">
        <div className="grid-12 gap-y-10">
          <h2 id="studio-title" className="col-span-4 font-[family-name:var(--font-serif)] text-[clamp(2.1rem,4.8vw,5rem)] font-[360] leading-[1.04] tracking-[-0.02em] md:col-span-8">
            We&apos;re the people who notice when a button is two pixels off, and fix it before anyone
            asks.
          </h2>
          <div className="col-span-4 md:col-span-3 md:col-start-10 md:self-end">
            <p className="text-[1.05rem] leading-relaxed">
              A small studio of designers and engineers who work in the same room, on the same files,
              from first call to launch. These are the rules pinned above our desks.
            </p>
            <Link href="/about" className="label link-draw mt-5 inline-block text-base">
              Meet the studio
            </Link>
          </div>
        </div>

        <ul className="mt-[clamp(3.5rem,8vw,7rem)] grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-10">
          {studioNotes.map((note, i) => (
            <li
              key={note}
              className={`note-card ${offsets[i]} max-w-[26rem]`}
              style={{ "--r": tilts[i] } as React.CSSProperties}
            >
              <p className="font-[family-name:var(--font-serif)] text-[1.2rem] leading-snug">{note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
