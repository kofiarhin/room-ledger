const httpError = require("../utils/httpError");

function notFoundMiddleware(req, res, next) {
  next(httpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = notFoundMiddleware;
