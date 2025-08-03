import { Publisher } from "@kktickets123/common";
import { Topics } from "@kktickets123/common";
import { TicketCreatedEvent } from "@kktickets123/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly topic = Topics.TicketCreated;
}
