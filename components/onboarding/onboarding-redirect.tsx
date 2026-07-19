"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

/**
 * Redirects to `to` after forcing a fresh session token. A server-side
 * redirect() here would carry the browser's current (possibly stale) JWT,
 * which proxy.ts reads to gate /dashboard — without a forced refresh it can
 * still show onboardingCompleted as false and bounce right back.
 *
 * user.reload() is Clerk's documented pattern for refreshing the session
 * token immediately after a metadata update, instead of waiting for the
 * ~60s automatic refresh cycle.
 */
export function OnboardingRedirect({ to }: { to: string }) {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await user?.reload();
      if (!cancelled) {
        router.replace(to);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, router, to]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Redirecting to your dashboard...
    </div>
  );
}
