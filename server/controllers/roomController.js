const mongoose = require("mongoose");
const Room = require("../models/Room");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

function serializeRoom(room) {
  return {
    id: room._id.toString(),
    name: room.name,
    slug: room.slug,
    isActive: room.isActive,
  };
}

async function findRoomByIdOrSlug(roomIdOrSlug) {
  const query = mongoose.Types.ObjectId.isValid(roomIdOrSlug)
    ? { _id: roomIdOrSlug, isActive: true }
    : { slug: roomIdOrSlug, isActive: true };
  return Room.findOne(query);
}

const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ isActive: true }).sort({ name: 1 });
  res.json({ data: rooms.map(serializeRoom) });
});

const getRoom = asyncHandler(async (req, res) => {
  const room = await findRoomByIdOrSlug(req.params.roomIdOrSlug);
  if (!room) throw httpError(404, "Room not found.");
  res.json({ data: serializeRoom(room) });
});

module.exports = { getRooms, getRoom, findRoomByIdOrSlug, serializeRoom };
