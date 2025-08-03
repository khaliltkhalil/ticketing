import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@kktickets123/common";
import { Order } from "../models/order";
import { requireAuth } from "@kktickets123/common";
import { Publishers } from "../events/publishers/publishers";

const router = express.Router();

router.patch(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError("not authorized to cancel this order");
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    //publish order cancelled event
    const orderCancelledPublisher = Publishers.getPublisher("order-cancelled");

    await orderCancelledPublisher.publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.send(order);
  }
);

export { router as cancelOrdersRouter };
