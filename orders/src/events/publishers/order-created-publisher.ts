import { OrderCreatedEvent, Topics } from "@kktickets123/common";
import { Publisher } from "@kktickets123/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;
}
