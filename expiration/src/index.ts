import { Kafka } from "kafkajs";
import { Publishers } from "./events/publishers/publishers";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { ExpirationCompletePublisher } from "./events/publishers/expiration-complete-publisher";

const start = async () => {
  try {
    if (!process.env.KAFKA_CLIENT_ID) {
      throw new Error("no KAFKA_CLIENT_ID");
    }
    if (!process.env.BROKER_URL) {
      throw new Error("no KAFKA_BROKERS");
    }

    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.BROKER_URL],
    });

    // create the publishers
    const expirationCompletePublisher = new ExpirationCompletePublisher(kafka);

    // Register the publishers

    Publishers.registerPublisher(
      "expiration-complete",
      expirationCompletePublisher
    );

    const listeners = [new OrderCreatedListener(kafka, "expiration-srv")];

    // Connect all publishers
    await Publishers.connect();
    console.log("publishers connected");
    // Register the listener

    await Promise.all(listeners.map((listener) => listener.listen()));
    console.log("Listeners are listening for events");
  } catch (err) {
    console.log(err);
  }
};

start();
