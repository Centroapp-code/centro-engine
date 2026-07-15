import type { Role } from "@/lib/auth/roles";

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: Role;
    };
  }
}
