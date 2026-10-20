/**
 * Concept projects.
 *
 * These are self-initiated demonstration builds, not client work. Every page that
 * shows them says so. Replace them with real case studies when you have them, and
 * set `isConcept: false` so the concept labels disappear.
 */

export type SceneKey = "neap" | "umber" | "halden" | "corbel";

export type Project = {
  slug: string;
  name: string;
  category: string;
  year: string;
  isConcept: boolean;
  scene: SceneKey;
  summary: string;
  services: string[];
  stack: string[];
  /** Colours used to art-direct the case study page. */
  palette: { ground: string; ink: string; accent: string };
  challenge: { lead: string; body: string[] };
  approach: { lead: string; points: { title: string; body: string }[] };
  solution: { lead: string; features: { title: string; body: string }[] };
  outcome: {
    lead: string;
    targets: { metric: string; target: string }[];
    note: string;
  };
};

export const projects: Project[] = [
  {
    slug: "neap",
    name: "Neap",
    category: "Web app",
    year: "2026",
    isConcept: true,
    scene: "neap",
    summary:
      "Tide tables redrawn as a single curve a sailor can read at a glance, in bright sun, with one wet thumb.",
    services: ["Product design", "Data visualisation", "Progressive web app"],
    stack: ["Next.js", "TypeScript", "D3 scales", "Canvas", "Service worker"],
    palette: { ground: "#0f2a2e", ink: "#e9f1ec", accent: "#f5c542" },
    challenge: {
      lead: "Tide data is published for print. Sailors read it on a phone, on a moving deck.",
      body: [
        "Small-boat sailors plan around two questions: when can I leave, and when do I need to be back? The answers live in dense tide tables, wind forecasts and harbour notices spread across three or four apps.",
        "Those tables were designed for paper almanacs. On a phone in direct sunlight they become a wall of numbers, and the decision that matters most is the one they make hardest to see.",
      ],
    },
    approach: {
      lead: "We designed for the dock, not the desk.",
      points: [
        {
          title: "One question first",
          body: "Every screen starts from the question a sailor actually asks. Raw tables are still there, one tap away, for the people who want them.",
        },
        {
          title: "Sunlight as a constraint",
          body: "Contrast ratios were chosen for outdoor glare, not just WCAG minimums. A dedicated sun mode pushes them further.",
        },
        {
          title: "Thumb reach",
          body: "Every control sits in the bottom half of the screen. The tide curve itself is the scrubber.",
        },
      ],
    },
    solution: {
      lead: "A single tide curve became the interface.",
      features: [
        {
          title: "Scrubbable tide curve",
          body: "Drag along the curve to read height, time and current at any moment. Rendered on canvas so it stays smooth on older phones.",
        },
        {
          title: "Passage windows",
          body: "Safe departure and return windows are shaded directly on the curve, calculated from the boat's draught and the harbour bar depth.",
        },
        {
          title: "Works offline",
          body: "A week of tide predictions is cached after the first visit. Signal drops at sea; the app keeps working.",
        },
      ],
    },
    outcome: {
      lead: "What we would measure at launch.",
      targets: [
        {
          metric: 'Time to answer "can I leave at 3pm?"',
          target: "Under 10 seconds in moderated tests",
        },
        {
          metric: "Lighthouse performance, mid-range Android",
          target: "95 or higher",
        },
        {
          metric: "Offline availability after first visit",
          target: "Seven days of predictions",
        },
      ],
      note: "Neap is a concept project. These are the targets we set for the build, not results from real users.",
    },
  },
  {
    slug: "umber-and-slip",
    name: "Umber & Slip",
    category: "E-commerce",
    year: "2026",
    isConcept: true,
    scene: "umber",
    summary:
      "An online shop for a small ceramics studio where every piece is one of a kind, and the shop treats it that way.",
    services: ["Art direction", "Headless commerce", "Design system"],
    stack: ["Next.js", "Shopify Storefront API", "Edge caching", "Image CDN"],
    palette: { ground: "#efe4d6", ink: "#2b1d16", accent: "#a4532c" },
    challenge: {
      lead: "Handmade pieces don't fit product templates.",
      body: [
        "A ceramics studio sells pieces that exist exactly once. Standard e-commerce themes flatten them into identical SKU grids, and the variation in each glaze, the reason people buy handmade, disappears in a thumbnail.",
        "One-off stock creates a second problem: two people can add the same bowl to their bag, and one of them is going to be disappointed at checkout.",
      ],
    },
    approach: {
      lead: "We treated every piece as an edition of one.",
      points: [
        {
          title: "Variation is the product",
          body: "The design gives each glaze room to be looked at: large, close and in more than one light.",
        },
        {
          title: "Slow browse, fast buy",
          body: "Browsing is unhurried and editorial. Buying takes three steps, none of them surprising.",
        },
        {
          title: "Honest scarcity",
          body: "If a piece is in someone else's bag, you're told plainly, with the time it will be released.",
        },
      ],
    },
    solution: {
      lead: "A headless shop with a studio's sensibility.",
      features: [
        {
          title: "Glaze study viewer",
          body: "Each piece is photographed under daylight, warm interior light and raking light. Visitors switch between them without leaving the page.",
        },
        {
          title: "Ten-minute hold",
          body: "Adding a one-off piece to the bag reserves it for ten minutes, so nobody pays for a bowl that's already gone.",
        },
        {
          title: "Three-step checkout",
          body: "Bag, details, payment. Built on the platform's hosted checkout, so payments stay secure and compliant.",
        },
      ],
    },
    outcome: {
      lead: "What we would measure at launch.",
      targets: [
        {
          metric: "Largest Contentful Paint, product pages on 4G",
          target: "Under 2 seconds",
        },
        { metric: "Oversold one-off pieces", target: "Zero" },
        {
          metric: "Checkout accessibility",
          target: "WCAG 2.2 AA, tested with screen readers",
        },
      ],
      note: "Umber & Slip is a concept project. The studio and its pieces are fictional, and these figures are targets, not results.",
    },
  },
  {
    slug: "the-halden-plates",
    name: "The Halden Plates",
    category: "Interactive experience",
    year: "2026",
    isConcept: true,
    scene: "halden",
    summary:
      "A century of glass-plate star photography from a fictional observatory, explorable at the scale it was captured.",
    services: ["Interactive design", "WebGL engineering", "Content strategy"],
    stack: ["Next.js", "WebGL", "IIIF Image API", "Edge caching"],
    palette: { ground: "#07090f", ink: "#e8e6df", accent: "#ff8a3d" },
    challenge: {
      lead: "An extraordinary archive, hidden behind a search form.",
      body: [
        "Between 1890 and 1960, astronomers at the Halden Observatory exposed tens of thousands of glass photographic plates, then annotated them by hand in ink. The scans are gigapixel. The existing archive shows them as thumbnails in a list of search results.",
        "The handwriting tells the best stories, a comet spotted, a variable star circled twice, and it was invisible.",
      ],
    },
    approach: {
      lead: "We made the plates feel like objects again.",
      points: [
        {
          title: "Scale first",
          body: "The opening view is a single plate, edge to edge, and you can zoom until individual grains of emulsion are visible.",
        },
        {
          title: "Annotations as stories",
          body: "Transcribed notes become guided paths through a plate, written by curators and linked to the astronomers who made them.",
        },
        {
          title: "Time as navigation",
          body: "A decade scrubber lets visitors move through seventy years of the same patch of sky.",
        },
      ],
    },
    solution: {
      lead: "A deep-zoom viewer that respects the original.",
      features: [
        {
          title: "Tiled WebGL viewer",
          body: "Plates stream as IIIF image tiles into a WebGL canvas, so a two-gigapixel scan opens as fast as a photograph.",
        },
        {
          title: "Accessible by design",
          body: "Every annotation is real text in the document, reachable by keyboard and screen reader, not baked into the image.",
        },
        {
          title: "Plate of the day",
          body: "A rotating front page gives returning visitors a reason to come back, and gives curators a place to publish.",
        },
      ],
    },
    outcome: {
      lead: "What we would measure at launch.",
      targets: [
        {
          metric: "First tiles visible after opening a plate",
          target: "Under 1 second",
        },
        {
          metric: "Viewer controls operable by keyboard",
          target: "All of them",
        },
        {
          metric: "Average plates explored per visit",
          target: "Three or more",
        },
      ],
      note: "The Halden Observatory and its archive are fictional. This concept shows how we'd approach a large cultural collection.",
    },
  },
  {
    slug: "corbel",
    name: "Corbel",
    category: "Digital product",
    year: "2026",
    isConcept: true,
    scene: "corbel",
    summary:
      "Fee tracking for architecture practices that shows, in one screen, whether each project is making or losing money.",
    services: ["Product strategy", "UX and UI design", "Frontend engineering"],
    stack: ["React", "TypeScript", "Design tokens", "Storybook", "Postgres"],
    palette: { ground: "#f4f4f0", ink: "#1b1d1c", accent: "#1f6b4f" },
    challenge: {
      lead: "Overruns were discovered after the money was gone.",
      body: [
        "Architecture practices are paid in stages: concept, planning, technical design, construction. Time is tracked in spreadsheets, fees live in accounting software, and nobody connects the two until the end of the month.",
        "By the time a project shows up as unprofitable, the stage that caused it has already closed.",
      ],
    },
    approach: {
      lead: "We designed for the Monday studio meeting.",
      points: [
        {
          title: "One screen, one decision",
          body: "The question in that meeting is simple: which projects need attention this week? The main view answers it before anyone scrolls.",
        },
        {
          title: "Stages, not timesheets",
          body: "Architects think in fee stages, so the product does too. Hours roll up into the shape the business is already paid in.",
        },
        {
          title: "A system, not a set of screens",
          body: "A token-based design system kept the product consistent as it grew from three views to thirty.",
        },
      ],
    },
    solution: {
      lead: "Fee burn, made visible.",
      features: [
        {
          title: "Stage burn chart",
          body: "Each project shows fee spent against fee earned, stage by stage, with the gap shaded so overruns are impossible to miss.",
        },
        {
          title: "Forecast to completion",
          body: "Current pace projected forward, so a studio can intervene while a stage is still open.",
        },
        {
          title: "Bring your own timesheets",
          body: "Imports from common timesheet tools and CSV, so nobody has to change how they log hours on day one.",
        },
      ],
    },
    outcome: {
      lead: "What we would measure at launch.",
      targets: [
        {
          metric: "Time to identify an at-risk project",
          target: "Under 30 seconds from login",
        },
        {
          metric: "Interaction to Next Paint on the main view",
          target: "Under 200 ms",
        },
        {
          metric: "Design system coverage of product UI",
          target: "90% of screens built from shared components",
        },
      ],
      note: "Corbel is a concept product. The data shown is illustrative and these are targets, not results.",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length]!;
}
