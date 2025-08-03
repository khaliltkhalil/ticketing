import { Listener, TicketCreatedEvent, Topics } from "@kktickets123/common";
import { EachMessagePayload } from "kafkajs";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly topic = Topics.TicketCreated;
  async eachMessageHandler(
    data: TicketCreatedEvent["data"],
    payload: EachMessagePayload
  ): Promise<void> {
    console.log("TicketCreatedListener: Received event", data);
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
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
