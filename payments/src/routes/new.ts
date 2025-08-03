// import express, { Request, Response } from "express";
// import {
//   BadRequestError,
//   NotAuthorizedError,
//   NotFoundError,
//   requireAuth,
//   validateRequest,
// } from "@kktickets123/common";
// import { body } from "express-validator";
// import { Order } from "../models/order";
// import { stripe } from "../stripe";
// import { Payment } from "../models/payment";
// import { Publishers } from "../events/publishers/publishers";

// const router = express.Router();

// router.post(
//   "/api/payments",
//   requireAuth,
//   [
//     body("orderId").not().isEmpty().withMessage("Order ID is required"),
//   ],
//   validateRequest,
//   async (req: Request, res: Response) => {
//     const { orderId } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       throw new NotFoundError();
//     }
//     if (order.userId !== req.currentUser!.id) {
//       throw new NotAuthorizedError(
//         "You are not authorized to make this payment"
//       );
//     }

//     console.log("Order found:", order);

//     if (order.status === "cancelled") {
//       throw new BadRequestError("Cannot pay for a cancelled order");
//     }

//      const paymentIntent = await stripe.paymentIntents.create({
//       amount: order.price * 100, // Stripe expects the amount in cents
//       currency: "usd",
//       metadata: {
//         orderId: order.id,
//       },
//     });

//     const payment = Payment.build({
//       paymentIntentId: paymentIntent.id,
//       orderId: order.id,
//     });
//     await payment.save();

//     const payment = Payment.build({
//       orderId,
//       chargeId: charge.id,
//     });
//     await payment.save();

//     const paymentCompletePublisher =
//       Publishers.getPublisher("payment-complete");

//     await paymentCompletePublisher.publish({
//       id: payment.id,
//       orderId: payment.orderId,
//       chargeId: payment.chargeId,
//     });

//     res.status(201).send(payment);
//   }
// );

// export { router as createChargeRouter };
