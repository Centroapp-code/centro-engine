import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
          AI Sales Phone Agent
        </Badge>

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          AI sales agents that turn inbound calls into qualified
          opportunities.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-balance text-muted-foreground sm:text-xl">
          Centro connects to your existing phone system and automatically
          handles sales calls, qualifies leads, and connects your team with
          better opportunities.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" render={<Link href="/sign-up" />}>
            Start Free Trial
            <ArrowRight />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/sign-in" />}>
            Login
          </Button>
        </div>
      </div>
    </section>
  );
}
