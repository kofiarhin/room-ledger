const express = require("express");
const {
  cancelBookingByStatusId,
  createBooking,
  getBookingStatus,
  updateBookingByStatusId,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createBooking);
router.get("/status/:bookingId", getBookingStatus);
router.patch("/status/:bookingId", updateBookingByStatusId);
router.patch("/status/:bookingId/cancel", cancelBookingByStatusId);

module.exports = router;
