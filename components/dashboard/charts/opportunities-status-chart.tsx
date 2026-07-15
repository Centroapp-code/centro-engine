"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { MockOpportunityStatus } from "@/lib/mock/dashboard";

const STATUS_LABELS: Record<MockOpportunityStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  WON: "Won",
  LOST: "Lost",
};

const STATUS_COLOR_CLASS: Record<MockOpportunityStatus, string> = {
  NEW: "fill-[#2a78d6] dark:fill-[#3987e5]",
  CONTACTED: "fill-[#eda100] dark:fill-[#c98500]",
  QUALIFIED: "fill-[#008300] dark:fill-[#008300]",
  WON: "fill-[#4a3aa7] dark:fill-[#9085e9]",
  LOST: "fill-[#e34948] dark:fill-[#e66767]",
};

export function OpportunitiesStatusChart({
  data,
}: {
  data: { status: MockOpportunityStatus; count: number }[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((row) => {
        const widthPct = (row.count / max) * 100;
        return (
          <div
            key={row.status}
            className="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-3"
            onMouseEnter={() => setHovered(row.status)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(row.status)}
            onBlur={() => setHovered(null)}
            tabIndex={0}
            role="button"
            aria-label={`${STATUS_LABELS[row.status]}: ${row.count} opportunities`}
          >
            <span className="text-sm text-muted-foreground">
              {STATUS_LABELS[row.status]}
            </span>
            <svg viewBox="0 0 100 24" className="h-6 w-full" preserveAspectRatio="none">
              <rect x={0} y={0} width={100} height={24} className="fill-muted/40" rx={4} />
              <rect
                x={0}
                y={0}
                width={Math.max(widthPct, 2)}
                height={24}
                rx={4}
                className={cn(
                  STATUS_COLOR_CLASS[row.status],
                  "transition-opacity",
                  hovered === row.status ? "opacity-100" : "opacity-90"
                )}
              />
            </svg>
            <span className="text-right text-sm font-medium tabular-nums">
              {row.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
