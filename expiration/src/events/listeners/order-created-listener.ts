import { Listener, OrderCreatedEvent, Topics } from "@kktickets123/common";
import { EachMessagePayload } from "kafkajs";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;

  async eachMessageHandler(
    data: OrderCreatedEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    console.log("Order Created Event Received:", data);

    await expirationQueue.add(
      { orderId: data.id },
      {
        delay: new Date(data.expiresAt).getTime() - new Date().getTime(),
      }
    );

    await this.consumer.commitOffsets([
      {
        topic: payload.topic,
        partition: payload.partition,
        offset: (Number(payload.message.offset) + 1).toString(),
      },
    ]);
  }
}
