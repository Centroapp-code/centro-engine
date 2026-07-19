"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function SelectionCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
        selected
          ? "border-primary bg-primary/5 font-medium text-foreground"
          : "border-border/60 hover:border-border hover:bg-accent/50"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border/60"
        )}
      >
        {selected ? <Check className="size-3.5" /> : null}
      </span>
    </button>
  );
}
