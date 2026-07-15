import { headers } from "next/headers";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";
import { DEFAULT_ROLE } from "@/lib/auth/roles";

type ClerkUserCreatedEvent = {
  type: "user.created";
  data: { id: string };
};

type ClerkWebhookEvent = ClerkUserCreatedEvent | { type: string; data: { id: string } };

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerList = await headers();
  const svixId = headerList.get("svix-id");
  const svixTimestamp = headerList.get("svix-timestamp");
  const svixSignature = headerList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();

  let event: ClerkWebhookEvent;
  try {
    event = new Webhook(webhookSecret).verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (event.type === "user.created") {
    const client = await clerkClient();
    await client.users.updateUserMetadata(event.data.id, {
      publicMetadata: { role: DEFAULT_ROLE },
    });
  }

  return new Response("ok", { status: 200 });
}
