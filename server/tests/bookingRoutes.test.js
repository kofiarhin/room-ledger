const request = require("supertest");
const { app, createBooking, firstRoom, validBooking } = require("./helpers");

describe("booking routes", () => {
  test("creates a valid pending booking", async () => {
    const room = await firstRoom();
    const res = await request(app)
      .post("/api/bookings")
      .send(validBooking({ room: room._id.toString() }))
      .expect(201);

    expect(res.body.data.bookingId).toMatch(/^RL-/);
    expect(res.body.data.status).toBe("pending");
    expect(res.body.data.requesterPhone).toBe("+1 (312) 847-1928");
  });

  test("rejects non-enum department and non-hourly starts", async () => {
    const room = await firstRoom();
    const res = await request(app)
      .post("/api/bookings")
      .send(validBooking({ room: room._id.toString(), department: "Legal", startTime: "08:30" }))
      .expect(400);

    expect(res.body.details.department).toBeDefined();
    expect(res.body.details.startTime).toBeDefined();
  });

  test("rejects overlaps and allows back-to-back bookings", async () => {
    const room = await firstRoom();
    await createBooking({ room: room._id.toString(), startTime: "08:00", durationHours: 2 });

    await request(app)
      .post("/api/bookings")
      .send(validBooking({ room: room._id.toString(), startTime: "09:00", durationHours: 1 }))
      .expect(409);

    await request(app)
      .post("/api/bookings")
      .send(validBooking({ room: room._id.toString(), startTime: "10:00", durationHours: 1 }))
      .expect(201);
  });

  test("status lookup, pending edit, and pending cancel work", async () => {
    const createRes = await createBooking();
    const bookingId = createRes.body.data.bookingId;

    await request(app).get(`/api/bookings/status/${bookingId}`).expect(200);

    const editRes = await request(app)
      .patch(`/api/bookings/status/${bookingId}`)
      .send({ purpose: "Updated planning", durationHours: 1 })
      .expect(200);

    expect(editRes.body.data.purpose).toBe("Updated planning");

    const cancelRes = await request(app)
      .patch(`/api/bookings/status/${bookingId}/cancel`)
      .expect(200);

    expect(cancelRes.body.data.status).toBe("cancelled");
  });

  test("approved bookings are read-only through public routes", async () => {
    const createRes = await createBooking();
    const bookingId = createRes.body.data.bookingId;
    const id = createRes.body.data.id;
    const agent = await require("./helpers").adminAgent();

    await agent.patch(`/api/admin/bookings/${id}/approve`).expect(200);
    await request(app)
      .patch(`/api/bookings/status/${bookingId}`)
      .send({ purpose: "Cannot update" })
      .expect(409);
    await request(app).patch(`/api/bookings/status/${bookingId}/cancel`).expect(409);
  });
});
