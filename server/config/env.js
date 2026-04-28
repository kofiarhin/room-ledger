const dotenv = require("dotenv");

dotenv.config();

const isTest = process.env.NODE_ENV === "test";

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: isTest
    ? process.env.MONGO_URI_TEST || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/roomledger-test"
    : process.env.MONGO_URI,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  adminEmail: process.env.ADMIN_EMAIL,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
  jwtSecret: process.env.JWT_SECRET,
};

function validateEnv() {
  const required = ["mongoUri", "adminEmail", "adminPasswordHash", "jwtSecret"];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0 && !isTest) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

module.exports = { config, validateEnv };
