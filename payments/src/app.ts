import express from "express";
require("express-async-errors");
import { json } from "body-parser";
import {
  currentUser,
  errorHandling,
  NotFoundError,
} from "@kktickets123/common";
import cookieSession from "cookie-session";
// import { createChargeRouter } from "./routes/new";
import { checkoutRouter } from "./routes/checkout";
import { getRouter } from "./routes/get";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
//app.use(createChargeRouter);
app.use(getRouter);
app.use(checkoutRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandling);

export { app };
