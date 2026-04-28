const jwt = require("jsonwebtoken");
const { config } = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const requireAdmin = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.roomledger_admin;
  if (!token) throw httpError(401, "Admin authentication required.");

  try {
    const payload = jwt.verify(token, config.jwtSecret || "test-secret");
    req.admin = { email: payload.email };
    next();
  } catch (error) {
    throw httpError(401, "Admin authentication required.");
  }
});

module.exports = { requireAdmin };
