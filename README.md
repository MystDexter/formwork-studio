# Formwork: studio website

A flagship site for a design and engineering studio, built with Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 4 and GSAP.

"Formwork" is a placeholder name. Change it, the email and the location in `src/content/site.ts` and it updates everywhere.

## Run it

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck
```

Copy `.env.example` to `.env.local` to configure:

| Variable               | Purpose                                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and Open Graph. Defaults to `https://formwork.studio`.                                                                                 |
| `CONTACT_WEBHOOK_URL`  | Where the contact form forwards enquiries as JSON (Formspree, Basin, Make, Zapier, a Slack workflow or your own API). Without it the form opens a prefilled email instead. |

Press **G** anywhere on the site (or use the switch in the footer) to show the 12-column grid.

## The concept

On a building site, formwork is the temporary structure concrete is poured into. Nobody sees it in the finished building, but it decides the shape of everything. The site is built on that idea: **every finished surface has a drawing underneath, and the visitor can see it.**

- **The blueprint lens (hero).** The hero is rendered twice with identical layout: once finished, once as its own technical drawing (Prussian blue ground, letter outlines, baselines measured from Archivo's real metrics, annotations, live coordinates). A circular lens follows the cursor and shows the drawing beneath the build. On touch it moves to wherever you tap; with reduced motion it rests in place.
- **One motion vocabulary, four verbs.** _Draw_ (construction lines extend), _ink_ (an outline fills to solid), _pour_ (ink rises from the baseline like concrete into a mould) and _lens_ (x-ray).
- **The hero builds itself in four acts.** Setting out (crop marks snap in, guides draw, dimension lines count up to each line's real width), formwork (the letter outlines trace themselves), the pour (ink rises inside the letters with a meniscus wave) and the strike (the outlines and measurements lift away). All CSS, so it starts on the first frame without waiting for JavaScript.
- **The hand-off.** Scrolling out of the hero grows the lens until the whole screen is blueprint, which is where the manifesto section begins.
- **How it works, as one drawing.** On desktop, a single drawing is scrubbed by your scroll through the five steps: notes become a site map, the map unfolds into a dimensioned wireframe, the wireframe gets a grid, components, code and a passing build, then colour is poured in and the page goes live (visitors move, a score counts up, the trend keeps drawing, one block swaps for a variant). A week counter and a timeline rail track your place. On phones, each step's drawing plays its own stage as it comes into view.
- **The contact page draws your brief.** As you fill in the form, a technical drawing of your brief fills in: your name sets the title, project types pour into tiles, the budget becomes a dimension line, the message greeks in, and a stamp lands when it's sent (or ready to email). Beside it, the route from brief to proposal shows real dates, worked out from the visitor's own today and skipping weekends. On phones the route comes before the form.
- **Drawings behind the work.** Each concept project is an SVG composition drawn from one set of geometry in two states, finished and wireframe, with engineering decisions annotated in red. The featured project is drawn into existence by the scroll; the others reveal their drawing on hover, focus or tap.
- **Palette.** Vellum `#E7E8E3` (paper), ink `#151515`, Prussian `#13315C` (blueprint), non-photo blue `#5FA8D3` (construction lines) and redline `#F2401D`, used only for calls to action and annotations. The brief's cream-and-acid-lime starter was deliberately left behind because it has become the default look of generated agency sites.
- **Type.** Archivo (variable weight and width; display set expanded and heavy, and the service rows widen on hover using the width axis) with Newsreader for editorial text.

## Structure

```
src/
  app/                    routes, metadata, sitemap, robots, OG image, contact API
    work/[slug]/          statically generated case studies
    api/contact/route.ts  validates and forwards enquiries
  components/
    home/                 Hero, Manifesto, SelectedWork, Process, Studio, Proof, ClosingCta
    work/                 ProjectVisual, ProjectMeta, WorkIndex, scenes/ (SVG artwork)
    layout/               SiteHeader, SiteFooter, GridOverlay
    ui/                   Wordmark, PageHeader, ServiceList, ServiceGlyph, Magnetic, CopyEmail
  content/                all copy and data: site, projects, services, studio
  lib/                    gsap setup, hooks, seeded RNG, SEO helper, shared form validation
  fonts/                  Archivo (instanced and subset) and the OG image font
public/fonts/             Newsreader (instanced and subset)
```

Content lives in `src/content`, tokens and component styles in `src/app/globals.css` (inside `@layer base` and `@layer components`, so Tailwind utilities can override them), and presentation in components.

## Technical decisions

- **Server first.** Every page is statically generated. Client components are limited to things that respond to people: the lens, scroll choreography, accordions, the form.
- **Compositor-only lens.** The lens is a circular window moved with `transform`, and the drawing inside moves the opposite way, so each frame changes two transforms and nothing repaints. The idle drift settles after a few seconds so a resting page goes quiet.
- **Entrances that don't delay paint.** The hero entrance is CSS, not JavaScript. Text is painted on the first frame as a pencil outline, so the largest paint is never held back by an animation.
- **A pour that runs on the GPU.** The pour is an ink copy of each line inside a masked window that rises while its contents counter-move: transforms only, no repainting of the headline. The real text turns to ink in a single step when the pour completes.
- **Drawings mount when they're needed.** The process drawings are several hundred SVG nodes each and sit far below the fold, so they render as same-sized placeholders and mount only when within a screen of the viewport. Their GSAP timelines are built at the same moment. Once running, the live loop measured zero long tasks at 4x CPU slowdown.
- **Fonts.** Both families are instanced to the axis ranges actually used and subset to Latin: Archivo 52 KB (preloaded, `font-display: block` because the headline is the design), Newsreader about 50 KB per style (roman preloaded, italic on demand) with a metric-matched fallback.
- **GSAP only where it earns it.** ScrollTrigger scrubs the manifesto, the featured project's split line and a light parallax. Everything else is CSS transitions or IntersectionObserver. All GSAP work sits inside `gsap.matchMedia()` gated on `prefers-reduced-motion`, and `useGSAP` cleans up on unmount.
- **Accessible by construction.** Semantic landmarks and headings, skip link, visible focus everywhere, focus-trapped mobile menu that returns focus on close, accordions with `aria-expanded` and `inert` panels, an error summary that receives focus, and every hover reveal also works on focus or with a button.
- **Honest contact flow.** The form posts to `/api/contact`, which validates on the server with the same rules as the client. With `CONTACT_WEBHOOK_URL` set it forwards the brief and only reports success when the endpoint confirms. Without it the API says so, and the form explains that nothing was sent and offers a prefilled email. A honeypot field filters simple bots.

## Measured results

Measured on a local production build (`next build && next start`), November 2026, Next.js 16.4.5. These are lab numbers, not field data. Measure again on your real hosting.

| Check                                                      | Result                                                                                                                                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lighthouse desktop, home and contact                       | Performance 100, LCP 0.6 to 0.7 s, TBT 0 to 20 ms, CLS 0                                                                                                                  |
| Lighthouse mobile (simulated slow 4G), home                | Performance 90 to 92, LCP 3.2 to 3.4 s, TBT about 100 ms, CLS 0                                                                                                           |
| Lighthouse mobile (applied 4G and 4x CPU throttling), home | Performance 77 to 88, LCP 2.4 to 2.7 s, TBT 340 to 640 ms, CLS 0.003. Measured side by side with the previous version, which landed in the same range on the same machine |
| Lighthouse mobile (applied throttling), contact            | Performance 97, LCP 1.8 s                                                                                                                                                 |
| Lighthouse accessibility, best practices, SEO              | 100 on every page tested                                                                                                                                                  |
| axe-core, WCAG 2.2 AA tags, 8 routes, motion on and off    | No violations (the decorative, aria-hidden lens is excluded)                                                                                                              |
| Horizontal overflow at 320, 375, 768, 1024, 1440, 1920 px  | None                                                                                                                                                                      |
| Home page weight                                           | About 434 KB compressed, including fonts                                                                                                                                  |

Mobile LCP on the home page is at the 2.5 s target under applied throttling and above it under simulation. INP has not been measured with real users: the "Slowest interaction" readout on the home page measures it live in the visitor's browser.

## What is placeholder or still to do

- **Concept projects.** Neap, Umber & Slip, The Halden Plates and Corbel are self-initiated concepts, labelled as such on every page. Their organisations and data are fictional, and the "outcomes" are stated as targets. Replace them in `src/content/projects.ts` and set `isConcept: false` for real work.
- **No testimonials, client logos or awards.** The home page shows a clearly labelled reserved space instead, plus live performance measurements of the page itself.
- **Email, domain and social handles** (`hello@formwork.studio`, `formwork-studio` profiles) are placeholders. Replace them before launch so enquiries don't go to a domain you don't own.
- **Contact delivery** needs `CONTACT_WEBHOOK_URL`. Until then, enquiries go via the visitor's email app.
- **Team.** The About page describes roles, not named people. Add real names and portraits when ready.
- **No CMS.** Content is typed TypeScript in `src/content`. Swap in Sanity, Contentful or similar if non-developers need to edit.
- **No analytics or cookie banner.** Add your provider of choice; the site sets no cookies today.
- **Linting.** Type checking is strict; ESLint is not configured.

## Licences

Archivo and Newsreader are licensed under the SIL Open Font License 1.1. All artwork on the site is generated in code.
