const express = require("express");
const { getRoom, getRooms } = require("../controllers/roomController");

const router = express.Router();

router.get("/", getRooms);
router.get("/:roomIdOrSlug", getRoom);

module.exports = router;
