import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ContactForm } from "./ContactForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Start a project",
  description: `Tell ${site.name} about your website, product or digital experience. ${site.replyPromise}`,
  path: "/contact",
});

const next = [
  {
    title: "We read every word",
    body:
      "A designer and an engineer both read your brief. " + site.replyPromise,
  },
  {
    title: "A 30-minute call",
    body: "No pitch deck. We ask questions, you ask questions, and we tell you honestly whether we're the right fit.",
  },
  {
    title: "A written proposal",
    body: "Scope, timeline and a fixed price, usually within a week of the call. No surprises later.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        lines={["Start a", "project"]}
        intro={
          <p>
            Tell us what you&apos;re planning. The rougher the idea, the more
            fun the first conversation.
          </p>
        }
      >
        <a
          href={`mailto:${site.email}`}
          className="link-draw font-[family-name:var(--font-display)] text-[clamp(1.2rem,1.8vw,1.6rem)] font-semibold tracking-[-0.01em]"
        >
          {site.email}
        </a>
        <div className="mt-1">
          <CopyEmail email={site.email} />
        </div>
      </PageHeader>

      <section
        className="frame pb-[var(--section-y)]"
        aria-labelledby="brief-title"
      >
        <div className="grid-12 gap-y-16">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <h2 id="brief-title" className="h-md mb-10">
              Your brief
            </h2>
            <ContactForm />
          </div>
          <aside
            className="col-span-4 md:col-span-12 lg:col-span-4 lg:col-start-9"
            aria-labelledby="next-title"
          >
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
              <h2 id="next-title" className="h-md">
                What happens next
              </h2>
              <ol className="mt-8 space-y-8">
                {next.map((n, i) => (
                  <li
                    key={n.title}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-t border-[color:rgb(21_21_21/0.18)] pt-5"
                  >
                    <span className="font-[family-name:var(--font-display)] text-[1.6rem] font-extrabold leading-none tnum text-[color:var(--color-line)]">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="h-sm">{n.title}</h3>
                      <p className="mt-2 text-[1.02rem] leading-relaxed">
                        {n.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="label mt-10 text-[0.9rem] text-[color:var(--color-graphite)]">
                Studio in {site.location.city}, working with teams in every time
                zone.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
