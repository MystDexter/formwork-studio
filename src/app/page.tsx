import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Process } from "@/components/home/Process";
import { Studio } from "@/components/home/Studio";
import { Proof } from "@/components/home/Proof";
import { ClosingCta } from "@/components/home/ClosingCta";
import { ServiceList } from "@/components/ui/ServiceList";
import { services } from "@/content/services";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <SelectedWork />

      <section className="section surface-vellum pt-0" aria-labelledby="services-title">
        <div className="frame">
          <div className="border-t-[3px] border-[color:var(--color-ink)] pt-[clamp(3rem,7vw,6rem)]">
            <div className="grid-12 gap-y-6">
              <h2 id="services-title" className="h-xl col-span-4 md:col-span-7">
                What we build
              </h2>
              <div className="col-span-4 md:col-span-4 md:col-start-9 md:self-end">
                <p className="text-[1.05rem] leading-relaxed">
                  Design and engineering under one roof, so nothing gets lost in the handover. Open any
                  line to see what you get.
                </p>
                <Link href="/services" className="label link-draw mt-4 inline-block text-base">
                  All services in detail
                </Link>
              </div>
            </div>
            <div className="mt-[clamp(2.5rem,6vw,5rem)]">
              <ServiceList services={services} />
            </div>
          </div>
        </div>
      </section>

      <Process />
      <Studio />
      <Proof />
      <ClosingCta />
    </>
  );
}
