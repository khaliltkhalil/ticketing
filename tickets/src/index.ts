import mongoose from "mongoose";
import { app } from "./app";
import { Kafka } from "kafkajs";
import { Publishers } from "./events/publishers/publishers";
import { TicketCreatedPublisher } from "./events/publishers/ticket-created-publisher";
import { TicketUpdatedPublisher } from "./events/publishers/ticket-updated-publisher";
import { OrderCreatedListener } from "./events/publishers/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/publishers/listeners/order-cancelled-listener";
const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("no JWT_KEY");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("no MONGO_URI");
    }

    if (!process.env.KAFKA_CLIENT_ID) {
      throw new Error("no KAFKA_CLIENT_ID");
    }
    if (!process.env.BROKER_URL) {
      throw new Error("no KAFKA_BROKERS");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to db");

    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.BROKER_URL],
    });

    const ticketCreatedPublisher = new TicketCreatedPublisher(kafka);
    const ticketUpdatedPublisher = new TicketUpdatedPublisher(kafka);

    // Register the publishers
    Publishers.registerPublisher("ticket-created", ticketCreatedPublisher);
    Publishers.registerPublisher("ticket-updated", ticketUpdatedPublisher);

    const listeners = [
      new OrderCreatedListener(kafka, "ticket-service"),
      new OrderCancelledListener(kafka, "ticket-service1"),
    ];

    // Connect all publishers
    await Publishers.connect();
    console.log("publishers connected");

    await Promise.all(listeners.map((listener) => listener.listen()));

    // Start the express app
    app.listen(3000, () => {
      console.log("listening on port 3000!!!");
    });
  } catch (err) {
    console.log(err);
  }
};

start();
