import request from "supertest";
import { app } from "../../app";
import { signup } from "../../test/auth-helper";

it("responds with details about the current users", async () => {
  const cookie = await signup("test@test.com", "1234567");

  if (!cookie) {
    throw new Error("No cookie were set");
  }

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app).get("/api/users/currentuser").expect(200);

  expect(response.body.currentUser).toEqual(null);
});
