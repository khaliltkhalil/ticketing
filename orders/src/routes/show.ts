import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { NotAuthorizedError, NotFoundError } from "@kktickets123/common";

const router = express.Router();

router.get("/api/orders/:orderId", async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError("not authorized to view this order");
  }

  res.send(order);
});

export { router as showOrdersRouter };
