import mongoose from "mongoose";
import { app } from "./app";
import { Kafka } from "kafkajs";
import { OrderCreatedPublisher } from "./events/publishers/order-created-publisher";
import { OrderCancelledPublisher } from "./events/publishers/order-cancelled-publisher";
import { OrderCompletedPublisher } from "./events/publishers/order-completed-publisher";
import { Publishers } from "./events/publishers/publishers";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCompleteListener } from "./events/listeners/payment-complete-listener";
// import { Publishers } from "./events/publishers/publishers";

const start = async () => {
  console.log("Starting orders service...");
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
    const orderCreatedPublisher = new OrderCreatedPublisher(kafka);
    const orderCancelledPublisher = new OrderCancelledPublisher(kafka);
    const orderCompletedPublisher = new OrderCompletedPublisher(kafka);

    // Register the publishers
    Publishers.registerPublisher("order-created", orderCreatedPublisher);
    Publishers.registerPublisher("order-cancelled", orderCancelledPublisher);
    Publishers.registerPublisher("order-completed", orderCompletedPublisher);

    // Connect all publishers
    await Publishers.connect();
    console.log("publishers connected");

    await new TicketCreatedListener(kafka, "orders-service1").listen();
    await new TicketUpdatedListener(kafka, "orders-service2").listen();

    await new ExpirationCompleteListener(kafka, "orders-service3").listen();

    await new PaymentCompleteListener(kafka, "orders-service4").listen();
    // Start the express app
    app.listen(3000, () => {
      console.log("listening on port 3000!!!");
    });
  } catch (err) {
    console.log(err);
  }
};

start();
