import request from "supertest";
import { app } from "../../app";

it("returns 201 on successful sign up", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.gmail",
      password: "1234567",
    })
    .expect(201);
});

it("returns a 400 with a invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.gmail",
      password: "1234567",
    })
    .expect(400);
});

it("returns a 400 with a invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.gmail",
      password: "123",
    })
    .expect(400);
});

it("returns a 400 with missing  email or password ", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "1234567",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "1234567",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.gmail",
      password: "1234567",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.gmail",
      password: "1234567",
    })
    .expect(400);
});

it("set cookie after a successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.gmail",
      password: "1234567",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
