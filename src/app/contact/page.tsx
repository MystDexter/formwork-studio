import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { BriefStudio } from "./BriefStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Start a project",
  description: `Tell ${site.name} about your website, product or digital experience. ${site.replyPromise}`,
  path: "/contact",
});

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
        <BriefStudio />
      </section>
    </>
  );
}
