"use client";

import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <ClerkSignOutButton redirectUrl="/">
      <Button variant="outline">Logout</Button>
    </ClerkSignOutButton>
  );
}
