import request from "supertest";
import { fakeSignup } from "../../test/auth-helper";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
it("successfully rerive the orders for a user", async () => {
  const userOneCookie = await fakeSignup("test@test.com", "1234");
  const userTwoCookie = await fakeSignup("test2@test.com", "5678");
  const ticketOne = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticketOne.save();
  const ticketTwo = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "football",
    price: 30,
  });
  await ticketTwo.save();
  const ticketThree = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticketThree.save();

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOneCookie)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOneCookie)
    .send({
      ticketId: ticketTwo.id,
    })
    .expect(201);
  const { body: orderThree } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwoCookie)
    .send({
      ticketId: ticketThree.id,
    })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userOneCookie)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketOne.id);
  expect(response.body[1].ticket.id).toEqual(ticketTwo.id);
});
