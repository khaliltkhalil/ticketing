import {
  Listener,
  ExpirationCompleteEvent,
  Topics,
  NotFoundError,
  OrderStatus,
} from "@kktickets123/common";
import { EachMessagePayload } from "kafkajs";
import { Order } from "../../models/order";
import { Publishers } from "../publishers/publishers";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly topic = Topics.expirationComplete;

  async eachMessageHandler(
    data: ExpirationCompleteEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    console.log("Expiration Complete Event Received:", data);

    // Here you would typically handle the expiration complete event,
    // such as updating the order status in the database.

    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    // only cancel the order if it is not already complete
    // if the order is already complete, we do not want to cancel it
    if (order.status !== OrderStatus.Complete) {
      order.set({ status: OrderStatus.Cancelled });
      await order.save();

      const orderCancelledPublisher =
        Publishers.getPublisher("order-cancelled");

      await orderCancelledPublisher.publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });
    }

    await this.consumer.commitOffsets([
      {
        topic: payload.topic,
        partition: payload.partition,
        offset: (Number(payload.message.offset) + 1).toString(),
      },
    ]);
  }
}
