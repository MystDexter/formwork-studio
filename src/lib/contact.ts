/** Shared between the form and the API route, so the rules are identical on both sides. */

export const PROJECT_TYPES = [
  "New website",
  "Redesign",
  "Web app or product",
  "E-commerce",
  "Interactive experience",
  "Performance or accessibility",
] as const;

export const BUDGETS = [
  "Under $15k",
  "$15k to $40k",
  "$40k to $100k",
  "Over $100k",
  "Not sure yet",
] as const;

export const TIMELINES = [
  "As soon as possible",
  "In 1 to 3 months",
  "In 3 to 6 months",
  "Flexible",
] as const;

export type Brief = {
  name: string;
  email: string;
  company: string;
  types: string[];
  budget: string;
  timeline: string;
  message: string;
};

export type BriefErrors = Partial<Record<keyof Brief, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateBrief(b: Partial<Brief>): BriefErrors {
  const e: BriefErrors = {};
  if (!b.name || b.name.trim().length < 2)
    e.name = "Enter your name so we know who to reply to.";
  if (!b.email || !EMAIL.test(b.email.trim()))
    e.email = "Enter an email address like name@company.com.";
  if (!b.types || b.types.length === 0)
    e.types = "Choose at least one type of project.";
  if (!b.budget || !(BUDGETS as readonly string[]).includes(b.budget))
    e.budget = 'Choose a budget range, or "Not sure yet".';
  if (!b.message || b.message.trim().length < 20)
    e.message =
      "Tell us a little more: at least 20 characters about what you want to build.";
  if (b.message && b.message.length > 5000)
    e.message =
      "Keep the message under 5,000 characters. You can send more later.";
  return e;
}

export function briefToText(b: Brief) {
  return [
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    b.company ? `Company: ${b.company}` : null,
    `Project: ${b.types.join(", ")}`,
    `Budget: ${b.budget}`,
    b.timeline ? `Timeline: ${b.timeline}` : null,
    "",
    b.message,
  ]
    .filter((l) => l !== null)
    .join("\n");
}
