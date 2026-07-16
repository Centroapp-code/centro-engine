import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/marketing/section";

const PLANS = [
  {
    name: "Starter",
    description: "For small teams that want to stop fielding every vendor call themselves.",
    features: [
      "1 AI gatekeeper",
      "Up to 250 calls / month",
      "Pitch qualification & scoring",
      "Call summaries",
      "Email support",
    ],
    cta: "Join the Waitlist",
    ctaHref: "mailto:sales@centroengine.com?subject=Centro%20Waitlist%20-%20Starter",
    highlighted: false,
  },
  {
    name: "Growth",
    description: "For growing teams that need CRM integration and more volume.",
    features: [
      "3 AI gatekeepers",
      "Up to 1,500 calls / month",
      "Pitch qualification & scoring",
      "Call summaries & transcripts",
      "CRM integration",
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
      "Unlimited AI gatekeepers",
      "Custom call volume",
      "Advanced CRM & workflow integrations",
      "Dedicated onboarding",
      "SLA & dedicated support",
    ],
    cta: "Contact Sales",
    ctaHref: "mailto:sales@centroengine.com?subject=Centro%20Enterprise%20Sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple plans that scale with your call volume"
        description="We're finalizing pricing ahead of launch. Join the waitlist to lock in early access and be first to know when plans go live."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col border-border/60",
              plan.highlighted && "border-primary ring-1 ring-primary"
            )}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {plan.highlighted ? <Badge>Most popular</Badge> : null}
              </div>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight text-muted-foreground">
                  Coming Soon
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
                nativeButton={false}
                render={<Link href={plan.ctaHref} />}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
}
