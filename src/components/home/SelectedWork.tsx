import Link from "next/link";
import { projects } from "@/content/projects";
import { ProjectVisual } from "@/components/work/ProjectVisual";
import { ProjectMeta } from "@/components/work/ProjectMeta";

/**
 * The exhibition. The first project is drawn into existence as you scroll;
 * the rest sit in an asymmetric hang and show their drawings when you look closer.
 */
export function SelectedWork() {
  const [featured, ...rest] = projects;
  if (!featured) return null;
  const layouts = [
    { visual: "md:col-span-8", meta: "md:col-span-4 md:col-start-9 md:self-end" },
    { visual: "md:col-span-7 md:col-start-6 md:row-start-1", meta: "md:col-span-4 md:col-start-1 md:row-start-1 md:self-start md:pt-10" },
    { visual: "md:col-span-9 md:col-start-2", meta: "md:col-span-5 md:col-start-7" },
  ];

  return (
    <section className="section surface-vellum" aria-labelledby="work-title">
      <div className="frame">
        <div className="grid-12 items-end gap-y-8">
          <h2 id="work-title" className="h-xl col-span-4 md:col-span-7">
            Selected
            <br />
            work
          </h2>
          <div className="col-span-4 md:col-span-4 md:col-start-9">
            <p className="text-[1.02rem] leading-relaxed">
              Self-initiated concept projects. Each one is a real design and engineering exercise,
              documented the way we document client work.
            </p>
            <Link href="/work" className="label link-draw mt-4 inline-block text-base">
              See every project
            </Link>
          </div>
        </div>
      </div>

      {/* Featured: full bleed, drawn by the scroll. */}
      <article className="relative mt-[clamp(3rem,7vw,6rem)]">
        <ProjectVisual scene={featured.scene} name={featured.name} mode="scrub" ratio="16 / 9" />
        <div className="frame mt-8">
          <div className="grid-12">
            <div className="col-span-4 md:col-span-8 md:col-start-5 lg:col-span-6 lg:col-start-7">
              <ProjectMeta project={featured} size="lg" />
            </div>
          </div>
        </div>
      </article>

      <div className="frame mt-[clamp(5rem,12vw,11rem)] space-y-[clamp(5rem,12vw,11rem)]">
        {rest.map((project, i) => {
          const l = layouts[i % layouts.length]!;
          return (
            <article key={project.slug} className="pv-hover grid-12 relative gap-y-8">
              <div className={`col-span-4 ${l.visual}`}>
                <ProjectVisual scene={project.scene} name={project.name} mode="hover" parallax />
              </div>
              <div className={`col-span-4 ${l.meta}`}>
                <ProjectMeta project={project} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
