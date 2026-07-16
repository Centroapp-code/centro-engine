import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dashed placeholder standing in for real Centro-branded imagery.
 * Swap the contents for a next/image <Image> once assets exist —
 * callers only need to keep the aspect ratio/className props.
 */
export function ImagePlaceholder({
  label,
  aspectClassName = "aspect-video",
  className,
}: {
  label: string;
  aspectClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40",
        aspectClassName,
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 px-6 text-center text-muted-foreground">
        <ImageIcon className="size-6" />
        <p className="text-sm font-medium">{label}</p>
      </div>
    </div>
  );
}
