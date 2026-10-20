import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/content/services";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServiceList } from "@/components/ui/ServiceList";
import { ClosingCta } from "@/components/home/ClosingCta";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Creative websites, web applications, interactive experiences, e-commerce, UX and UI design, redesigns, frontend performance and digital product development.",
  path: "/services",
});

const engagements = [
  {
    title: "Project",
    when: "You have a defined launch: a new site, a redesign, a product MVP.",
    how: "Fixed scope, fixed price and a shared timeline, agreed after discovery. Weekly demos on a live staging link.",
  },
  {
    title: "Partnership",
    when: "Your site or product is live and needs to keep getting better.",
    how: "A dedicated team for a set number of days each month. We plan together quarterly and ship continuously.",
  },
  {
    title: "Sprint",
    when: "Something specific is slow, broken or inaccessible.",
    how: "Two focused weeks on one problem, such as Core Web Vitals, an accessibility audit or a checkout, ending in shipped fixes, not just a report.",
  },
];

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Astro",
  "Node.js",
  "Shopify",
  "Sanity",
  "Contentful",
  "GSAP",
  "Three.js",
  "WebGL",
  "Postgres",
  "Vercel",
  "Figma",
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        lines={["Design,", "engineered."]}
        intro={
          <p>
            Eight things we do, all by the same team. Strategy, design and
            engineering happen together, which is why the work holds up after
            launch.
          </p>
        }
      >
        <Link href="/contact#brief" className="btn">
          Start a project
        </Link>
      </PageHeader>

      <section className="frame pb-[var(--section-y)]" aria-label="Services">
        <ServiceList services={services} detailed defaultOpen="creative-web" />
      </section>

      <section
        className="section surface-prussian blueprint-grid"
        aria-labelledby="engage-title"
      >
        <div className="frame">
          <h2 id="engage-title" className="h-xl text-white">
            Ways to work
            <br />
            with us
          </h2>
          <div className="mt-[clamp(3rem,7vw,6rem)] divide-y divide-[color:rgb(212_230_245/0.25)] border-y border-[color:rgb(212_230_245/0.25)]">
            {engagements.map((e) => (
              <div key={e.title} className="grid-12 gap-y-4 py-10">
                <h3 className="h-lg col-span-4 text-white md:col-span-4">
                  {e.title}
                </h3>
                <p className="col-span-4 text-[1.05rem] leading-relaxed text-[color:rgb(212_230_245/0.88)] md:col-span-3">
                  <span className="label mb-2 block text-[color:var(--color-chalk)]">
                    When it fits
                  </span>
                  {e.when}
                </p>
                <p className="col-span-4 text-[1.05rem] leading-relaxed text-[color:rgb(212_230_245/0.88)] md:col-span-4 md:col-start-9">
                  <span className="label mb-2 block text-[color:var(--color-chalk)]">
                    How it runs
                  </span>
                  {e.how}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface-vellum" aria-labelledby="stack-title">
        <div className="frame grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-4">
            <h2 id="stack-title" className="h-lg">
              Tools we trust
            </h2>
            <p className="mt-5 text-[1.02rem] leading-relaxed">
              We choose the stack for the problem, not the other way round.
              These are the tools we reach for most, because we know them
              deeply.
            </p>
          </div>
          <ul className="col-span-4 flex flex-wrap gap-x-[0.5em] gap-y-1 font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,3.75rem)] font-bold leading-[1.1] tracking-[-0.03em] md:col-span-7 md:col-start-6">
            {stack.map((t, i) => (
              <li
                key={t}
                className={
                  i % 3 === 1 ? "text-[color:var(--color-graphite)]" : undefined
                }
              >
                {t}
                {i < stack.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="text-[color:var(--color-line)]"
                  >
                    ,
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
