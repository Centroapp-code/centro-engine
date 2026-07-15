export const ROLES = ["CUSTOMER", "ADMIN"] as const;

export type Role = (typeof ROLES)[number];

export const DEFAULT_ROLE: Role = "CUSTOMER";

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function homeRouteForRole(role: Role): string {
  return role === "ADMIN" ? "/admin" : "/dashboard";
}
