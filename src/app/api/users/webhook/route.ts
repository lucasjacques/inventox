import { db } from '@/db'
import { users } from '@/db/schema'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const eventType = evt.type
    
    if ( eventType === "user.created" ) {
      const data = evt.data
      
      console.log(`Received webhook with ID ${data.id} and event type of ${eventType}`)
      console.log('Webhook payload:', evt.data)
      if (!!data.username) {
        await db.insert(users).values({
          name: data.username || "",
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
        });
      }
      else {
        throw new Error("No username was found.")
      }

    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}