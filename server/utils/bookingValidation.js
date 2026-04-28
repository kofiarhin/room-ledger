const { DEPARTMENTS, VALID_DURATIONS } = require("../constants/booking");
const httpError = require("./httpError");
const {
  calculateEndTime,
  isHourlyTime,
  isWeekday,
  isWithinWorkingHours,
} = require("./time");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimString(value) {
  return typeof value === "string" ? value.trim() : value;
}

function normalizeBookingPayload(payload) {
  const durationHours = Number(payload.durationHours);
  return {
    room: trimString(payload.room || payload.roomId),
    requesterName: trimString(payload.requesterName),
    requesterEmail: trimString(payload.requesterEmail)?.toLowerCase(),
    requesterPhone: trimString(payload.requesterPhone || ""),
    department: trimString(payload.department),
    purpose: trimString(payload.purpose),
    date: trimString(payload.date),
    startTime: trimString(payload.startTime),
    durationHours,
  };
}

function validateBookingPayload(payload) {
  const data = normalizeBookingPayload(payload);
  const errors = {};

  if (!data.room) errors.room = "Room is required.";
  if (!data.requesterName) errors.requesterName = "Requester name is required.";
  if (!data.requesterEmail || !EMAIL_PATTERN.test(data.requesterEmail)) {
    errors.requesterEmail = "A valid requester email is required.";
  }
  if (data.requesterPhone && data.requesterPhone.length > 30) {
    errors.requesterPhone = "Phone must be 30 characters or fewer.";
  }
  if (!DEPARTMENTS.includes(data.department)) {
    errors.department = "Department must be one of the allowed values.";
  }
  if (!data.purpose) errors.purpose = "Purpose is required.";
  if (!isWeekday(data.date)) errors.date = "Date must be a weekday in YYYY-MM-DD format.";
  if (!isHourlyTime(data.startTime)) errors.startTime = "Start time must be an hourly HH:mm value.";
  if (!VALID_DURATIONS.includes(data.durationHours)) {
    errors.durationHours = "Duration must be a valid whole-hour duration.";
  }

  const endTime = calculateEndTime(data.startTime, data.durationHours);
  if (!endTime || !isWithinWorkingHours(data.startTime, endTime)) {
    errors.time = "Booking must stay within working hours.";
  }

  if (Object.keys(errors).length > 0) {
    throw httpError(400, "Booking validation failed.", errors);
  }

  return { ...data, endTime };
}

module.exports = { validateBookingPayload, DEPARTMENTS };
