"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Catches errors in the root layout itself (e.g. ClerkProvider or font
 * setup failing) — the one case app/error.tsx can't handle, since that
 * boundary lives inside the root layout. Next.js requires this file to
 * render its own <html>/<body>, replacing the root layout entirely, so it's
 * kept deliberately minimal and dependency-free (no ClerkProvider, no UI
 * components) to stay robust even when the rest of the app can't render.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center p-8 antialiased">
        <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-10 text-center shadow-sm">
          <p className="font-medium">Something went wrong</p>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-1 rounded-lg border border-input px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
