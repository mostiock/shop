import { db } from "@/lib/database";
import { sendWelcomeEmail } from "@/lib/email";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env.local",
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    try {
      // Create user in Supabase
      const newUser = await db.createUser({
        clerk_id: id,
        email: email_addresses[0]?.email_address || "",
        first_name: first_name || "",
        last_name: last_name || "",
        role: "user", // Default role, can be changed to admin manually
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      console.log(`User ${id} created in Supabase`);

      // Send welcome email
      if (newUser && email_addresses[0]?.email_address) {
        try {
          await sendWelcomeEmail({
            userName:
              `${first_name || ""} ${last_name || ""}`.trim() || "New Customer",
            userEmail: email_addresses[0].email_address,
            actionType: "welcome",
          });
          console.log(
            `Welcome email sent to ${email_addresses[0].email_address}`,
          );
        } catch (emailError) {
          console.error("Error sending welcome email:", emailError);
          // Don't fail the webhook if email fails
        }
      }
    } catch (error) {
      console.error("Error creating user in Supabase:", error);
      return new Response("Error creating user", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    try {
      const user = await db.getUserByClerkId(id);
      if (user?.id) {
        await db.updateUser(user.id as string, {
          email: email_addresses[0]?.email_address || "",
          first_name: first_name || "",
          last_name: last_name || "",
          updated_at: new Date().toISOString(),
        });

        console.log(`User ${id} updated in Supabase`);
      }
    } catch (error) {
      console.error("Error updating user in Supabase:", error);
      return new Response("Error updating user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      console.error("No user ID provided in deletion event");
      return new Response("No user ID provided", { status: 400 });
    }

    try {
      const user = await db.getUserByClerkId(id);
      if (user?.id) {
        // Instead of deleting, we might want to mark as inactive
        await db.updateUser(user.id as string, {
          updated_at: new Date().toISOString(),
        });

        console.log(`User ${id} processed for deletion in Supabase`);
      }
    } catch (error) {
      console.error("Error processing user deletion in Supabase:", error);
      return new Response("Error processing user deletion", { status: 500 });
    }
  }

  return new NextResponse("", { status: 200 });
}
