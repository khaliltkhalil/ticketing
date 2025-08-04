import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import "dotenv/config";
jest.mock("../events/publishers/publishers");

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdfghhh";
  mongo = await MongoMemoryServer.create();

  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
