"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/content/studio";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import {
  ProcessDrawing,
  buildProcessTimeline,
  stageAt,
  weekAt,
} from "./ProcessDrawing";

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Reports when an element comes within a screen of the viewport. The drawings
 * are hundreds of SVG nodes each and sit far below the fold, so they are only
 * mounted when they're about to be seen and cost nothing at page load.
 */
function useNearViewport<T extends Element>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, near] as const;
}

/** Phone layout: each step carries its own small drawing that plays its stage once. */
function StepDrawing({ stage }: { stage: number }) {
  const [boxRef, near] = useNearViewport<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!near || !svg) return;
    const { tl, alive } = buildProcessTimeline(svg);
    const from = stage === 0 ? 0 : stage - 0.5;
    const to = stage + 0.5;
    if (reducedMotion()) {
      tl.time(to);
      return () => {
        tl.kill();
        alive.kill();
      };
    }
    tl.time(from);
    let played = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.isIntersecting && !played) {
          played = true;
          tl.tweenFromTo(from, to, {
            duration: 1.8,
            ease: "none",
            onComplete: () => {
              if (stage === 4) alive.play();
            },
          });
        } else if (stage === 4 && played && tl.time() >= to - 0.01) {
          if (e.isIntersecting) alive.play();
          else alive.pause();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(svg);
    return () => {
      io.disconnect();
      tl.kill();
      alive.kill();
    };
  }, [near, stage]);

  return (
    <div
      ref={boxRef}
      className="mb-8 aspect-square w-full max-w-[22rem] lg:hidden"
      aria-hidden="true"
    >
      {near && <ProcessDrawing ref={svgRef} className="h-full w-full" />}
    </div>
  );
}

/** Desktop layout: one sticky drawing, scrubbed by the scroll through the steps. */
function StickyDrawing({
  listRef,
}: {
  listRef: React.RefObject<HTMLOListElement | null>;
}) {
  const [boxRef, near] = useNearViewport<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const weekRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const list = listRef.current;
    if (!near || !svg || !list) return;
    // Hidden below the desktop breakpoint; don't animate it there.
    if (!window.matchMedia("(min-width: 64rem)").matches) return;

    const { tl, alive } = buildProcessTimeline(svg);
    const caption = (t: number) => {
      if (weekRef.current)
        weekRef.current.textContent = `Week ${weekAt(t)}, ${processSteps[stageAt(t)]?.title ?? ""}`;
    };

    if (reducedMotion()) {
      // Jump between finished states as you read; no scrubbing, no loop.
      const show = (progress: number) => {
        const t = Math.min(4, Math.floor(progress * 5)) + 0.5;
        tl.time(t);
        caption(t);
      };
      const st = ScrollTrigger.create({
        trigger: list,
        start: "top center",
        end: "bottom center",
        onUpdate: (self) => show(self.progress),
      });
      // The drawing may mount mid-section (after a jump link), so start from where we are.
      show(st.progress);
      return () => {
        st.kill();
        tl.kill();
        alive.kill();
      };
    }

    let inView = false;
    const syncAlive = () => {
      if (inView && tl.time() >= 4.35) alive.play();
      else alive.pause();
    };
    tl.eventCallback("onUpdate", () => {
      caption(tl.time());
      syncAlive();
    });
    const scrub = gsap.to(tl, {
      time: 5,
      ease: "none",
      scrollTrigger: {
        trigger: list,
        start: "top center",
        end: "bottom center",
        scrub: 0.6,
      },
    });
    const viewport = ScrollTrigger.create({
      trigger: svg,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        inView = self.isActive;
        syncAlive();
      },
    });
    caption(tl.time());
    return () => {
      scrub.scrollTrigger?.kill();
      scrub.kill();
      viewport.kill();
      tl.kill();
      alive.kill();
    };
  }, [near, listRef]);

  return (
    <div className="sticky top-[calc(50vh-17rem)]">
      <div
        ref={boxRef}
        className="aspect-square w-full max-w-[34rem]"
        aria-hidden="true"
      >
        {near && <ProcessDrawing ref={svgRef} className="h-full w-full" />}
      </div>
      <p
        className="label mt-4 flex flex-wrap items-baseline gap-x-4 text-[color:var(--color-chalk)]"
        aria-hidden="true"
      >
        <span
          ref={weekRef}
          className="font-[family-name:var(--font-display)] text-[1.1rem] font-bold tnum"
        >
          Week 1, Discover
        </span>
        <span className="label-muted">of a typical 14-week project</span>
      </p>
    </div>
  );
}

export function Process() {
  const [stage, setStage] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Which step is being read: drives the dimming and the rail markers.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting)
            setStage(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // The rail fills as you read, in every mode: it reports position, it isn't decoration.
  useGSAP(
    () => {
      const list = listRef.current;
      const rail = railRef.current;
      if (!list || !rail) return;
      gsap.fromTo(
        rail,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: list,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="section surface-prussian blueprint-grid"
      aria-labelledby="process-title"
    >
      <div className="frame">
        <div className="grid-12 gap-y-6">
          <h2
            id="process-title"
            className="h-xl col-span-4 text-white md:col-span-8"
          >
            From rough idea
            <br />
            to live site
          </h2>
          <p className="col-span-4 text-[1.05rem] leading-relaxed text-[color:rgb(212_230_245/0.85)] md:col-span-4 md:self-end">
            Five stages, one team the whole way through. You see the work take
            shape every week, not just at the end.
          </p>
        </div>

        <div className="grid-12 mt-[clamp(3rem,8vw,7rem)]">
          <div className="col-span-6 hidden lg:block">
            <StickyDrawing listRef={listRef} />
          </div>

          <ol
            ref={listRef}
            className="relative col-span-4 pl-8 md:col-span-12 lg:col-span-5 lg:col-start-8 lg:pl-0"
          >
            {/* Timeline rail: track, and the part you've read. */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-[0.4rem] top-0 w-px bg-[color:rgb(212_230_245/0.25)] lg:-left-[2.1rem]"
            />
            <span
              ref={railRef}
              aria-hidden="true"
              className="absolute bottom-0 left-[calc(0.4rem-0.5px)] top-0 w-[2px] origin-top bg-[color:var(--color-chalk)] lg:-left-[calc(2.1rem+0.5px)]"
            />
            {processSteps.map((step, i) => (
              <li
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-step={i}
                data-active={stage === i ? "true" : "false"}
                className="proc-step flex flex-col justify-center border-t border-[color:rgb(212_230_245/0.25)] py-10 lg:min-h-[68vh] lg:py-16"
              >
                <StepDrawing stage={i} />
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="proc-marker"
                    data-state={
                      stage === i ? "active" : stage > i ? "done" : "todo"
                    }
                  />
                  <p
                    className="proc-dim font-[family-name:var(--font-display)] text-[clamp(3rem,6vw,5.5rem)] font-extrabold leading-none tracking-[-0.04em] text-[color:var(--color-line)] tnum"
                    style={{ fontStretch: "120%" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                </div>
                <h3 className="proc-dim h-lg mt-4 text-white">{step.title}</h3>
                <p className="mt-5 max-w-[32rem] text-[1.05rem] leading-relaxed text-[color:rgb(212_230_245/0.88)]">
                  {step.body}
                </p>
                <ul className="label mt-6 space-y-2 text-[0.95rem] text-[color:var(--color-chalk)]">
                  {step.outputs.map((o) => (
                    <li key={o} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.55em] inline-block h-px w-4 shrink-0 bg-current"
                      />
                      {o}
                    </li>
                  ))}
                </ul>
                <p className="label label-muted mt-6">
                  {step.typical === "Ongoing"
                    ? "Ongoing, for as long as it helps"
                    : `Typically ${step.typical}`}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
