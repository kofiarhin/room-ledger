const app = require("./app");
const connectDb = require("./config/db");
const { config, validateEnv } = require("./config/env");
const seedRooms = require("./utils/seedRooms");

async function start() {
  validateEnv();
  await connectDb();
  await seedRooms();

  app.listen(config.port, () => {
    console.log("server started on port:", config.port);
  });
}

start().catch((error) => {
  console.error("server failed to start:", error.message);
  process.exit(1);
});
