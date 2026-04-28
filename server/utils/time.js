const {
  WORK_START,
  WORK_END,
  SLOT_INTERVAL_MINUTES,
  VALID_DURATIONS,
} = require("../constants/booking");

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function timeToMinutes(time) {
  const match = TIME_PATTERN.exec(time || "");
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function minutesToTime(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
}

function isHourlyTime(time) {
  const minutes = timeToMinutes(time);
  return minutes !== null && minutes % SLOT_INTERVAL_MINUTES === 0;
}

function calculateEndTime(startTime, durationHours) {
  const start = timeToMinutes(startTime);
  if (start === null) return null;
  return minutesToTime(start + Number(durationHours) * 60);
}

function isWithinWorkingHours(startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return (
    start !== null &&
    end !== null &&
    start >= timeToMinutes(WORK_START) &&
    end <= timeToMinutes(WORK_END) &&
    end > start
  );
}

function isWeekday(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  const day = parsed.getUTCDay();
  return day >= 1 && day <= 5;
}

function buildHourlySlots(blockedIntervals = []) {
  const slots = [];
  const workStart = timeToMinutes(WORK_START);
  const workEnd = timeToMinutes(WORK_END);

  for (let start = workStart; start < workEnd; start += SLOT_INTERVAL_MINUTES) {
    const startTime = minutesToTime(start);
    const durations = VALID_DURATIONS.filter((duration) => {
      const end = start + duration * 60;
      if (end > workEnd) return false;
      return !blockedIntervals.some((blocked) => {
        const blockedStart = timeToMinutes(blocked.startTime);
        const blockedEnd = timeToMinutes(blocked.endTime);
        return start < blockedEnd && end > blockedStart;
      });
    });

    slots.push({ startTime, durations });
  }

  return slots;
}

module.exports = {
  timeToMinutes,
  minutesToTime,
  isHourlyTime,
  calculateEndTime,
  isWithinWorkingHours,
  isWeekday,
  buildHourlySlots,
};
