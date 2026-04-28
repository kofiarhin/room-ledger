const request = require("supertest");
const { app, createBooking, firstRoom } = require("./helpers");

describe("availability routes", () => {
  test("rejects weekend dates", async () => {
    const room = await firstRoom();

    const res = await request(app)
      .get(`/api/availability?roomId=${room._id}&date=2026-05-02`)
      .expect(400);

    expect(res.body.message).toMatch(/Date must be a weekday/);
  });

  test("returns hourly slots and blocked intervals", async () => {
    const room = await firstRoom();
    await createBooking({ room: room._id.toString(), startTime: "08:00", durationHours: 2 });

    const res = await request(app)
      .get(`/api/availability?roomId=${room.slug}&date=2026-05-04`)
      .expect(200);

    expect(res.body.data.slots[0]).toEqual({ startTime: "08:00", durations: [] });
    expect(res.body.data.slots[2].startTime).toBe("10:00");
    expect(res.body.data.slots[2].durations).toContain(1);
    expect(res.body.data.blockedIntervals).toHaveLength(1);
  });
});
