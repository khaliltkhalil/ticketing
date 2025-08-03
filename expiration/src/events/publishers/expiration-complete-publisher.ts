import { Publisher } from "@kktickets123/common";
import { ExpirationCompleteEvent } from "@kktickets123/common";
import { Topics } from "@kktickets123/common";
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly topic = Topics.expirationComplete;
}
