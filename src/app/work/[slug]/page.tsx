import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentProject, getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { ProjectVisual } from "@/components/work/ProjectVisual";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.name}, ${project.category.toLowerCase()} concept`,
    description: project.summary,
    path: `/work/${project.slug}`,
  });
}

function SectionShell({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="border-t border-[color:rgb(21_21_21/0.18)] py-[clamp(3.5rem,8vw,7rem)]"
      aria-labelledby={id}
    >
      <div className="grid-12 gap-y-6">
        <h2 id={id} className="h-sm col-span-4 md:col-span-3">
          {title}
        </h2>
        <div className="col-span-4 md:col-span-9">{children}</div>
      </div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getAdjacentProject(project.slug);
  const { palette } = project;
  const hex = palette.ground.replace("#", "");
  const [r, g, b] = [0, 2, 4].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  ) as [number, number, number];
  const groundIsDark = 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.45;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    about: project.category,
    description: project.summary,
    creator: { "@type": "Organization", name: site.legalName, url: site.url },
    url: `${site.url}/work/${project.slug}`,
    keywords: project.services.join(", "),
    isFamilyFriendly: true,
  };

  return (
    <article>
      <header
        className="pt-[calc(var(--nav-h)+clamp(3rem,9vw,7rem))]"
        style={{ background: palette.ground, color: palette.ink }}
        data-nav-theme={groundIsDark ? "dark" : undefined}
      >
        <div className="frame">
          <p className="label flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/work" className="link-draw">
              Work
            </Link>
            <span aria-hidden="true">/</span>
            <span>{project.category}</span>
            <span style={{ opacity: 0.7 }}>{project.year}</span>
            {project.isConcept && (
              <span className="concept-tag">Concept project</span>
            )}
          </p>
          <h1
            className="display mt-8"
            style={{
              fontSize: "clamp(3.25rem, 13vw, 15rem)",
              color: palette.ink,
            }}
          >
            {project.name}
          </h1>
          <div className="grid-12 mt-10 gap-y-8 pb-[clamp(3rem,7vw,6rem)]">
            <p className="lede col-span-4 md:col-span-7">{project.summary}</p>
            <dl className="label col-span-4 grid grid-cols-2 gap-x-6 gap-y-5 text-[0.9rem] md:col-span-4 md:col-start-9">
              <div>
                <dt style={{ opacity: 0.7 }}>Services</dt>
                <dd className="mt-1.5 space-y-1">
                  {project.services.map((s) => (
                    <span key={s} className="block">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt style={{ opacity: 0.7 }}>Built with</dt>
                <dd className="mt-1.5 space-y-1">
                  {project.stack.map((s) => (
                    <span key={s} className="block">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <ProjectVisual
          scene={project.scene}
          name={project.name}
          mode="scrub"
          ratio="16 / 9"
        />
      </header>

      <div className="frame">
        {project.isConcept && (
          <aside
            className="mt-10 border border-dashed border-[color:rgb(21_21_21/0.4)] p-5 md:p-6"
            aria-label="About this project"
          >
            <p className="text-[1.02rem] leading-relaxed">
              <strong className="font-[family-name:var(--font-display)] font-semibold">
                This is a concept project.
              </strong>{" "}
              {project.name} is a self-initiated study, not client work. The
              organisation and data are fictional, and the outcomes below are
              the targets we set, not measured results.
            </p>
          </aside>
        )}

        <SectionShell id="challenge" title="The challenge">
          <p className="h-lg max-w-[22ch]">{project.challenge.lead}</p>
          <div className="mt-8 max-w-[38rem] space-y-5 text-[1.08rem] leading-relaxed">
            {project.challenge.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </SectionShell>

        <SectionShell id="approach" title="Our approach">
          <p className="h-lg max-w-[22ch]">{project.approach.lead}</p>
          <ul className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-3">
            {project.approach.points.map((pt) => (
              <li
                key={pt.title}
                className="border-t-2 border-[color:var(--color-ink)] pt-4"
              >
                <h3 className="h-sm">{pt.title}</h3>
                <p className="mt-3 text-[1.02rem] leading-relaxed">{pt.body}</p>
              </li>
            ))}
          </ul>
        </SectionShell>
      </div>

      <div className="frame">
        <ProjectVisual
          scene={project.scene}
          name={project.name}
          mode="toggle"
          initialWire
        />
        <p className="label mt-3 max-w-[40rem]">
          The drawing behind the build: layout, components and the engineering
          decisions annotated in red.
        </p>
      </div>

      <div className="frame">
        <SectionShell id="solution" title="The solution">
          <p className="h-lg max-w-[22ch]">{project.solution.lead}</p>
          <dl className="mt-10 divide-y divide-[color:rgb(21_21_21/0.15)] border-y border-[color:rgb(21_21_21/0.15)]">
            {project.solution.features.map((f) => (
              <div
                key={f.title}
                className="grid gap-3 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-8"
              >
                <dt className="h-sm">{f.title}</dt>
                <dd className="text-[1.04rem] leading-relaxed">{f.body}</dd>
              </div>
            ))}
          </dl>
        </SectionShell>

        <SectionShell id="outcome" title="The outcome">
          <p className="h-lg max-w-[22ch]">{project.outcome.lead}</p>
          <table className="mt-10 w-full border-collapse text-left">
            <caption className="sr-only">
              Launch targets for {project.name}
            </caption>
            <thead>
              <tr className="label label-muted">
                <th scope="col" className="pb-3 pr-6 font-medium">
                  Measure
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Target
                </th>
              </tr>
            </thead>
            <tbody>
              {project.outcome.targets.map((t) => (
                <tr
                  key={t.metric}
                  className="border-t border-[color:rgb(21_21_21/0.18)] align-top"
                >
                  <th
                    scope="row"
                    className="py-5 pr-6 text-[1.02rem] font-normal leading-snug"
                  >
                    {t.metric}
                  </th>
                  <td className="py-5 font-[family-name:var(--font-display)] text-[clamp(1.05rem,1.6vw,1.35rem)] font-semibold leading-snug">
                    {t.target}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-6 max-w-[38rem] font-[family-name:var(--font-serif)] italic text-[color:var(--color-graphite)]">
            {project.outcome.note}
          </p>
        </SectionShell>
      </div>

      <nav aria-label="Next project" className="surface-ink">
        <div className="frame pv-hover relative grid-12 items-center gap-y-8 py-[clamp(4rem,9vw,8rem)]">
          <div className="col-span-4 md:col-span-6">
            <p className="label text-[color:rgb(231_232_227/0.7)]">
              Next project
            </p>
            <p className="display mt-4 text-[clamp(2.75rem,8vw,8rem)]">
              <Link href={`/work/${next.slug}`} className="stretch">
                {next.name}
              </Link>
            </p>
            <p className="mt-4 max-w-[30rem] text-[1.02rem] leading-relaxed text-[color:rgb(231_232_227/0.82)]">
              {next.summary}
            </p>
          </div>
          <div className="col-span-4 md:col-span-6">
            <ProjectVisual scene={next.scene} name={next.name} mode="hover" />
          </div>
        </div>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
