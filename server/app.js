const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { config } = require("./config/env");
const roomRoutes = require("./routes/roomRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const localDevOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):517\d$/;

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (config.clientOrigins.includes(origin)) return true;
  return config.nodeEnv !== "production" && localDevOriginPattern.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Origin not allowed by CORS."));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res, next) => {
  return res.json({ message: "welcome to room ledger api" });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/rooms", roomRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
