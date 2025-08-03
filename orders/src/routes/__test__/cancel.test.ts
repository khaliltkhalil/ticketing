import request from "supertest";
import { fakeSignup } from "../../test/auth-helper";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@kktickets123/common";
import { Publishers } from "../../events/publishers/publishers";
import mongoose from "mongoose";

it("cancel the order successfully", async () => {
  const cookie = await fakeSignup();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 123,
  });
  await ticket.save();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const { body: cancelledOrder } = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

it("successfully publishes an order cancelled event", async () => {
  const cookie = await fakeSignup();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 123,
  });
  await ticket.save();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const { body: cancelledOrder } = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(Publishers.getPublisher("order-cancelled").publish).toHaveBeenCalled();
});
