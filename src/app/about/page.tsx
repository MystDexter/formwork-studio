import type { Metadata } from "next";
import { site } from "@/content/site";
import { principles, studioNotes } from "@/content/studio";
import { PageHeader } from "@/components/ui/PageHeader";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Mark } from "@/components/ui/Wordmark";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About the studio",
  description:
    "Formwork is a small design and engineering studio. Why we're called Formwork, what we believe, and who you'll work with.",
  path: "/about",
});

const roles = [
  {
    role: "Design lead",
    body: "Owns the art direction and the experience, from the first wireframe to the last pixel. Writes CSS.",
  },
  {
    role: "Creative developer",
    body: "Turns designs into fast, accessible code, and pushes back when something will be slow on a real phone.",
  },
  {
    role: "Motion and interaction",
    body: "Prototypes anything that moves, early, in the browser, so you can feel it before you sign it off.",
  },
  {
    role: "Producer",
    body: "Your single point of contact. Keeps scope, budget and timeline honest, and tells you early when something changes.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        lines={["A studio", "that sweats", "the details."]}
        intro={
          <p>
            We started {site.name} because we kept seeing beautiful websites
            that were slow, and fast ones that were forgettable. We didn&apos;t
            think you should have to choose.
          </p>
        }
      />

      <section
        className="section surface-prussian blueprint-grid"
        aria-labelledby="name-title"
      >
        <div className="frame grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-5">
            <Mark className="h-16 w-16 text-[color:var(--color-chalk)]" />
            <h2 id="name-title" className="h-xl mt-8 text-white">
              Why
              <br />
              Formwork
            </h2>
          </div>
          <div className="col-span-4 space-y-6 text-[clamp(1.1rem,1.4vw,1.3rem)] leading-relaxed text-[color:rgb(212_230_245/0.9)] md:col-span-6 md:col-start-7 md:self-end">
            <p>
              On a building site, formwork is the temporary structure that
              concrete is poured into. Nobody sees it in the finished building,
              but it decides the shape of everything.
            </p>
            <p>
              That&apos;s how we think about our work. The architecture, the
              performance budgets, the accessibility, the content model: the
              parts you never see are what make the parts you do see feel
              effortless.
            </p>
            <p>
              Move your cursor over our home page and you&apos;ll see the
              drawing underneath. Every site we make has one.
            </p>
          </div>
        </div>
      </section>

      <section
        className="section surface-vellum"
        aria-labelledby="believe-title"
      >
        <div className="frame">
          <h2 id="believe-title" className="h-xl">
            What we
            <br />
            believe
          </h2>
          <ul className="mt-[clamp(3rem,7vw,6rem)] grid gap-x-[var(--gap)] gap-y-12 md:grid-cols-3">
            {principles.map((p) => (
              <li
                key={p.title}
                className="border-t-2 border-[color:var(--color-ink)] pt-5"
              >
                <h3 className="h-md">{p.title}</h3>
                <p className="mt-4 text-[1.05rem] leading-relaxed">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section surface-ink" aria-labelledby="team-title">
        <div className="frame grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-4">
            <h2 id="team-title" className="h-xl">
              Who you&apos;ll
              <br />
              work with
            </h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-[color:rgb(231_232_227/0.82)]">
              Every project has the same small senior team from first call to
              launch. No hand-offs to people you&apos;ve never met.
            </p>
          </div>
          <dl className="col-span-4 divide-y divide-[color:rgb(231_232_227/0.2)] border-y border-[color:rgb(231_232_227/0.2)] md:col-span-7 md:col-start-6">
            {roles.map((r) => (
              <div
                key={r.role}
                className="grid gap-3 py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-8"
              >
                <dt className="h-md">{r.role}</dt>
                <dd className="text-[1.05rem] leading-relaxed text-[color:rgb(231_232_227/0.85)]">
                  {r.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        className="section surface-vellum overflow-hidden"
        aria-labelledby="rules-title"
      >
        <div className="frame">
          <h2 id="rules-title" className="h-xl">
            Pinned above
            <br />
            our desks
          </h2>
          <ul className="mt-[clamp(3rem,7vw,6rem)] grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {studioNotes.map((n, i) => (
              <li
                key={n}
                className="note-card max-w-[26rem]"
                style={
                  {
                    "--r": `${[-1.6, 1.2, -0.6, 2, -1.2, 0.8][i]}deg`,
                  } as React.CSSProperties
                }
              >
                <p className="font-[family-name:var(--font-serif)] text-[1.2rem] leading-snug">
                  {n}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
