const request = require("supertest");
const app = require("../app");
const Room = require("../models/Room");

async function firstRoom() {
  return Room.findOne({ slug: "conference-room-a" });
}

function validBooking(overrides = {}) {
  return {
    room: overrides.room,
    requesterName: "Mara Whitfield",
    requesterEmail: "mara.whitfield@example.com",
    requesterPhone: "+1 (312) 847-1928",
    department: "IT",
    purpose: "Quarterly infrastructure planning",
    date: "2026-05-04",
    startTime: "08:00",
    durationHours: 2,
    ...overrides,
  };
}

async function createBooking(overrides = {}) {
  const room = overrides.room ? null : await firstRoom();
  return request(app)
    .post("/api/bookings")
    .send(validBooking({ room: room?._id.toString(), ...overrides }));
}

async function adminAgent() {
  const agent = request.agent(app);
  await agent
    .post("/api/admin/login")
    .send({ email: "admin@example.com", password: "admin-pass" })
    .expect(200);
  return agent;
}

module.exports = { app, firstRoom, validBooking, createBooking, adminAgent };
