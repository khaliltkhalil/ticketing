import request from "supertest";
import { app } from "../../app";
import { fakeSignup } from "../../test/auth-helper";
import { Ticket } from "../../models/ticket";

const createTicket = async () => {
  const cookie = await fakeSignup();
  return request(app).post("/api/tickets").set("Cookie", cookie).send({
    title: "egewg",
    price: 12,
  });
};

it("returns a list of all tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send({}).expect(200);

  expect(response.body.length).toEqual(3);
});
