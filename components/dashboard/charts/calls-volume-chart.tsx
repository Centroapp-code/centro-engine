"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DailyCallVolume } from "@/lib/db/queries/analytics";

const WIDTH = 560;
const HEIGHT = 220;
const PADDING_LEFT = 32;
const PADDING_BOTTOM = 24;
const PADDING_TOP = 16;
const BAR_MAX_WIDTH = 24;

function niceMax(value: number) {
  if (value <= 10) return 10;
  const step = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / step) * step;
}

function formatDayLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export function CallsVolumeChart({ data }: { data: DailyCallVolume[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const max = niceMax(Math.max(...data.map((d) => d.count)));
  const plotWidth = WIDTH - PADDING_LEFT;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const slot = plotWidth / data.length;
  const barWidth = Math.min(BAR_MAX_WIDTH, slot - 8);
  const maxIndex = data.reduce(
    (best, d, i) => (d.count > data[best].count ? i : best),
    0
  );

  const yTicks = [0, max / 2, max];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Inbound calls per day for the last 7 days"
      >
        {yTicks.map((tick) => {
          const y = PADDING_TOP + plotHeight - (tick / max) * plotHeight;
          return (
            <g key={tick}>
              <line
                x1={PADDING_LEFT}
                x2={WIDTH}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeWidth={1}
              />
              <text
                x={PADDING_LEFT - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const x = PADDING_LEFT + i * slot + (slot - barWidth) / 2;
          const barHeight = (d.count / max) * plotHeight;
          const y = PADDING_TOP + plotHeight - barHeight;
          const isHovered = hovered === i;
          const isMax = i === maxIndex;

          return (
            <g key={d.date}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 1)}
                rx={4}
                className={cn(
                  "fill-[#2a78d6] transition-opacity dark:fill-[#3987e5]",
                  isHovered ? "opacity-100" : "opacity-90"
                )}
              />
              {isMax ? (
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-foreground text-[11px] font-medium"
                >
                  {d.count}
                </text>
              ) : null}
              <text
                x={x + barWidth / 2}
                y={HEIGHT - 6}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {formatDayLabel(d.date)}
              </text>
              <rect
                x={PADDING_LEFT + i * slot}
                y={PADDING_TOP}
                width={slot}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                role="button"
                aria-label={`${d.count} calls on ${new Date(d.date).toLocaleDateString()}`}
              />
            </g>
          );
        })}
      </svg>

      {hovered !== null ? (
        <div
          className="pointer-events-none absolute rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-sm"
          style={{
            left: `${((PADDING_LEFT + hovered * slot + slot / 2) / WIDTH) * 100}%`,
            top: 0,
            transform: "translate(-50%, -110%)",
          }}
        >
          <p className="font-medium text-popover-foreground">
            {data[hovered].count} calls
          </p>
          <p className="text-muted-foreground">
            {new Date(data[hovered].date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      ) : null}
    </div>
  );
}
