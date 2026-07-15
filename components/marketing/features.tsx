import {
  Bot,
  ClipboardCheck,
  FileText,
  TrendingUp,
  Plug,
  PhoneForwarded,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/marketing/section";

const FEATURES = [
  {
    icon: Bot,
    title: "AI Gatekeeper",
    description:
      "A natural-sounding AI answers every inbound sales call instantly, so your team doesn't have to.",
  },
  {
    icon: ClipboardCheck,
    title: "Pitch Qualification",
    description:
      "Centro asks the right questions to understand what's being sold and why it matters.",
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
      "Every pitch is scored so your team knows exactly which ones are worth a follow-up.",
  },
  {
    icon: Plug,
    title: "CRM Integration",
    description:
      "Worthwhile opportunities flow directly into the CRM your team already uses.",
  },
  {
    icon: PhoneForwarded,
    title: "Human Escalation",
    description:
      "When a call is worth taking, Centro transfers it live to the right person on your team.",
  },
];

export function Features() {
  return (
    <Section id="features" className="bg-muted/30">
      <SectionHeading
        eyebrow="Features"
        title="Everything you need to screen inbound sales calls"
        description="Centro handles the full lifecycle of every vendor call, from greeting to decision."
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border-border/60">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </div>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
