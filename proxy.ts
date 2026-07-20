import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { DEFAULT_ROLE, isRole } from "@/lib/auth/roles";

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/onboarding(.*)",
]);

/**
 * Middleware is authentication + role routing only. It never gates on
 * onboarding completion — that decision depends on Postgres (the source of
 * truth), and Postgres isn't reachable from Edge middleware without adding
 * per-request DB latency to every navigation. The one exception below is a
 * pure optimization, never a denial: it can only send an already-onboarded
 * user straight to /dashboard a little faster. It can never send someone to
 * /onboarding, so a stale or missing claim here can cost at most one extra
 * hop through the onboarding page's own authoritative check — never a loop.
 *
 * The actual gate lives server-side in requireCustomerCompany()
 * (lib/auth/company.ts) and in app/onboarding/page.tsx, both of which read
 * User.onboardingCompleted directly from the database on every request.
 */
export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) {
    return;
  }

  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  const claimedRole = sessionClaims?.metadata?.role;
  const role = isRole(claimedRole) ? claimedRole : DEFAULT_ROLE;

  if (isAdminRoute(req) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (role === "ADMIN") {
    if (isDashboardRoute(req) || isOnboardingRoute(req)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return;
  }

  // Optimization only (see comment above) — never authoritative.
  if (isOnboardingRoute(req) && sessionClaims?.metadata?.onboardingCompleted === true) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
