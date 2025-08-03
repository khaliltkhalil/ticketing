import request from "supertest";
import { app } from "../../app";
import { fakeSignup } from "../../test/auth-helper";
import { Ticket } from "../../models/ticket";
import { Publishers } from "../../events/publishers/publishers";

it("has a route handler for creating tickets", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("doesn't return 401 with valid cookies", async () => {
  const cookie = await fakeSignup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
  const cookie = await fakeSignup();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 12,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: 12,
    })
    .expect(400);
});
it("returns an error if invalid price is provided ", async () => {
  const cookie = await fakeSignup();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "fwfwwf",
      price: -12,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "wdwwd",
    })
    .expect(400);
});

it("creates a ticket with valid parameters", async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  const title = "test";
  const price = 40;
  const cookie = await fakeSignup();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

it("publishes an event", async () => {
  const title = "test";
  const price = 40;
  const cookie = await fakeSignup();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  // Check if the event was published
  console.log("Publishers", Publishers.getPublisher("ticket-created"));
  expect(Publishers.getPublisher("ticket-created").publish).toHaveBeenCalled();
});
