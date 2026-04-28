const dotenv = require("dotenv");

dotenv.config();

const isTest = process.env.NODE_ENV === "test";
const configuredClientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: isTest
    ? process.env.MONGO_URI_TEST || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/roomledger-test"
    : process.env.MONGO_URI,
  clientOrigins: configuredClientOrigins,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
};

function validateEnv() {
  const required = ["mongoUri", "adminEmail", "adminPassword", "jwtSecret"];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0 && !isTest) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

module.exports = { config, validateEnv };
