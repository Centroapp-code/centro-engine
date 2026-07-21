import type { LucideIcon } from "lucide-react";
import {
  Bot,
  ClipboardCheck,
  FileText,
  TrendingUp,
  Plug,
  PhoneForwarded,
  Phone,
  Grid2x2,
  Users,
} from "lucide-react";

/**
 * Single source of truth for all marketing site copy. Components map over
 * these exports rather than hardcoding text, so a copy change only ever
 * happens in this file.
 */

export type SiteMeta = {
  title: string;
  description: string;
};

export const siteMeta: SiteMeta = {
  title: "Centro | AI Vendor Call Intelligence",
  description:
    "Centro answers, screens, and analyzes inbound vendor and business calls on your behalf, so your team only spends time on real opportunities.",
};

export const supportEmail = "sales@centroengine.com";

export type CtaLink = {
  label: string;
  href: string;
};

export type HeroContent = {
  badge: string;
  headline: string;
  subheadline: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
};

export const hero: HeroContent = {
  badge: "AI Vendor Call Intelligence",
  headline: "Never miss a real opportunity in a vendor call again.",
  subheadline:
    "Centro connects to your existing phone system and answers calls from vendors, suppliers, and partners on your behalf — extracting the details, scoring the business value, and summarizing it in your dashboard before your team ever picks up.",
  primaryCta: { label: "Start Free Trial", href: "/sign-up" },
  secondaryCta: { label: "Login", href: "/sign-in" },
};

export type SectionHeadingContent = {
  eyebrow: string;
  title: string;
  description?: string;
};

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const featuresSection: SectionHeadingContent = {
  eyebrow: "Features",
  title: "Everything you need to make sense of inbound vendor calls.",
  description:
    "Centro handles the full lifecycle of every vendor call, from greeting to decision.",
};

export const features: Feature[] = [
  {
    icon: Bot,
    title: "AI Receptionist",
    description:
      "A natural-sounding AI answers every inbound vendor call instantly, so your team doesn't have to.",
  },
  {
    icon: ClipboardCheck,
    title: "Call Intelligence",
    description:
      "Centro extracts what's being offered and why it matters, straight from the conversation.",
  },
  {
    icon: FileText,
    title: "Call Summaries",
    description:
      "Every call is distilled into a clear summary your team can read in seconds.",
  },
  {
    icon: TrendingUp,
    title: "Opportunity Scoring",
    description:
      "Every call is scored so your team knows exactly which ones are worth a follow-up.",
  },
  {
    icon: Plug,
    title: "Exportable Insights",
    description:
      "Opportunities can be exported to the tools your team already uses.",
  },
  {
    icon: PhoneForwarded,
    title: "Human Escalation",
    description:
      "When a call is worth taking, Centro transfers it live to the right person on your team.",
  },
];

export type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const howItWorksSection: SectionHeadingContent = {
  eyebrow: "How it works",
  title: "From vendor call to scored opportunity.",
  description:
    "Centro slots into the phone system you already have — no new number, no new hardware.",
};

export const howItWorks: Step[] = [
  {
    icon: Phone,
    title: "A vendor calls your business",
    description: "A supplier, vendor, or service provider dials in, hoping to reach a decision-maker.",
  },
  {
    icon: Grid2x2,
    title: "The call reaches Centro",
    description: "Your existing phone system forwards it to Centro instead of your team.",
  },
  {
    icon: Bot,
    title: "Centro answers",
    description: "A Centro AI receptionist greets the caller and finds out who they are.",
  },
  {
    icon: ClipboardCheck,
    title: "Centro analyzes the call",
    description: "Centro extracts the details and scores whether it's worth your team's time.",
  },
  {
    icon: Users,
    title: "Your team reviews the opportunity",
    description: "A summary, score, and recommendation land in your dashboard.",
  },
];

export type PricingPlan = {
  name: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
};

export const pricingSection: SectionHeadingContent = {
  eyebrow: "Pricing",
  title: "Simple plans that scale with your call volume",
  description:
    "We're finalizing pricing ahead of launch. Join the waitlist to lock in early access and be first to know when plans go live.",
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    description: "For small teams that want to stop fielding every vendor call themselves.",
    features: [
      "1 AI receptionist",
      "Up to 250 calls / month",
      "Call analysis & opportunity scoring",
      "Call summaries",
      "Email support",
    ],
    cta: "Join the Waitlist",
    ctaHref: "mailto:sales@centroengine.com?subject=Centro%20Waitlist%20-%20Starter",
    highlighted: false,
  },
  {
    name: "Growth",
    description: "For growing teams that need exportable reporting and more volume.",
    features: [
      "3 AI receptionists",
      "Up to 1,500 calls / month",
      "Call analysis & opportunity scoring",
      "Call summaries & transcripts",
      "Exportable opportunity reports",
      "Priority support",
    ],
    cta: "Join the Waitlist",
    ctaHref: "mailto:sales@centroengine.com?subject=Centro%20Waitlist%20-%20Growth",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For organizations fielding high call volume across teams.",
    features: [
      "Unlimited AI receptionists",
      "Custom call volume",
      "Advanced export & workflow integrations",
      "Dedicated onboarding",
      "SLA & dedicated support",
    ],
    cta: "Contact Sales",
    ctaHref: "mailto:sales@centroengine.com?subject=Centro%20Enterprise%20Sales",
    highlighted: false,
  },
];

export type Faq = {
  question: string;
  answer: string;
};

export const faqSection: SectionHeadingContent = {
  eyebrow: "FAQ",
  title: "Frequently asked questions",
};

export const faqs: Faq[] = [
  {
    question: "Does Centro replace our existing phone system?",
    answer:
      "No. Centro connects to the phone system you already have and handles inbound vendor and business calls on your behalf. Everything else keeps working exactly as it does today.",
  },
  {
    question: "How does Centro analyze a vendor call?",
    answer:
      "Centro asks a configurable set of questions during the call to understand who's calling and what they're offering, then scores the opportunity before it reaches your team.",
  },
  {
    question: "What happens after a call is analyzed?",
    answer:
      "Centro can optionally be configured to transfer a genuinely worthwhile call live to your team, or save the summary, score, and contact details to your dashboard for later review.",
  },
  {
    question: "Can Centro send opportunities to our CRM?",
    answer:
      "Exporting opportunities to external CRMs and workflow tools is on our roadmap, not yet available. Today, every opportunity Centro identifies is scored and summarized in your Centro dashboard.",
  },
  {
    question: "Do we need any new hardware or phone numbers?",
    answer:
      "No new hardware or number is required. You forward calls to Centro from the phone system you already use.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, every plan starts with a free trial so you can see how Centro handles your real inbound call volume before committing.",
  },
];

export const footerTagline = "AI-powered vendor call intelligence for busy teams.";

export type FooterLinkColumn = {
  heading: string;
  links: { label: string; href: string }[];
};

export const footerLinks: FooterLinkColumn[] = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "mailto:sales@centroengine.com" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];
