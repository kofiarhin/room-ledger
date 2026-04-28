const Booking = require("../models/Booking");
const { BLOCKING_STATUSES } = require("../constants/booking");
const { timeToMinutes } = require("./time");

async function findConflictingBooking({ room, date, startTime, endTime, excludeId }) {
  const query = {
    room,
    date,
    status: { $in: BLOCKING_STATUSES },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const bookings = await Booking.find(query).select("bookingId startTime endTime status");
  const newStart = timeToMinutes(startTime);
  const newEnd = timeToMinutes(endTime);

  return bookings.find((booking) => {
    const existingStart = timeToMinutes(booking.startTime);
    const existingEnd = timeToMinutes(booking.endTime);
    return newStart < existingEnd && newEnd > existingStart;
  });
}

module.exports = { findConflictingBooking };
