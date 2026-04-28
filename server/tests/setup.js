const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.ADMIN_EMAIL = "admin@example.com";
process.env.ADMIN_PASSWORD = "admin123";
process.env.JWT_SECRET = "test-secret";

const connectDb = require("../config/db");
const seedRooms = require("../utils/seedRooms");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI_TEST = mongo.getUri();
  await connectDb(process.env.MONGO_URI_TEST);
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
  await seedRooms();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
