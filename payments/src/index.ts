import mongoose from "mongoose";
import { app } from "./app";
import { Kafka } from "kafkajs";
import { Publishers } from "./events/publishers/publishers";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { PaymentCompletePublisher } from "./events/publishers/payment-complete-publisher";
import { OrderCompletedListener } from "./events/listeners/order-completerd-lisrener";

const start = async () => {
  console.log("Starting payments service.....");
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

    //create the publishers
    const paymentCompletePublisher = new PaymentCompletePublisher(kafka);
    // const ticketUpdatedPublisher = new TicketUpdatedPublisher(kafka);

    // Register the publishers
    Publishers.registerPublisher("payment-complete", paymentCompletePublisher);
    // Publishers.registerPublisher("ticket-updated", ticketUpdatedPublisher);

    const listeners = [
      new OrderCreatedListener(kafka, "payment-service"),
      new OrderCancelledListener(kafka, "payment-service1"),
      new OrderCompletedListener(kafka, "payment-service2"),
    ];

    // Connect all publishers
    await Publishers.connect();
    console.log("publishers connected");

    await Promise.all(listeners.map((listener) => listener.listen()));
    console.log("listeners connected");
    // Start the express app
    app.listen(3000, () => {
      console.log("listening on port 3000!!!");
    });
  } catch (err) {
    console.log(err);
  }
};

start();
