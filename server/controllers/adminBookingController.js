const Booking = require("../models/Booking");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { validateBookingPayload } = require("../utils/bookingValidation");
const { findRoomByIdOrSlug } = require("./roomController");
const { serializeBooking, assertNoConflict } = require("./bookingController");

const getAdminBookings = asyncHandler(async (req, res) => {
  const { status, roomId, date, q } = req.query;
  const query = {};

  if (status) query.status = status;
  if (date) query.date = date;
  if (roomId) {
    const room = await findRoomByIdOrSlug(roomId);
    if (!room) throw httpError(404, "Room not found.");
    query.room = room._id;
  }
  if (q) {
    query.$or = [
      { bookingId: new RegExp(q, "i") },
      { requesterName: new RegExp(q, "i") },
      { requesterEmail: new RegExp(q, "i") },
      { department: new RegExp(q, "i") },
    ];
  }

  const bookings = await Booking.find(query).populate("room").sort({ createdAt: -1 });
  res.json({ data: bookings.map(serializeBooking) });
});

async function buildAdminUpdate(booking, body) {
  const merged = {
    room: body.room || body.roomId || booking.room.toString(),
    requesterName: body.requesterName ?? booking.requesterName,
    requesterEmail: body.requesterEmail ?? booking.requesterEmail,
    requesterPhone: body.requesterPhone ?? booking.requesterPhone,
    department: body.department ?? booking.department,
    purpose: body.purpose ?? booking.purpose,
    date: body.date ?? booking.date,
    startTime: body.startTime ?? booking.startTime,
    durationHours: body.durationHours ?? booking.durationHours,
  };

  const data = validateBookingPayload(merged);
  const room = await findRoomByIdOrSlug(data.room);
  if (!room) throw httpError(404, "Room not found.");
  return { data, room };
}

const updateAdminBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw httpError(404, "Booking not found.");

  const { data, room } = await buildAdminUpdate(booking, req.body);
  const nextStatus = req.body.status || booking.status;

  if (["pending", "approved"].includes(nextStatus)) {
    await assertNoConflict({
      room: room._id,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      excludeId: booking._id,
    });
  }

  Object.assign(booking, data, {
    room: room._id,
    status: nextStatus,
    adminNote: req.body.adminNote ?? booking.adminNote,
  });
  await booking.save();
  await booking.populate("room");
  res.json({ data: serializeBooking(booking) });
});

const approveBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw httpError(404, "Booking not found.");

  await assertNoConflict({
    room: booking.room,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    excludeId: booking._id,
  });

  booking.status = "approved";
  await booking.save();
  await booking.populate("room");
  res.json({ data: serializeBooking(booking) });
});

const denyBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw httpError(404, "Booking not found.");

  booking.status = "denied";
  booking.adminNote = req.body.adminNote || "";
  await booking.save();
  await booking.populate("room");
  res.json({ data: serializeBooking(booking) });
});

const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) throw httpError(404, "Booking not found.");
  res.json({ data: { ok: true } });
});

module.exports = {
  getAdminBookings,
  updateAdminBooking,
  approveBooking,
  denyBooking,
  deleteBooking,
};
