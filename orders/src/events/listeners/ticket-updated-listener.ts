import { Listener, TicketUpdatedEvent, Topics } from "@kktickets123/common";
import { EachMessagePayload } from "kafkajs";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly topic = Topics.TicketUpdated;
  async eachMessageHandler(
    data: TicketUpdatedEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    console.log("TicketUpdatedListener: Received event", data);

    const ticket = await Ticket.findTicket(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { price, title } = data;
    ticket.set({
      title,
      price,
    });
    await ticket.save();

    await this.consumer.commitOffsets([
      {
        topic: payload.topic,
        partition: payload.partition,
        offset: (Number(payload.message.offset) + 1).toString(),
      },
    ]);
  }
}
