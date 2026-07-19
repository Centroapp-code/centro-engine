import { OnboardingProgress } from "@/components/onboarding/progress-indicator";

export function OnboardingStepContainer({
  step,
  totalSteps,
  title,
  description,
  children,
  footer,
  showProgress = true,
}: {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer: React.ReactNode;
  showProgress?: boolean;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-lg">
        {showProgress ? (
          <div className="mb-8">
            <OnboardingProgress step={step} totalSteps={totalSteps} />
          </div>
        ) : null}

        <div
          key={step}
          className="animate-in fade-in-0 slide-in-from-right-2 flex flex-col gap-6 rounded-2xl border border-border/60 bg-card p-8 shadow-sm duration-300 sm:p-10"
        >
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              {title}
            </h1>
            {description ? (
              <p className="text-sm text-balance text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          {children ? <div className="flex flex-col gap-5">{children}</div> : null}

          <div className="flex items-center justify-between gap-3 pt-2">{footer}</div>
        </div>
      </div>
    </div>
  );
}
