"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { CopyEmail } from "@/components/ui/CopyEmail";

function Lines() {
  return (
    <>
      <span className="block">Have something</span>
      <span className="block pl-[0.9em]">ambitious</span>
      <span className="block">in mind?</span>
    </>
  );
}

/**
 * The bookend to the hero. The headline waits as a drawing; the closer you get to
 * "Start a project", the more of it is inked in. Reach the button and it's finished.
 */
export function ClosingCta() {
  const stageRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const fill = fillRef.current;
    const btn = btnRef.current;
    if (!stage || !fill || !btn) return;
    let locked = false;
    const set = (pct: number) => fill.style.setProperty("--fill", `${pct}%`);
    const finish = () => {
      locked = true;
      set(100);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced) {
      finish();
      return;
    }

    if (!fine) {
      const io = new IntersectionObserver(
        ([e]) => {
          if (e?.isIntersecting) {
            finish();
            io.disconnect();
          }
        },
        { threshold: 0.55 },
      );
      io.observe(stage);
      return () => io.disconnect();
    }

    let best = 0;
    const onMove = (e: PointerEvent) => {
      if (locked) return;
      const r = btn.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const pct = Math.max(0, Math.min(1, (900 - d) / 820)) * 100;
      best = Math.max(best * 0.98, pct);
      set(best);
    };
    const onReach = () => finish();
    stage.addEventListener("pointermove", onMove, { passive: true });
    btn.addEventListener("pointerenter", onReach);
    btn.addEventListener("focusin", onReach);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      btn.removeEventListener("pointerenter", onReach);
      btn.removeEventListener("focusin", onReach);
    };
  }, []);

  return (
    <section ref={stageRef} className="section surface-vellum overflow-hidden" aria-labelledby="cta-title">
      <div className="frame">
        <p className="max-w-[24rem] font-[family-name:var(--font-serif)] text-[1.15rem] italic leading-snug text-[color:var(--color-graphite)]">
          Every project starts as a rough drawing. Bring yours, however rough.
        </p>
        <h2 id="cta-title" className="cta-title display mt-8">
          <span className="cta-outline block">
            <Lines />
          </span>
          <span ref={fillRef} className="cta-fill" aria-hidden="true">
            <Lines />
          </span>
        </h2>

        <div className="mt-[clamp(3rem,7vw,5.5rem)] grid-12 items-end gap-y-10">
          <div className="col-span-4 md:col-span-5">
            <span ref={btnRef} className="inline-block">
              <Magnetic>
                <Link href="/contact#brief" className="btn btn-lg">
                  Start a project
                </Link>
              </Magnetic>
            </span>
          </div>
          <div className="col-span-4 md:col-span-4 md:col-start-6">
            <a
              href={`mailto:${site.email}`}
              className="link-draw font-[family-name:var(--font-display)] text-[clamp(1.25rem,2.1vw,1.9rem)] font-semibold tracking-[-0.015em]"
            >
              {site.email}
            </a>
            <div className="mt-2">
              <CopyEmail email={site.email} />
            </div>
          </div>
          <p className="label col-span-4 text-[0.9rem] md:col-span-3 md:col-start-10">{site.replyPromise}</p>
        </div>
      </div>
    </section>
  );
}
