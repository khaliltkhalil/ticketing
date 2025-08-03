import jwt from "jsonwebtoken";

export async function fakeSignup(email = "test@test.com", id = "1234") {
  const payLoad = {
    id,
    email,
  };

  const jwtToken = jwt.sign(payLoad, process.env.JWT_KEY!);

  const session = JSON.stringify({ jwt: jwtToken });

  const base64 = Buffer.from(session).toString("base64");
  const cookie = [`session=${base64}]`];

  return cookie;
}
