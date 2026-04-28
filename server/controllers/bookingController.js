const Booking = require("../models/Booking");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { validateBookingPayload } = require("../utils/bookingValidation");
const { findConflictingBooking } = require("../utils/overlap");
const generateBookingId = require("../utils/bookingId");
const { findRoomByIdOrSlug, serializeRoom } = require("./roomController");

function serializeBooking(booking) {
  const room = booking.room && booking.room.name ? serializeRoom(booking.room) : booking.room;
  return {
    id: booking._id.toString(),
    bookingId: booking.bookingId,
    room,
    requesterName: booking.requesterName,
    requesterEmail: booking.requesterEmail,
    requesterPhone: booking.requesterPhone || "",
    department: booking.department,
    purpose: booking.purpose,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    durationHours: booking.durationHours,
    status: booking.status,
    adminNote: booking.adminNote || "",
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

async function normalizeBookingWithRoom(payload) {
  const data = validateBookingPayload(payload);
  const room = await findRoomByIdOrSlug(data.room);
  if (!room) throw httpError(404, "Room not found.");
  return { data, room };
}

async function assertNoConflict({ room, date, startTime, endTime, excludeId }) {
  const conflict = await findConflictingBooking({ room, date, startTime, endTime, excludeId });
  if (conflict) {
    throw httpError(409, "Requested time overlaps an existing booking.", {
      bookingId: conflict.bookingId,
    });
  }
}

const createBooking = asyncHandler(async (req, res) => {
  const { data, room } = await normalizeBookingWithRoom(req.body);
  await assertNoConflict({
    room: room._id,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
  });

  const booking = await Booking.create({
    ...data,
    room: room._id,
    bookingId: await generateBookingId(data.date),
    status: "pending",
  });

  await booking.populate("room");
  res.status(201).json({ data: serializeBooking(booking) });
});

const getBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ bookingId: req.params.bookingId.toUpperCase() }).populate("room");
  if (!booking) throw httpError(404, "Booking not found.");
  res.json({ data: serializeBooking(booking) });
});

const updateBookingByStatusId = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ bookingId: req.params.bookingId.toUpperCase() });
  if (!booking) throw httpError(404, "Booking not found.");
  if (booking.status !== "pending") {
    throw httpError(409, "Only pending bookings can be edited.");
  }

  const merged = {
    room: req.body.room || req.body.roomId || booking.room.toString(),
    requesterName: req.body.requesterName ?? booking.requesterName,
    requesterEmail: req.body.requesterEmail ?? booking.requesterEmail,
    requesterPhone: req.body.requesterPhone ?? booking.requesterPhone,
    department: req.body.department ?? booking.department,
    purpose: req.body.purpose ?? booking.purpose,
    date: req.body.date ?? booking.date,
    startTime: req.body.startTime ?? booking.startTime,
    durationHours: req.body.durationHours ?? booking.durationHours,
  };

  const { data, room } = await normalizeBookingWithRoom(merged);
  await assertNoConflict({
    room: room._id,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    excludeId: booking._id,
  });

  Object.assign(booking, data, { room: room._id });
  await booking.save();
  await booking.populate("room");
  res.json({ data: serializeBooking(booking) });
});

const cancelBookingByStatusId = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ bookingId: req.params.bookingId.toUpperCase() });
  if (!booking) throw httpError(404, "Booking not found.");
  if (booking.status !== "pending") {
    throw httpError(409, "Only pending bookings can be cancelled.");
  }

  booking.status = "cancelled";
  await booking.save();
  await booking.populate("room");
  res.json({ data: serializeBooking(booking) });
});

module.exports = {
  createBooking,
  getBookingStatus,
  updateBookingByStatusId,
  cancelBookingByStatusId,
  serializeBooking,
  assertNoConflict,
};
