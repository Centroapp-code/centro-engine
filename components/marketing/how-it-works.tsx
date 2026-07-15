import { ArrowDown, Phone, Grid2x2, Bot, ClipboardCheck, Users } from "lucide-react";
import { Section, SectionHeading } from "@/components/marketing/section";

const STEPS = [
  {
    icon: Phone,
    title: "A salesperson calls your business",
    description: "A vendor or rep dials in, hoping to reach a decision-maker.",
  },
  {
    icon: Grid2x2,
    title: "The call reaches Centro",
    description: "Your existing phone system forwards it to Centro instead of your team.",
  },
  {
    icon: Bot,
    title: "Centro answers",
    description: "A Centro AI gatekeeper greets the caller and finds out who they are.",
  },
  {
    icon: ClipboardCheck,
    title: "Centro qualifies the pitch",
    description: "Centro asks the right questions and scores whether it's worth your time.",
  },
  {
    icon: Users,
    title: "Your team reviews the opportunity",
    description: "A summary, score, and recommendation land in your dashboard.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow="How it works"
        title="From sales call to qualified opportunity"
        description="Centro slots into the phone system you already have — no new number, no new hardware."
      />

      <div className="mx-auto mt-16 flex max-w-md flex-col items-center">
        {STEPS.map((step, index) => (
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
            {index < STEPS.length - 1 ? (
              <ArrowDown className="my-3 size-5 shrink-0 text-muted-foreground/50" />
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}
