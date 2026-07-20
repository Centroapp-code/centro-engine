export async function register() {
  // Only in the Node.js runtime (not Edge middleware), and only at actual
  // server startup (next start / a serverless cold start) — never during
  // `next build`'s static route analysis, which imports route modules
  // without needing every environment variable to exist yet.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("@/lib/env");
    validateEnv();
  }
}
