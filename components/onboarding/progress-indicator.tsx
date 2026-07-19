import { cn } from "@/lib/utils";

export function OnboardingProgress({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  const percent = ((step + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Step {step + 1} of {totalSteps}
        </span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full bg-primary transition-all duration-500 ease-out")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
