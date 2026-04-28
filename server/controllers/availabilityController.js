const Booking = require("../models/Booking");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { BLOCKING_STATUSES, WORK_START, WORK_END } = require("../constants/booking");
const { isWeekday, buildHourlySlots } = require("../utils/time");
const { findRoomByIdOrSlug, serializeRoom } = require("./roomController");

const getAvailability = asyncHandler(async (req, res) => {
  const { roomId, date } = req.query;

  if (!roomId) throw httpError(400, "roomId is required.");
  if (!isWeekday(date)) throw httpError(400, "Date must be a weekday in YYYY-MM-DD format.");

  const room = await findRoomByIdOrSlug(roomId);
  if (!room) throw httpError(404, "Room not found.");

  const bookings = await Booking.find({
    room: room._id,
    date,
    status: { $in: BLOCKING_STATUSES },
  }).sort({ startTime: 1 });

  const blockedIntervals = bookings.map((booking) => ({
    bookingId: booking.bookingId,
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
  }));

  res.json({
    data: {
      room: serializeRoom(room),
      date,
      workingHours: { start: WORK_START, end: WORK_END },
      blockedIntervals,
      slots: buildHourlySlots(blockedIntervals),
    },
  });
});

module.exports = { getAvailability };
