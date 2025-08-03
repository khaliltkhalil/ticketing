import { BadRequestError, OrderStatus } from "@kktickets123/common";
import express, { Request, Response } from "express";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Publishers } from "../events/publishers/publishers";

const router = express.Router();
const endpointSecret = process.env.STRIPE_WHOOK;

router.post(
  "/api/orders/stripe_webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    let event = req.body;
    console.log("Received Stripe webhook event");
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    console.log("Endpoint Secret:", endpointSecret);
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers["stripe-signature"];
      if (!signature) {
        throw new BadRequestError("Missing Stripe signature header");
      }

      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          console.log(
            `PaymentIntent for ${paymentIntent.amount} was successful!`
          );
          const orderId = paymentIntent.metadata.orderId;
          const order = await Order.findById(orderId);
          if (!order) {
            throw new Error("Order not found");
          }
          order.status = OrderStatus.Complete;
          await order.save();
          console.log(`Order ${order.id} status updated to Complete`);
          const orderCompletedPublisher =
            Publishers.getPublisher("order-completed");
          await orderCompletedPublisher.publish({
            id: order.id,
            version: order.version,
            ticket: {
              id: order.ticket.id,
            },
          });

          // Then define and call a method to handle the successful payment intent.
          // handlePaymentIntentSucceeded(paymentIntent);
          break;

        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }
    }
    res.status(201).send({});
  }
);

export { router as stripeWebhookRouter };
