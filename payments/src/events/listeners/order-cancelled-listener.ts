import {
  Listener,
  OrderCancelledEvent,
  Topics,
  OrderStatus,
} from "@kktickets123/common";
import { EachMessagePayload } from "kafkajs";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;

  async eachMessageHandler(
    data: OrderCancelledEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    console.log("Order Cancelled Event received", data);

    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    const payment = await Payment.findOne({
      orderId: order.id,
    });

    if (!payment) {
      throw new Error("PaymentIntent not found for the order");
    }

    await stripe.paymentIntents.cancel(payment.paymentIntentId);

    await this.consumer.commitOffsets([
      {
        topic: payload.topic,
        partition: payload.partition,
        offset: (Number(payload.message.offset) + 1).toString(),
      },
    ]);
  }
}
