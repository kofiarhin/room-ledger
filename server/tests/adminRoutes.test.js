const request = require("supertest");
const { app, adminAgent, createBooking } = require("./helpers");

describe("admin routes", () => {
  test("rejects invalid credentials and protected routes without auth", async () => {
    await request(app)
      .post("/api/admin/login")
      .send({ email: "admin@example.com", password: "wrong" })
      .expect(401);

    await request(app).get("/api/admin/bookings").expect(401);
  });

  test("admin can list, approve, deny, edit, and delete bookings", async () => {
    const booking = await createBooking();
    const id = booking.body.data.id;
    const agent = await adminAgent();

    const listRes = await agent.get("/api/admin/bookings").expect(200);
    expect(listRes.body.data).toHaveLength(1);

    const approveRes = await agent.patch(`/api/admin/bookings/${id}/approve`).expect(200);
    expect(approveRes.body.data.status).toBe("approved");

    const editRes = await agent
      .patch(`/api/admin/bookings/${id}`)
      .send({ status: "denied", adminNote: "Room unavailable", durationHours: 1 })
      .expect(200);
    expect(editRes.body.data.status).toBe("denied");

    const denyRes = await agent
      .patch(`/api/admin/bookings/${id}/deny`)
      .send({ adminNote: "Rescheduled" })
      .expect(200);
    expect(denyRes.body.data.adminNote).toBe("Rescheduled");

    await agent.delete(`/api/admin/bookings/${id}`).expect(200);
  });
});
