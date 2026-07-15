import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingHomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Centro
      </h1>
      <p className="max-w-xl text-balance text-muted-foreground">
        Centro is an AI sales phone agent that answers, qualifies, and routes
        your inbound sales calls — without replacing your existing phone
        system.
      </p>
      <div className="flex gap-3">
        <Button render={<Link href="/sign-up" />}>Get started</Button>
        <Button variant="outline" render={<Link href="/sign-in" />}>
          Sign in
        </Button>
      </div>
    </main>
  );
}
