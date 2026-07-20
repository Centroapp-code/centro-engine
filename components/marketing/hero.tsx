import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/marketing/image-placeholder";
import { hero } from "@/lib/content/marketing";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl"
      >
        <div className="h-72 w-[36rem] rounded-full bg-primary/20" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center sm:py-32">
        <Badge variant="secondary" className="mb-6">
          {hero.badge}
        </Badge>

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {hero.headline}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-balance text-muted-foreground sm:text-xl">
          {hero.subheadline}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" nativeButton={false} render={<Link href={hero.primaryCta.href} />}>
            {hero.primaryCta.label}
            <ArrowRight />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href={hero.secondaryCta.href} />}
          >
            {hero.secondaryCta.label}
          </Button>
        </div>

        <ImagePlaceholder
          label="Product dashboard preview"
          aspectClassName="aspect-video"
          className="mt-16 max-w-4xl"
        />
      </div>
    </section>
  );
}
