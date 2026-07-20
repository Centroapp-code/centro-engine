"use client";

import { useState, useTransition } from "react";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingStepContainer } from "@/components/onboarding/step-container";
import { SelectionCard } from "@/components/onboarding/selection-card";
import { LabeledSelect } from "@/components/onboarding/labeled-select";
import {
  AGENT_TONE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  CONVERSATION_PRIORITY_OPTIONS,
  CUSTOMER_TYPE_OPTIONS,
  GOAL_OPTIONS,
  INDUSTRY_OPTIONS,
  SALES_TEAM_SIZE_OPTIONS,
} from "@/components/onboarding/options";
import { completeOnboarding, type OnboardingInput } from "@/lib/actions/onboarding";

const TOTAL_STEPS = 7;

type OnboardingData = OnboardingInput;

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function canContinue(step: number, data: OnboardingData): boolean {
  switch (step) {
    case 1:
      return data.companyName.trim().length > 0 && data.industry.length > 0;
    case 2:
      return data.companySize.length > 0 && data.salesTeamSize.length > 0;
    case 3:
      return data.goals.length > 0;
    case 4:
      return data.targetCustomer.length > 0;
    case 5:
      return data.agentTone.length > 0 && data.conversationPriorities.length > 0;
    default:
      return true;
  }
}

export function OnboardingWizard({ initialCompanyName }: { initialCompanyName: string }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<OnboardingData>({
    companyName: initialCompanyName,
    industry: "",
    companySize: "",
    salesTeamSize: "",
    goals: [],
    targetCustomer: "",
    customerNotes: "",
    agentTone: "",
    conversationPriorities: [],
  });

  function next() {
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function launch() {
    setError(null);
    startTransition(async () => {
      // On success, completeOnboarding() redirects server-side and this
      // never returns — the database write it just committed is what
      // /dashboard's gate checks, so there's no client-side state to
      // refresh or wait on. Reaching the line below means it returned
      // instead of redirecting, i.e. an error.
      const result = await completeOnboarding(data);
      setError(result.message ?? "Something went wrong. Please try again.");
    });
  }

  const update = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  if (step === 0) {
    return (
      <OnboardingStepContainer
        step={step}
        totalSteps={TOTAL_STEPS}
        showProgress={false}
        title="Let's set up Centro for your business"
        description="We'll customize your AI sales agent based on your company, customers, and sales goals. This takes about 2 minutes."
        footer={
          <Button className="w-full" size="lg" onClick={next}>
            Get Started
            <ArrowRight />
          </Button>
        }
      >
        <div className="flex justify-center py-2 text-primary">
          <Sparkles className="size-10" />
        </div>
      </OnboardingStepContainer>
    );
  }

  if (step === 1) {
    return (
      <OnboardingStepContainer
        step={step}
        totalSteps={TOTAL_STEPS}
        title="Tell us about your company"
        description="This helps Centro introduce itself the right way on every call."
        footer={<StepFooter onBack={back} onNext={next} disabled={!canContinue(step, data)} />}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="companyName">What is your company name?</Label>
          <Input
            id="companyName"
            value={data.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            placeholder="Acme Inc."
            autoFocus
          />
        </div>
        <LabeledSelect
          id="industry"
          label="Which industry best describes your business?"
          value={data.industry}
          onValueChange={(v) => update("industry", v)}
          options={INDUSTRY_OPTIONS}
        />
      </OnboardingStepContainer>
    );
  }

  if (step === 2) {
    return (
      <OnboardingStepContainer
        step={step}
        totalSteps={TOTAL_STEPS}
        title="Your business profile"
        description="A quick sense of your team helps Centro set the right pace."
        footer={<StepFooter onBack={back} onNext={next} disabled={!canContinue(step, data)} />}
      >
        <LabeledSelect
          id="companySize"
          label="How large is your company?"
          value={data.companySize}
          onValueChange={(v) => update("companySize", v)}
          options={COMPANY_SIZE_OPTIONS}
        />
        <LabeledSelect
          id="salesTeamSize"
          label="How many people are involved in sales?"
          value={data.salesTeamSize}
          onValueChange={(v) => update("salesTeamSize", v)}
          options={SALES_TEAM_SIZE_OPTIONS}
        />
      </OnboardingStepContainer>
    );
  }

  if (step === 3) {
    return (
      <OnboardingStepContainer
        step={step}
        totalSteps={TOTAL_STEPS}
        title="What are you hoping Centro helps you accomplish?"
        description="Select everything that applies — this shapes how Centro screens every call."
        footer={<StepFooter onBack={back} onNext={next} disabled={!canContinue(step, data)} />}
      >
        <div className="flex flex-col gap-2">
          {GOAL_OPTIONS.map((goal) => (
            <SelectionCard
              key={goal}
              label={goal}
              selected={data.goals.includes(goal)}
              onClick={() => update("goals", toggleValue(data.goals, goal))}
            />
          ))}
        </div>
      </OnboardingStepContainer>
    );
  }

  if (step === 4) {
    return (
      <OnboardingStepContainer
        step={step}
        totalSteps={TOTAL_STEPS}
        title="Who are your typical customers?"
        description="Centro uses this to ask smarter qualifying questions."
        footer={<StepFooter onBack={back} onNext={next} disabled={!canContinue(step, data)} />}
      >
        <LabeledSelect
          id="targetCustomer"
          label="Customer type"
          value={data.targetCustomer}
          onValueChange={(v) => update("targetCustomer", v)}
          options={CUSTOMER_TYPE_OPTIONS}
        />
        <div className="flex flex-col gap-2">
          <Label htmlFor="customerNotes">
            Tell us anything about your ideal customer{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="customerNotes"
            rows={3}
            value={data.customerNotes}
            onChange={(e) => update("customerNotes", e.target.value)}
            placeholder="e.g. Mid-size logistics companies already using route optimization software."
          />
        </div>
      </OnboardingStepContainer>
    );
  }

  if (step === 5) {
    return (
      <OnboardingStepContainer
        step={step}
        totalSteps={TOTAL_STEPS}
        title="AI agent preferences"
        description="How Centro should sound and what it should focus on during every call."
        footer={<StepFooter onBack={back} onNext={next} disabled={!canContinue(step, data)} />}
      >
        <LabeledSelect
          id="agentTone"
          label="How should Centro represent your company?"
          value={data.agentTone}
          onValueChange={(v) => update("agentTone", v)}
          options={AGENT_TONE_OPTIONS}
        />
        <div className="flex flex-col gap-2">
          <Label>What should Centro prioritize during conversations?</Label>
          <div className="flex flex-col gap-2">
            {CONVERSATION_PRIORITY_OPTIONS.map((priority) => (
              <SelectionCard
                key={priority}
                label={priority}
                selected={data.conversationPriorities.includes(priority)}
                onClick={() =>
                  update(
                    "conversationPriorities",
                    toggleValue(data.conversationPriorities, priority)
                  )
                }
              />
            ))}
          </div>
        </div>
      </OnboardingStepContainer>
    );
  }

  // Step 6 — Review
  return (
    <OnboardingStepContainer
      step={step}
      totalSteps={TOTAL_STEPS}
      title="Review your setup"
      description="Here's what Centro will use to configure your AI sales agent."
      footer={
        <div className="flex w-full flex-col gap-3">
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={back} disabled={isPending}>
              <ArrowLeft />
              Back
            </Button>
            <Button onClick={launch} disabled={isPending}>
              {isPending ? "Launching..." : "Launch My Centro Agent"}
              {!isPending && <ArrowRight />}
            </Button>
          </div>
        </div>
      }
    >
      <dl className="flex flex-col divide-y divide-border/60 rounded-lg border border-border/60">
        <ReviewRow label="Company" value={data.companyName} />
        <ReviewRow label="Industry" value={data.industry} />
        <ReviewRow label="Company size" value={data.companySize} />
        <ReviewRow label="Goals" value={data.goals.join(", ")} />
        <ReviewRow label="Customer type" value={data.targetCustomer} />
        <ReviewRow label="Agent style" value={data.agentTone} />
      </dl>
    </OnboardingStepContainer>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value || "—"}</dd>
    </div>
  );
}

function StepFooter({
  onBack,
  onNext,
  disabled,
}: {
  onBack: () => void;
  onNext: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft />
        Back
      </Button>
      <Button onClick={onNext} disabled={disabled}>
        Continue
        <ArrowRight />
      </Button>
    </div>
  );
}
