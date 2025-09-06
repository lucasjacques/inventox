import { db } from '@/db'
import { users } from '@/db/schema'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const eventType = evt.type
    if ( eventType === "user.created" ) {
      const { data } = evt;
      
      if (!data.username) {
        return new Response("Missing username", { status: 400 });
      }
      await db.insert(users).values({
        name: data.username,
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      });
    }

    if ( eventType === "user.deleted" ) {
      const { data } = evt;

      if (!data.id) {
        return new Response("Missing user id", { status: 400 });
      }

      await db.delete(users).where(eq(users.clerkId, data.id));
    }

    if ( eventType === "user.updated" ) {
      const { data } = evt;

      if (!data.username) {
        return new Response("Missing username", { status: 400 });
      }

      await db
        .update(users)
        .set({
          name: data.username,
          email: data.email_addresses[0].email_address,
          imageUrl: data.image_url,
        })
        .where(eq(users.clerkId, data.id));
    }
    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}