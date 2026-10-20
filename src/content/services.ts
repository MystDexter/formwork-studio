export type GlyphKey =
  | "web"
  | "app"
  | "interactive"
  | "commerce"
  | "ux"
  | "redesign"
  | "performance"
  | "product";

export type Service = {
  id: string;
  title: string;
  /** What we deliver, in one line. */
  what: string;
  /** Why it matters to the client. */
  value: string;
  deliverables: string[];
  glyph: GlyphKey;
};

export const services: Service[] = [
  {
    id: "creative-web",
    title: "Creative websites",
    what: "Art-directed websites with a clear point of view, designed and built by the same team.",
    value:
      "A site people remember and talk about, that your own team can still update on a Tuesday afternoon.",
    deliverables: [
      "Art direction",
      "Design and build",
      "Content management",
      "Launch support",
    ],
    glyph: "web",
  },
  {
    id: "web-apps",
    title: "Web applications",
    what: "Custom web apps and platforms, from internal tools to customer-facing products.",
    value:
      "Software shaped around how your business actually works, instead of the other way round.",
    deliverables: [
      "Architecture",
      "Full-stack TypeScript",
      "Authentication and roles",
      "APIs and integrations",
    ],
    glyph: "app",
  },
  {
    id: "interactive",
    title: "Interactive experiences",
    what: "Campaigns, launches and storytelling sites using motion, WebGL and real-time graphics.",
    value:
      "Attention that's earned, from an experience that still loads fast and works for everyone.",
    deliverables: [
      "Concept and storyboards",
      "Motion design",
      "WebGL and canvas",
      "Performance tuning",
    ],
    glyph: "interactive",
  },
  {
    id: "commerce",
    title: "E-commerce",
    what: "Headless and platform shops on Shopify and custom stacks, built for speed at every step.",
    value:
      "Faster pages and a calmer checkout, which is where conversion is won or lost.",
    deliverables: [
      "Headless storefronts",
      "Shopify themes",
      "Checkout UX",
      "Analytics setup",
    ],
    glyph: "commerce",
  },
  {
    id: "ux-ui",
    title: "UX and UI design",
    what: "Research, flows, interface design and design systems for products and platforms.",
    value:
      "Interfaces people understand the first time, and a system that keeps them consistent as you grow.",
    deliverables: [
      "User research",
      "Flows and prototypes",
      "Interface design",
      "Design systems",
    ],
    glyph: "ux",
  },
  {
    id: "redesign",
    title: "Redesign and modernisation",
    what: "Rebuilding ageing sites and apps on a modern stack without losing what already works.",
    value:
      "A new site without losing your search rankings, your content or your team's sanity.",
    deliverables: [
      "Audit and migration plan",
      "Content migration",
      "SEO preservation",
      "Phased rollout",
    ],
    glyph: "redesign",
  },
  {
    id: "performance",
    title: "Frontend and performance",
    what: "Core Web Vitals work, accessibility remediation and frontend architecture for existing products.",
    value:
      "Pages that feel instant, which matters to your users, your search ranking and your revenue.",
    deliverables: [
      "Performance audits",
      "Core Web Vitals fixes",
      "Accessibility remediation",
      "Frontend architecture",
    ],
    glyph: "performance",
  },
  {
    id: "product",
    title: "Digital product development",
    what: "Taking a product from first idea to launched MVP, then helping it grow.",
    value:
      "One team from sketch to shipped, so nothing gets lost between strategy, design and code.",
    deliverables: [
      "Product discovery",
      "MVP scoping",
      "Design and build",
      "Post-launch iteration",
    ],
    glyph: "product",
  },
];
