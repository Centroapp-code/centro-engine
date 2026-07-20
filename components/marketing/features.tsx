import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/marketing/section";
import { features, featuresSection } from "@/lib/content/marketing";

export function Features() {
  return (
    <Section id="features" className="bg-muted/30">
      <SectionHeading
        eyebrow={featuresSection.eyebrow}
        title={featuresSection.title}
        description={featuresSection.description}
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
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
