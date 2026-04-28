const request = require("supertest");
const { app, firstRoom } = require("./helpers");

describe("room routes", () => {
  test("returns active rooms", async () => {
    const res = await request(app).get("/api/rooms").expect(200);

    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toHaveProperty("slug");
  });

  test("returns one room by slug and by id", async () => {
    const room = await firstRoom();

    const bySlug = await request(app).get("/api/rooms/conference-room-a").expect(200);
    const byId = await request(app).get(`/api/rooms/${room._id}`).expect(200);

    expect(bySlug.body.data.slug).toBe("conference-room-a");
    expect(byId.body.data.slug).toBe("conference-room-a");
  });
});
