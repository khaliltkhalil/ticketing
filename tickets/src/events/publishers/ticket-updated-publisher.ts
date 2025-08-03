import { Topics } from "@kktickets123/common";
import { Publisher } from "@kktickets123/common";
import { TicketUpdatedEvent } from "@kktickets123/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly topic = Topics.TicketUpdated;
}
