import { OrderCancelledEvent, Topics } from "@kktickets123/common";
import { Publisher } from "@kktickets123/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;
}
