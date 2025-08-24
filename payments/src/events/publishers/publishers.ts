import { Publisher, paymentCompleteEvent } from "@kktickets123/common";

type paymentEvent = paymentCompleteEvent;

export class Publishers {
  private static publishers: {
    [key: string]: Publisher<paymentCompleteEvent>;
  } = {};
  static getPublisher(key: string): Publisher<paymentCompleteEvent> {
    if (!this.publishers[key]) {
      throw new Error(`Publisher for key ${key} not found`);
    }
    return this.publishers[key];
  }
  static registerPublisher(
    key: string,
    publisher: Publisher<paymentCompleteEvent>
  ): void {
    if (this.publishers[key]) {
      throw new Error(`Publisher for key ${key} already exists`);
    }
    this.publishers[key] = publisher;
  }
  static getAllTopics(): string[] {
    return Object.values(this.publishers).map((publisher) => publisher.topic);
  }

  static async connect() {
    await Promise.all(
      Object.values(this.publishers).map((publisher) => publisher.connect())
    );
  }
}
