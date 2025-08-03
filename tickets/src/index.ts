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
    // create the publishers
    const ticketCreatedPublisher = new TicketCreatedPublisher(kafka);
    const ticketUpdatedPublisher = new TicketUpdatedPublisher(kafka);

    // Register the publishers
    Publishers.registerPublisher("ticket-created", ticketCreatedPublisher);
    Publishers.registerPublisher("ticket-updated", ticketUpdatedPublisher);

    await new OrderCreatedListener(kafka, "order-created-service").listen();
    await new OrderCancelledListener(kafka, "order-cancelled-service").listen();

    // Connect all publishers
    await Publishers.connect();
    console.log("publishers connected");
    // Start the express app
    app.listen(3000, () => {
      console.log("listening on port 3000!!!");
    });
  } catch (err) {
    console.log(err);
  }
};

start();
