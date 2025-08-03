import mongoose from "mongoose";
import { fakeSignup } from "../../test/auth-helper";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@kktickets123/common";
import { Publishers } from "../../events/publishers/publishers";

it("returns an 404 error if the ticket is not found", async () => {
  const cookie = await fakeSignup();
  const ticketId = new mongoose.Types.ObjectId();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns a 400 error if the ticket is already reserved", async () => {
  const cookie = await fakeSignup();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    userId: "123",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserves a ticket successfully", async () => {
  const cookie = await fakeSignup();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const order = await Order.findById(response.body.id).populate("ticket");
  console.log(order);
  expect(order).not.toBeNull();
  expect(order!.status).toEqual(OrderStatus.Created);
  expect(order!.ticket.id).toEqual(ticket.id);
});

it("successfully omits an order created event", async () => {
  const cookie = await fakeSignup();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(Publishers.getPublisher("order-created").publish).toHaveBeenCalled();
});
