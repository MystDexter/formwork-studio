import Link from "next/link";
import { site } from "@/content/site";
import { Mark } from "@/components/ui/Wordmark";
import { GridSwitch, LocalTime } from "./FooterBits";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="surface-prussian blueprint-grid relative overflow-hidden" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <div className="frame pt-[clamp(4rem,9vw,8rem)]">
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-5">
            <p className="h-md max-w-[22ch] text-[color:var(--color-chalk)]">
              Have a brief, a sketch or just a hunch? Tell us about it.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-draw mt-6 inline-block font-[family-name:var(--font-display)] text-[clamp(1.25rem,2vw,1.75rem)] font-semibold tracking-[-0.01em] text-white"
            >
              {site.email}
            </a>
          </div>

          <div className="col-span-2 md:col-span-2 md:col-start-7">
            <h3 className="label label-muted mb-4">Studio</h3>
            <p className="label text-[0.95rem] leading-relaxed">
              {site.location.city}
              <br />
              {site.location.country}
              <br />
              Local time <LocalTime timeZone={site.location.timeZone} />
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-2 md:col-span-2">
            <h3 className="label label-muted mb-4">Index</h3>
            <ul className="label space-y-2 text-[0.95rem]">
              <li>
                <Link href="/" className="link-draw">
                  Home
                </Link>
              </li>
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-4 md:col-span-2">
            <h3 className="label label-muted mb-4">Elsewhere</h3>
            <ul className="label space-y-2 text-[0.95rem]">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="link-draw" rel="me noopener" target="_blank">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* The signature: the wordmark drawn at full width, with its construction lines left in. */}
      <div className="relative mt-[clamp(4rem,10vw,9rem)]" aria-hidden="true">
        <div className="frame relative">
          <div
            className="relative whitespace-nowrap font-[family-name:var(--font-display)] font-extrabold leading-[0.92] tracking-[-0.045em] text-[color:var(--color-chalk)]"
            style={{ fontSize: "min(calc((100vw - 2 * var(--gx)) / 6.05), 18.6rem)", fontStretch: "125%" }}
          >
            <span className="guide" data-g="cap" style={{ animation: "none", background: "rgb(212 230 245 / .25)" }} />
            <span className="guide" data-g="x" style={{ animation: "none", background: "rgb(212 230 245 / .18)" }} />
            <span className="guide" data-g="base" style={{ animation: "none", background: "var(--color-redline)" }} />
            <span className="relative">{site.name}</span>
          </div>
        </div>
      </div>

      <div className="frame relative border-t border-[color:rgb(212_230_245/0.2)] py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="label label-muted flex items-center gap-2">
            <Mark className="h-4 w-4" />
            © {year} {site.legalName}. Set in Archivo and Newsreader, built with Next.js.
          </p>
          <GridSwitch />
        </div>
      </div>
    </footer>
  );
}
