const mongoose = require("mongoose");
const { config } = require("./env");

async function connectDb(uri = config.mongoUri) {
  if (!uri) {
    throw new Error("MongoDB connection string is required.");
  }

  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = connectDb;
