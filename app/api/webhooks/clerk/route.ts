import { headers } from "next/headers";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";
import { DEFAULT_ROLE } from "@/lib/auth/roles";
import { ensureUserWithCompany } from "@/lib/db/provisioning";

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

  if (event.type === "user.created" && "email_addresses" in event.data) {
    const { data } = event;
    const client = await clerkClient();
    await client.users.updateUserMetadata(data.id, {
      publicMetadata: { role: DEFAULT_ROLE },
    });

    const email =
      data.email_addresses.find(
        (address) => address.id === data.primary_email_address_id
      )?.email_address ?? data.email_addresses[0]?.email_address;

    if (email) {
      await ensureUserWithCompany({ clerkId: data.id, email });
    }
  }

  return new Response("ok", { status: 200 });
}
