import Queue from "bull";
import { Publishers } from "../events/publishers/publishers";

interface ExpirationJobData {
  orderId: string;
}

const expirationQueue = new Queue<ExpirationJobData>("order-expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log("Processing expiration job for order:", job.data.orderId);
  // Here you would typically handle the expiration logic, such as notifying the user or updating the order status.
  const expirationCompletePublisher = Publishers.getPublisher(
    "expiration-complete"
  );
  expirationCompletePublisher.publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
