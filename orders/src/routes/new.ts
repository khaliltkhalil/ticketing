import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@kktickets123/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { Publishers } from "../events/publishers/publishers";
import { stripe } from "../stripe";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("Ticket ID is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Check if the ticket is already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.ticket.price * 100, // Stripe expects the amount in cents
      currency: "usd",
      metadata: {
        orderId: order.id,
      },
    });
    order.paymentIntent = {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret || undefined,
    };

    await order.save();

    // Publish an event that an order was created
    const orderCreatedPublisher = Publishers.getPublisher("order-created");

    await orderCreatedPublisher.publish({
      id: order.id,
      version: order.version,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
      paymentIntentId: order.paymentIntent.id,
    });

    // Return the order to the client

    res.status(201).send(order);
  }
);

export { router as createOrdersRouter };
