"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { principles } from "@/content/studio";

const STATEMENT =
  "Most websites are assembled from parts. We draw ours first, engineer every joint, then finish them by hand.";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Each word starts as an outline and inks in as it reaches the reading line.
        gsap.fromTo(
          ".w",
          { color: "rgba(212, 230, 245, 0)" },
          {
            color: "rgba(244, 248, 252, 1)",
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: ".manifesto-text", start: "top 78%", end: "bottom 42%", scrub: 0.6 },
          },
        );
        gsap.from(".principle", {
          y: 28,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          scrollTrigger: { trigger: ".principles", start: "top 85%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="section surface-prussian blueprint-grid"
      aria-labelledby="manifesto-title"
    >
      <div className="frame">
        <div className="grid-12 gap-y-10">
          <h2 id="manifesto-title" className="sr-only">
            How we work
          </h2>
          <p className="col-span-4 font-[family-name:var(--font-serif)] text-[1.05rem] italic leading-relaxed text-[color:rgb(212_230_245/0.82)] md:col-span-3 md:pt-3">
            The difference is hard to name and easy to feel: pages that load before you notice, motion
            that explains itself, interfaces that work the first time.
          </p>
          <p className="manifesto-text col-span-4 md:col-span-9">
            {STATEMENT.split(" ").map((word, i) => (
              <span key={i}>
                <span className="w">{word}</span>{" "}
              </span>
            ))}
          </p>
        </div>

        <ul className="principles grid-12 mt-[clamp(4rem,9vw,8rem)] gap-y-10">
          {principles.map((p, i) => (
            <li
              key={p.title}
              className={`principle col-span-4 border-t border-[color:rgb(212_230_245/0.3)] pt-5 md:col-span-3 ${
                i === 0 ? "md:col-start-4" : ""
              }`}
            >
              <h3 className="h-sm text-white">{p.title}</h3>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-[color:rgb(212_230_245/0.85)]">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
