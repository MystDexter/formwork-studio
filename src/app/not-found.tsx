import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="surface-prussian blueprint-grid relative flex min-h-[100svh] items-center overflow-hidden" aria-labelledby="nf-title">
      <div className="frame w-full pb-20 pt-[calc(var(--nav-h)+4rem)]">
        <p
          aria-hidden="true"
          className="font-[family-name:var(--font-display)] font-extrabold leading-[0.8] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--color-chalk)]"
          style={{ fontSize: "clamp(8rem, 34vw, 30rem)", fontStretch: "125%" }}
        >
          404
        </p>
        <div className="grid-12 mt-10 gap-y-6">
          <h1 id="nf-title" className="h-xl col-span-4 text-white md:col-span-8">
            Nothing has been poured here yet.
          </h1>
          <div className="col-span-4 md:col-span-4 md:col-start-9 md:self-end">
            <p className="text-[1.05rem] leading-relaxed text-[color:rgb(212_230_245/0.88)]">
              This page only exists as a drawing. The link may be old, or the address may have a typo.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link href="/" className="btn">
                Back to the home page
              </Link>
              <Link href="/work" className="label link-draw text-base">
                See the work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
