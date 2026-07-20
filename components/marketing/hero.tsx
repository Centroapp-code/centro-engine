import Link from "next/link";
import { ArrowRight, PhoneIncoming } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { hero } from "@/lib/content/marketing";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl"
      >
        <div className="h-72 w-[36rem] rounded-full bg-blue-600/10" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center sm:py-28">
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
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href={hero.primaryCta.href} />}
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
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

        <Card className="mt-16 w-full max-w-2xl p-0 text-left shadow-lg">
          <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
              <PhoneIncoming className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Incoming call — Meridian Supply Co.</p>
              <p className="text-xs text-muted-foreground">Answered by Centro · 2m 41s</p>
            </div>
          </div>

          <div className="space-y-3 px-5 py-5">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Caller:</span> &ldquo;Hi, I&rsquo;m
              reaching out because we think we could save your team some money on a service
              you&rsquo;re already paying for. Do you have a couple minutes?&rdquo;
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Centro:</span> &ldquo;Got it —
              I&rsquo;ll capture the details and get this in front of the right person.&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/30 px-5 py-4">
            <Badge variant="outline" className="font-medium">
              Vendor Pitch
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Opportunity score</span>
              <span className="text-lg font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                86
              </span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
