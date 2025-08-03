import {
  Listener,
  OrderCompletedEvent,
  Topics,
  OrderStatus,
} from "@kktickets123/common";
import { EachMessagePayload } from "kafkajs";
import { Order } from "../../models/order";

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
  readonly topic = Topics.OrderCompleted;

  async eachMessageHandler(
    data: OrderCompletedEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    console.log("Order Completed Event received", data);
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
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
