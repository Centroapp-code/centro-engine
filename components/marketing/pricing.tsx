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
import { pricingPlans, pricingSection } from "@/lib/content/marketing";

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow={pricingSection.eyebrow}
        title={pricingSection.title}
        description={pricingSection.description}
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
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
