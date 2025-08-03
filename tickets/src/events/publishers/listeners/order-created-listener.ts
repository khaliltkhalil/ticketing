import { Listener } from "@kktickets123/common";
import { OrderCreatedEvent, Topics } from "@kktickets123/common";
import { EachMessagePayload } from "kafkajs";
import { Ticket } from "../../../models/ticket";
import { Publishers } from "../publishers";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;

  async eachMessageHandler(
    data: OrderCreatedEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    console.log("OrderCreatedListener: Received event", data);

    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as reserved
    ticket.orderId = data.id;
    await ticket.save();

    const ticketUpdatedPublisher = Publishers.getPublisher("ticket-updated");

    await ticketUpdatedPublisher.publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    await this.consumer.commitOffsets([
      {
        topic: payload.topic,
        partition: payload.partition,
        offset: (Number(payload.message.offset) + 1).toString(),
      },
    ]);
  }
}
