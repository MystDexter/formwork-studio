import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { PageHeader } from "@/components/ui/PageHeader";
import { WorkIndex } from "@/components/work/WorkIndex";
import { ClosingCta } from "@/components/home/ClosingCta";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Concept projects from Formwork: a tide app for sailors, a ceramics shop, an astronomy archive and a fee tracker for architects. Each one documented from challenge to outcome.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHeader
        lines={["Work on", "the drawing", "board"]}
        intro={
          <p>
            Four self-initiated projects, each taken from brief to working
            build. They show how we think when nobody is telling us what to
            make.
          </p>
        }
      >
        <p className="text-[1.02rem] leading-relaxed">
          These are concept projects, clearly labelled as such. The clients,
          people and figures in them are fictional; the design and engineering
          thinking is real.
        </p>
      </PageHeader>
      <section
        className="frame pb-[var(--section-y)]"
        aria-label="Project index"
      >
        <WorkIndex projects={projects} />
      </section>
      <ClosingCta />
    </>
  );
}
