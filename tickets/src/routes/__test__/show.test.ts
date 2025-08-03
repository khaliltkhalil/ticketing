import request from "supertest";
import { app } from "../../app";
import { fakeSignup } from "../../test/auth-helper";
import mongoose from "mongoose";

it("returns 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const cookie = await fakeSignup();
  const title = "test";
  const price = 123;
  const { body } = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });
  console.log("body", body);

  const responseTicket = await request(app)
    .get(`/api/tickets/${body.id}`)
    .send()
    .expect(200);

  expect(responseTicket.body.title).toEqual(title);
  expect(responseTicket.body.price).toEqual(price);
});
