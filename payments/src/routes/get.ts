import express, { Request, Response } from "express";
import { requireAuth } from "@kktickets123/common";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";

const router = express.Router();

router.get(
  "/api/payments",
  requireAuth,
  async (req: Request, res: Response) => {
    const orderId = req.query.orderId;
    const payment = await Payment.findOne({
      orderId,
    });
    if (!payment) {
      throw new Error("Payment not found");
    }
    // const paymentIntent = await stripe.paymentIntents.retrieve(
    //   payment.paymentIntentId
    // );
    res.send(payment);
  }
);

export { router as getRouter };
