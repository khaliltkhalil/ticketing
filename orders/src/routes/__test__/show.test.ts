import { Ticket } from "../../models/ticket";
import { fakeSignup } from "../../test/auth-helper";
import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("fetch an order successfully", async () => {
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

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
  expect(fetchedOrder.ticket.id).toEqual(ticket.id);
});

it("returns 401 if user does not own the order", async () => {
  const userOneCookie = await fakeSignup();
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 123,
  });
  await ticket.save();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOneCookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  const userTwoCookie = await fakeSignup("test2@test.com", "221234");
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userTwoCookie)
    .expect(401);
});
