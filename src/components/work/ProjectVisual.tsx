"use client";

import { useRef, useState } from "react";
import type { SceneKey } from "@/content/projects";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Scene } from "./scenes";

type Mode =
  /** Scroll drives a split line from wireframe to finished build. */
  | "scrub"
  /** Hovering or focusing the parent link reveals the wireframe. A button does the same on touch. */
  | "hover"
  /** Finished build only, with a button to compare. */
  | "toggle";

type Props = {
  scene: SceneKey;
  name: string;
  mode?: Mode;
  className?: string;
  /** Aspect ratio as width / height. */
  ratio?: string;
  parallax?: boolean;
  /** Start on the drawing instead of the build (toggle mode). */
  initialWire?: boolean;
};

export function ProjectVisual({
  scene,
  name,
  mode = "hover",
  className = "",
  ratio = "16 / 10",
  parallax = false,
  initialWire = false,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [wire, setWire] = useState(initialWire);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (mode === "scrub") {
          el.dataset.scrub = "true";
          gsap.fromTo(
            el,
            { "--split": "100%" },
            {
              "--split": "0%",
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 80%",
                end: "bottom 65%",
                scrub: 0.4,
              },
            },
          );
        }
        if (parallax) {
          gsap.fromTo(
            el.querySelectorAll(".pv-inner"),
            { scale: 1.035 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [mode, parallax] },
  );

  return (
    <div className={`relative ${className}`}>
      <div
        ref={root}
        className="pv"
        style={{ aspectRatio: ratio }}
        data-wire={wire ? "true" : "false"}
        role="img"
        aria-label={`${name}: interface composition${wire ? ", shown as its wireframe" : ""}`}
      >
        <div className="pv-layer pv-wire blueprint-grid">
          <div className="pv-inner">
            <Scene scene={scene} wire />
          </div>
        </div>
        <div className="pv-layer pv-finished">
          <div className="pv-inner">
            <Scene scene={scene} wire={false} />
          </div>
        </div>
        {mode === "scrub" && (
          <div className="pv-splitline" aria-hidden="true">
            <span className="label absolute right-2 top-3 whitespace-nowrap bg-[color:var(--color-prussian-2)] px-2 py-1 text-[color:var(--color-chalk)]">
              Drawing
            </span>
            <span className="label absolute left-2 top-3 whitespace-nowrap bg-[color:var(--color-ink)] px-2 py-1 text-[color:var(--color-vellum)]">
              Build
            </span>
          </div>
        )}
      </div>
      {mode !== "scrub" && (
        <button
          type="button"
          aria-pressed={wire}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWire((v) => !v);
          }}
          className={`label absolute bottom-3 right-3 z-10 inline-flex min-h-10 items-center gap-2 bg-[color:var(--color-vellum)] px-3 py-2 text-[color:var(--color-ink)] shadow-[0_1px_0_rgb(21_21_21/0.15)] ${
            mode === "hover" ? "pointer-fine:hidden" : ""
          }`}
        >
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 border border-current"
            style={{
              background: wire ? "var(--color-prussian)" : "transparent",
            }}
          />
          {wire ? "Show the build" : "Show the drawing"}
        </button>
      )}
    </div>
  );
}
