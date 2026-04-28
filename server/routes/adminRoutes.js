const express = require("express");
const { getCurrentAdmin, loginAdmin, logoutAdmin } = require("../controllers/adminAuthController");
const {
  approveBooking,
  deleteBooking,
  denyBooking,
  getAdminBookings,
  updateAdminBooking,
} = require("../controllers/adminBookingController");
const { requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/me", requireAdmin, getCurrentAdmin);
router.get("/bookings", requireAdmin, getAdminBookings);
router.patch("/bookings/:id", requireAdmin, updateAdminBooking);
router.patch("/bookings/:id/approve", requireAdmin, approveBooking);
router.patch("/bookings/:id/deny", requireAdmin, denyBooking);
router.delete("/bookings/:id", requireAdmin, deleteBooking);

module.exports = router;
