import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
  console.log("Starting auth service...");
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("no JWT_KEY");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("no MONGO_URI");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to db");
    app.listen(3000, () => {
      console.log("listening on port 3000!!!");
    });
  } catch (err) {
    console.log(err);
  }
};

start();
