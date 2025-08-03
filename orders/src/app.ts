import express from "express";
require("express-async-errors");
import { json } from "body-parser";
import {
  currentUser,
  errorHandling,
  NotFoundError,
} from "@kktickets123/common";
import cookieSession from "cookie-session";
import { indexOrdersRouter } from "./routes";
import { createOrdersRouter } from "./routes/new";
import { showOrdersRouter } from "./routes/show";
import { cancelOrdersRouter } from "./routes/cancel";
import { stripeWebhookRouter } from "./routes/stripe-webhook";

const app = express();
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(stripeWebhookRouter);
app.use(json());
app.use(currentUser);
app.use(indexOrdersRouter);
app.use(createOrdersRouter);
app.use(showOrdersRouter);
app.use(cancelOrdersRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandling);

export { app };
