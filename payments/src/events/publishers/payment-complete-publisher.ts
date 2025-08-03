import { paymentCompleteEvent, Publisher, Topics } from "@kktickets123/common";

export class PaymentCompletePublisher extends Publisher<paymentCompleteEvent> {
  readonly topic = Topics.PaymentComplete;
}
