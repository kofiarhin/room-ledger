const WORK_START = "08:00";
const WORK_END = "17:00";
const SLOT_INTERVAL_MINUTES = 60;
const VALID_DURATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const BOOKING_STATUSES = ["pending", "approved", "denied", "cancelled"];
const BLOCKING_STATUSES = ["pending", "approved"];
const DEPARTMENTS = [
  "HR",
  "Finance",
  "IT",
  "Operations",
  "Marketing",
  "Sales",
  "Management",
  "Other",
];

module.exports = {
  WORK_START,
  WORK_END,
  SLOT_INTERVAL_MINUTES,
  VALID_DURATIONS,
  BOOKING_STATUSES,
  BLOCKING_STATUSES,
  DEPARTMENTS,
};
