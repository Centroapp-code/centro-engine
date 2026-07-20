import { headers } from "next/headers";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";
import { DEFAULT_ROLE } from "@/lib/auth/roles";
import { ensureUserWithCompany } from "@/lib/db/provisioning";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

type ClerkUserEventData = {
  id: string;
  email_addresses: { id: string; email_address: string }[];
  primary_email_address_id: string | null;
};

type ClerkUserCreatedEvent = {
  type: "user.created";
  data: ClerkUserEventData;
};

type ClerkWebhookEvent = ClerkUserCreatedEvent | { type: string; data: { id: string } };

function isUserCreatedEvent(event: ClerkWebhookEvent): event is ClerkUserCreatedEvent {
  return (
    event.type === "user.created" &&
    Array.isArray((event.data as Partial<ClerkUserEventData>).email_addresses)
  );
}

export async function POST(req: Request) {
  const headerList = await headers();
  const svixId = headerList.get("svix-id");
  const svixTimestamp = headerList.get("svix-timestamp");
  const svixSignature = headerList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    logger.warn("clerk_webhook.missing_headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();

  // Svix signature verification — the authentication boundary for this
  // route. Left exactly as-is: do not weaken or bypass this check.
  let event: ClerkWebhookEvent;
  try {
    event = new Webhook(env.CLERK_WEBHOOK_SECRET).verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    logger.warn("clerk_webhook.invalid_signature");
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (!isUserCreatedEvent(event)) {
    // Every other event type is a no-op today. Acknowledge with 200 so
    // Clerk doesn't retry an event we intentionally don't act on.
    return new Response("ok", { status: 200 });
  }

  try {
    const { data } = event;
    const client = await clerkClient();
    await client.users.updateUserMetadata(data.id, {
      publicMetadata: { role: DEFAULT_ROLE },
    });

    const email =
      data.email_addresses.find(
        (address) => address.id === data.primary_email_address_id
      )?.email_address ?? data.email_addresses[0]?.email_address;

    if (!email) {
      logger.warn("clerk_webhook.user_created_no_email", { clerkId: data.id });
      return new Response("ok", { status: 200 });
    }

    await ensureUserWithCompany({ clerkId: data.id, email });
    logger.info("clerk_webhook.user_provisioned", { clerkId: data.id });
  } catch (error) {
    logger.error("clerk_webhook.processing_failed", {
      message: error instanceof Error ? error.message : "unknown error",
    });
    // 500 so Clerk/Svix retries the delivery — ensureUserWithCompany() is
    // idempotent, so a retry is safe. If retries are exhausted, the lazy
    // fallback in getCurrentUser() still provisions on the user's first
    // authenticated request.
    return new Response("Failed to process webhook", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
