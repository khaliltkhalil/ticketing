import request from "supertest";
import { fakeSignup } from "../../test/auth-helper";
import { app } from "../../app";
import mongoose from "mongoose";
import { Publishers } from "../../events/publishers/publishers";

it("return 404 if the provided ticket id cannot be found", async () => {
  const cookie = await fakeSignup();
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", cookie)
    .send({ title: "ssgg", price: 45 })
    .expect(404);
});

it("return 401 if the user is not authenticated", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({ title: "ssgg", price: 45 })
    .expect(401);
});
it("return 401 if the user doesn't own the ticket", async () => {
  let cookie = await fakeSignup("test@test.com", "12345");
  // create a new ticket
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 50 })
    .expect(201);

  // different user signup
  cookie = await fakeSignup("test1@test.com", "144555");
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "newTest", price: 45 })
    .expect(401);
});

it("return 400 if the user provided invalid title and price", async () => {
  const cookie = await fakeSignup("test@test.com", "12345");
  // create a new ticket
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 50 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: -45 })
    .expect(400);
});
it("successfully update the tickets", async () => {
  const cookie = await fakeSignup("test@test.com", "12345");
  // create a new ticket
  const newTicketResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 50 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${newTicketResponse.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "newTest", price: 45 })
    .expect(200);

  const updatedTicketResponse = await request(app)
    .get(`/api/tickets/${newTicketResponse.body.id}`)
    .expect(200);

  expect(updatedTicketResponse.body.title).toEqual("newTest");
  expect(updatedTicketResponse.body.price).toEqual(45);
});

it("publishes an event after updating the ticket", async () => {
  const cookie = await fakeSignup("test@test.com", "12345");
  // create a new ticket
  const newTicketResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 50 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${newTicketResponse.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "newTest", price: 45 })
    .expect(200);

  expect(Publishers.getPublisher("ticket-updated").publish).toHaveBeenCalled();
});
