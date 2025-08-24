import { ExpirationCompleteEvent, Publisher } from "@kktickets123/common";

type expirationEvent = ExpirationCompleteEvent;

export class Publishers {
  private static publishers: { [key: string]: Publisher<expirationEvent> } = {};
  static getPublisher(key: string): Publisher<expirationEvent> {
    if (!this.publishers[key]) {
      throw new Error(`Publisher for key ${key} not found`);
    }
    return this.publishers[key];
  }
  static registerPublisher(
    key: string,
    publisher: Publisher<expirationEvent>
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
