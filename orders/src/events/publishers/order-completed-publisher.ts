import { OrderCompletedEvent, Publisher, Topics } from "@kktickets123/common";

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
  readonly topic = Topics.OrderCompleted;
}
