import {
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@kktickets123/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import {
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
} from "@kktickets123/common";

const router = express.Router();

router.post(
  "/api/payments/checkout",
  requireAuth,
  [
    body("amount").not().isEmpty().withMessage("amount is required"),
    body("currency").not().isEmpty().withMessage("currency is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError(
        "You are not authorized to make this payment"
      );
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }
    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError("Cannot pay for a completed order");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100, // Stripe expects the amount in cents
      currency: "usd",
      customer: req.currentUser!.id,
      metadata: {
        orderId: order.id,
      },
    });

    res.status(201).send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  }
);

export { router as checkoutRouter };
