import request from "supertest";
import { app } from "../../app";

it("fails to signin with wrong email", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.gmail",
      password: "1234567",
    })
    .expect(400);
});

it("fails to signin with wrong password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.gmail",
      password: "1234567",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.gmail",
      password: "1234568",
    })
    .expect(400);
});

it("signin in successfully", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.gmail",
      password: "1234567",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.gmail",
      password: "1234567",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
