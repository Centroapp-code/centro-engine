"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

/**
 * Redirects to `to` after forcing a fresh session token. A server-side
 * redirect() here would carry the browser's current (possibly stale) JWT,
 * which proxy.ts reads to gate /dashboard — without a forced refresh it can
 * still show onboardingCompleted as false and bounce right back.
 */
export function OnboardingRedirect({ to }: { to: string }) {
  const router = useRouter();
  const { getToken } = useAuth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await getToken({ skipCache: true });
      if (!cancelled) {
        router.replace(to);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, router, to]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Redirecting to your dashboard...
    </div>
  );
}
