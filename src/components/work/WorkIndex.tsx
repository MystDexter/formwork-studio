"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/content/projects";
import { ProjectVisual } from "./ProjectVisual";

/** An exhibition index: a list on one side, the selected piece hung on the other. */
export function WorkIndex({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(projects[0]?.slug ?? "");
  const current = projects.find((p) => p.slug === active) ?? projects[0];

  return (
    <div className="grid-12 gap-y-16">
      <ol className="col-span-4 md:col-span-12 lg:col-span-6">
        {projects.map((p, i) => (
          <li
            key={p.slug}
            className="relative border-t border-[color:rgb(21_21_21/0.18)] last:border-b"
            onMouseEnter={() => setActive(p.slug)}
            onFocus={() => setActive(p.slug)}
          >
            <div className="lg:hidden pt-6">
              <ProjectVisual scene={p.scene} name={p.name} mode="toggle" />
            </div>
            <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-4 py-6 lg:py-8">
              <span className="label label-muted tnum">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="h-lg">
                  <Link
                    href={`/work/${p.slug}`}
                    className="stretch transition-[font-stretch] duration-500 hover:[font-stretch:112%] focus-visible:[font-stretch:112%]"
                  >
                    {p.name}
                  </Link>
                </h2>
                <p className="label mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  <span>{p.category}</span>
                  <span className="label-muted">{p.services.join(", ")}</span>
                  {p.isConcept && (
                    <span className="concept-tag">Concept project</span>
                  )}
                </p>
                <p className="mt-3 max-w-[32rem] text-[1.02rem] leading-relaxed">
                  {p.summary}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="hidden lg:col-span-6 lg:block">
        {current && (
          <div className="sticky top-[calc(var(--nav-h)+2rem)]">
            <div className="pv-hover">
              <ProjectVisual
                key={current.slug}
                scene={current.scene}
                name={current.name}
                mode="hover"
              />
            </div>
            <p className="label mt-4">
              {current.name}. Hover the image to see the drawing underneath.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
