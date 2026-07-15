import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { DEFAULT_ROLE, homeRouteForRole, isRole, type Role } from "./roles";

export { auth, currentUser };
export { ROLES, DEFAULT_ROLE, homeRouteForRole, isRole } from "./roles";
export type { Role } from "./roles";

/** The signed-in user's role, falling back to CUSTOMER if unset. */
export async function getCurrentRole(): Promise<Role> {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;
  return isRole(role) ? role : DEFAULT_ROLE;
}

export async function isAdmin(): Promise<boolean> {
  return (await getCurrentRole()) === "ADMIN";
}

/** Redirects to sign-in if there is no authenticated user. */
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
}

/**
 * Redirects to sign-in if unauthenticated, or to the caller's own role home
 * route if authenticated with a different role. Use in server
 * components/layouts as defense-in-depth alongside the route middleware.
 */
export async function requireRole(role: Role) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const currentRole = await getCurrentRole();
  if (currentRole !== role) {
    redirect(homeRouteForRole(currentRole));
  }
}
