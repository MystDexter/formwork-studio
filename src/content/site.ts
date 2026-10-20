/**
 * Single source of truth for the studio's identity.
 * Rename the agency, change the email or location here and it updates everywhere.
 */
export const site = {
  name: "Formwork",
  legalName: "Formwork Studio",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://formwork.studio").replace(
    /\/$/,
    "",
  ),
  email: "hello@formwork.studio",
  tagline: "Ideas, given their final form.",
  positioning:
    "We transform ambitious ideas into remarkable digital experiences through exceptional design and engineering.",
  description:
    "Formwork is a design and engineering studio. We build fast, accessible, memorable websites and digital products for teams with big ideas and high standards.",
  location: {
    city: "Kuala Lumpur",
    country: "Malaysia",
    timeZone: "Asia/Kuala_Lumpur",
    coordinates: "3.1390° N, 101.6869° E",
  },
  replyPromise: "We reply to every enquiry within two working days.",
  // Replace these handles with the studio's real profiles before launch.
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/formwork-studio",
    },
    { label: "Instagram", href: "https://www.instagram.com/formwork.studio" },
    { label: "GitHub", href: "https://github.com/formwork-studio" },
  ],
  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
