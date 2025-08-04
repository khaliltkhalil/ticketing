import request from "supertest";
import { app } from "../../app";
import mongoose, { version } from "mongoose";
import { fakeSignup } from "../../test/auth-helper";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
import { OrderStatus } from "@kktickets123/common";

it("return payment", async () => {
  const cookie = await fakeSignup();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 20,
    version: 0,
  });
  await order.save();

  const payment = Payment.build({
    paymentIntentId: new mongoose.Types.ObjectId().toHexString(),
    orderId: order.id,
  });
  await payment.save();

  await request(app)
    .get(`/api/payments?orderId=${order.id}`)
    .set("Cookie", cookie)
    .expect(200);
});

// it("return 401 if the user doesn't own the order", async () => {
//   const order = new Order({
//     userId: new mongoose.Types.ObjectId().toHexString(),
//     status: "created",
//     price: 20,
//     version: 0,
//   });
//   await order.save();
//   const cookie = await fakeSignup();
//   await request(app)
//     .post("/api/payments")
//     .set("Cookie", cookie)
//     .send({
//       orderId: order.id,
//       token: "tok_visa",
//     })
//     .expect(401);
// });

// it("return 404 if the order is cancelled", async () => {
//   const userId = new mongoose.Types.ObjectId().toHexString();
//   const order = new Order({
//     userId,
//     status: "cancelled",
//     price: 20,
//     version: 0,
//   });
//   await order.save();
//   const cookie = await fakeSignup("test@test.com", userId);
//   await request(app)
//     .post("/api/payments")
//     .set("Cookie", cookie)
//     .send({
//       orderId: order.id,
//       token: "tok_visa",
//     })
//     .expect(400);
// });
