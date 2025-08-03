import { Listener } from "@kktickets123/common";
import { OrderCancelledEvent, Topics } from "@kktickets123/common";
import { EachMessagePayload } from "kafkajs";
import { Ticket } from "../../../models/ticket";
import { Publishers } from "../publishers";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;

  async eachMessageHandler(
    data: OrderCancelledEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    console.log("OrderCancelledListener: Received event", data);

    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // Mark the ticket as available
    ticket.orderId = undefined;
    await ticket.save();

    const ticketUpdatedPublisher = Publishers.getPublisher("ticket-updated");
    await ticketUpdatedPublisher.publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId, // This will be undefined
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
