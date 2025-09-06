import { db } from '@/db'
import { users } from '@/db/schema'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    console.log("vercel check1")
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const eventType = evt.type
    console.log("vercel check2")
    if ( eventType === "user.created" ) {
      console.log("vercel check3")
      const { data } = evt;
      
      if (!data.username) {
        return new Response("Missing username", { status: 400 });
      }
      console.log("vercel check4")
      await db.insert(users).values({
        name: data.username,
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      });
      console.log("vercel check5")
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
    console.log("vercel checK6")
    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.log("vercel check7")
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}