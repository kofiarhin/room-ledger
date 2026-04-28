const Room = require("../models/Room");
const { DEFAULT_ROOMS } = require("../constants/rooms");

async function seedRooms() {
  await Promise.all(
    DEFAULT_ROOMS.map((room) =>
      Room.findOneAndUpdate(
        { slug: room.slug },
        { $setOnInsert: room },
        { upsert: true, returnDocument: "after" }
      )
    )
  );
}

module.exports = seedRooms;
