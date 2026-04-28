const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { config } = require("../config/env");

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    secure: config.nodeEnv === "production",
    maxAge: 1000 * 60 * 60 * 8,
  };
}

const loginAdmin = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  const expectedEmail = String(config.adminEmail || "").toLowerCase();
  const hash = config.adminPasswordHash || "";
  const isEmailValid = email && email === expectedEmail;
  const isPasswordValid = hash && (await bcrypt.compare(password, hash));

  if (!isEmailValid || !isPasswordValid) {
    throw httpError(401, "Invalid admin credentials.");
  }

  const token = jwt.sign({ email }, config.jwtSecret || "test-secret", { expiresIn: "8h" });
  res.cookie("roomledger_admin", token, cookieOptions());
  res.json({ data: { email } });
});

const logoutAdmin = asyncHandler(async (req, res) => {
  res.clearCookie("roomledger_admin", cookieOptions());
  res.json({ data: { ok: true } });
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
  res.json({ data: req.admin });
});

module.exports = { loginAdmin, logoutAdmin, getCurrentAdmin };
