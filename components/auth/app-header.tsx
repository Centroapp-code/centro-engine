import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo";

export function AppHeader({ label }: { label: string }) {
  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Logo />
          </Link>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
