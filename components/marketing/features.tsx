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
    title: "AI Sales Agent",
    description:
      "A natural-sounding AI answers every inbound sales call instantly, day or night.",
  },
  {
    icon: ClipboardCheck,
    title: "Lead Qualification",
    description:
      "Centro asks the right questions to understand needs and identify high-intent buyers.",
  },
  {
    icon: FileText,
    title: "Call Summaries",
    description:
      "Every call is distilled into a clear summary your team can read in seconds.",
  },
  {
    icon: TrendingUp,
    title: "Lead Scoring",
    description:
      "Leads are automatically scored so reps know exactly who to call first.",
  },
  {
    icon: Plug,
    title: "CRM Integration",
    description:
      "Qualified leads flow directly into the CRM your sales team already uses.",
  },
  {
    icon: PhoneForwarded,
    title: "Human Transfer",
    description:
      "When a lead is ready, Centro transfers the call live to your sales team.",
  },
];

export function Features() {
  return (
    <Section id="features" className="bg-muted/30">
      <SectionHeading
        eyebrow="Features"
        title="Everything your sales team needs from every call"
        description="Centro handles the full lifecycle of an inbound sales call, from greeting to handoff."
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
