const mongoose = require("mongoose");
const { BOOKING_STATUSES, DEPARTMENTS } = require("../constants/booking");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true, index: true },
    requesterName: { type: String, required: true, trim: true },
    requesterEmail: { type: String, required: true, trim: true, lowercase: true },
    requesterPhone: { type: String, trim: true, default: "" },
    department: { type: String, required: true, enum: DEPARTMENTS },
    purpose: { type: String, required: true, trim: true },
    date: { type: String, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    durationHours: { type: Number, required: true },
    status: { type: String, enum: BOOKING_STATUSES, default: "pending", index: true },
    adminNote: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

bookingSchema.index({ room: 1, date: 1, status: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
