import request from "supertest";
import { app } from "../app";
export async function signup(email: string, password: string) {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  return response.get("Set-Cookie");
}
