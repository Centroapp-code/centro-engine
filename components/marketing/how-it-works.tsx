import { ArrowDown } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";
import { ImagePlaceholder } from "@/components/marketing/image-placeholder";
import { howItWorks, howItWorksSection } from "@/lib/content/marketing";

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow={howItWorksSection.eyebrow}
        title={howItWorksSection.title}
        description={howItWorksSection.description}
      />

      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-16">
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          {howItWorks.map((step, index) => (
            <div key={step.title} className="flex w-full flex-col items-center">
              <div className="flex w-full items-start gap-4 rounded-xl border bg-card p-5 text-left shadow-sm">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </div>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < howItWorks.length - 1 ? (
                <ArrowDown className="my-3 size-5 shrink-0 text-muted-foreground/50" />
              ) : null}
            </div>
          ))}
        </div>

        <ImagePlaceholder
          label="AI agent call visualization"
          aspectClassName="aspect-square"
          className="lg:sticky lg:top-24"
        />
      </div>
    </Section>
  );
}
