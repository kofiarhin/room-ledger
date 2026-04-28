const Booking = require("../models/Booking");

function randomSegment() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

async function generateBookingId(date) {
  const datePart = (date || new Date().toISOString().slice(0, 10)).replaceAll("-", "");

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const bookingId = `RL-${datePart}-${randomSegment()}`;
    const existing = await Booking.exists({ bookingId });
    if (!existing) return bookingId;
  }

  return `RL-${datePart}-${Date.now().toString(36).toUpperCase()}`;
}

module.exports = generateBookingId;
