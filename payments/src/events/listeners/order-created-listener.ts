import { OrderStatus, Topics } from "@kktickets123/common";
import { Listener, OrderCreatedEvent } from "@kktickets123/common";
import { EachMessagePayload } from "kafkajs";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;

  async eachMessageHandler(
    data: OrderCreatedEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    console.log("Order Created Event received", data);
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      price: data.ticket.price,
      version: data.version,
    });

    await order.save();

    const payment = Payment.build({
      paymentIntentId: data.paymentIntentId,
      orderId: order.id,
    });
    await payment.save();

    await this.consumer.commitOffsets([
      {
        topic: payload.topic,
        partition: payload.partition,
        offset: (Number(payload.message.offset) + 1).toString(),
      },
    ]);
  }
}
