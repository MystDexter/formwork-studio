export const processSteps = [
  {
    title: "Discover",
    body: "We listen before we sketch. Interviews, analytics and a hard look at what already exists, until we can state the problem in one sentence.",
    outputs: [
      "Stakeholder interviews",
      "Audit of the current site",
      "A one-page brief we both sign",
    ],
    typical: "1 to 2 weeks",
  },
  {
    title: "Strategise",
    body: "Structure comes before style. We map content, journeys and technical constraints, and set the performance and accessibility budgets the build must meet.",
    outputs: [
      "Site map and user journeys",
      "Technical architecture",
      "Performance and accessibility budgets",
    ],
    typical: "1 to 2 weeks",
  },
  {
    title: "Design",
    body: "Wireframes become art direction. You see real layouts with real content early, and interactive prototypes for anything that moves.",
    outputs: [
      "Wireframes",
      "Art direction and design system",
      "Motion prototypes",
    ],
    typical: "3 to 6 weeks",
  },
  {
    title: "Develop",
    body: "Designers and engineers work side by side in code. You get a staging link from week one and watch the site take shape, not a reveal at the end.",
    outputs: [
      "Component library",
      "CMS and integrations",
      "Testing on real devices",
    ],
    typical: "4 to 10 weeks",
  },
  {
    title: "Launch and evolve",
    body: "We launch on a Tuesday, measure what happens, and keep improving. Launch is the first day the site meets reality, not the last day of the project.",
    outputs: [
      "Launch plan and monitoring",
      "Analytics and Core Web Vitals reporting",
      "Ongoing iteration",
    ],
    typical: "Ongoing",
  },
] as const;

export const studioNotes = [
  "We set the performance budget before anyone opens a design tool.",
  "Every build gets tested on an inexpensive Android phone on a slow connection. If it's smooth there, it's smooth everywhere.",
  "Keyboard first. If you can't tab through it, it isn't finished.",
  "Designers write CSS. Engineers sit in on design reviews. Nothing gets thrown over a wall.",
  "We ship on Tuesdays. Never on Fridays.",
  'Motion needs a reason. "It looks cool" is allowed once per project.',
] as const;

export const principles = [
  {
    title: "Engineering is part of the design",
    body: "How fast a page loads, how it behaves on a cheap phone, whether a screen reader can follow it: these are design decisions, and we make them at the start.",
  },
  {
    title: "Accessibility is a specification",
    body: "We design and build to WCAG 2.2 AA from the first wireframe. It is cheaper, and the result is better for everyone.",
  },
  {
    title: "Motion with a reason",
    body: "Animation should explain, guide or delight, in that order. If it only decorates, it goes.",
  },
] as const;
