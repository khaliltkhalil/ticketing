import {
  Listener,
  OrderStatus,
  paymentCompleteEvent,
  Topics,
} from "@kktickets123/common";
import { EachMessagePayload } from "kafkajs";
import { Order } from "../../models/order";

export class PaymentCompleteListener extends Listener<paymentCompleteEvent> {
  readonly topic = Topics.PaymentComplete;

  async eachMessageHandler(
    data: paymentCompleteEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    console.log("PaymentCompleteListener received data:", data);
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    await this.consumer.commitOffsets([
      {
        topic: payload.topic,
        partition: payload.partition,
        offset: (Number(payload.message.offset) + 1).toString(),
      },
    ]);
  }
}
