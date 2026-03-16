import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import type { Plan } from "@prisma/client";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan as Plan | undefined;

        if (userId && plan) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan,
              stripeSubscriptionId: session.subscription as string,
              stripeCustomerId: session.customer as string,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await prisma.user.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          // Check if subscription is active
          if (subscription.status === "active") {
            // Determine plan from price
            const priceId = subscription.items.data[0]?.price.id;
            let plan: Plan = "FREE";
            if (priceId === process.env.STRIPE_PRO_PRICE_ID) plan = "PRO";
            if (priceId === process.env.STRIPE_TEAM_PRICE_ID) plan = "TEAM";

            await prisma.user.update({
              where: { id: user.id },
              data: { plan },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await prisma.user.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "FREE",
              stripeSubscriptionId: null,
            },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
